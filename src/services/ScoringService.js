import { offlineService } from './OfflineService';
import { additiveAnalysisService } from './AdditiveAnalysisService';

class ScoringService {
  constructor() {
    this.baseWeights = {
      food: { safety: 0.6, allergen: 0.25, nutrition: 0.15 },
      cosmetic: { safety: 0.7, skin: 0.2, environmental: 0.1 },
      household: { safety: 0.8, environmental: 0.15, usage: 0.05 }
    };

    this.hazardMultipliers = {
      safe: 1.0,
      low: 0.9,
      medium: 0.7,
      high: 0.4,
      danger: 0.1
    };
  }

  async calculateOverallScore(ingredients, category = 'food', userProfile = null) {
    try {
      if (!ingredients || ingredients.length === 0) {
        return {
          score: 50,
          level: 'unknown',
          description: 'No ingredients to analyze',
          warnings: [],
          breakdown: {},
          additiveAnalysis: additiveAnalysisService.getEmptyAnalysis()
        };
      }

      // Get user profile for personalized scoring
      const profile = userProfile || await offlineService.getUserProfile();

      // Enhance ingredients with additive analysis
      const additiveAnalysis = additiveAnalysisService.analyzeIngredientList(ingredients);
      const enhancedIngredients = additiveAnalysis.enhancedIngredients;

      // Calculate base scores for each ingredient (using enhanced ingredients)
      const ingredientScores = await this.calculateIngredientScores(enhancedIngredients, category, profile);

      // Calculate weighted overall score (including additive penalties)
      const overallScore = this.calculateWeightedScore(ingredientScores, category, additiveAnalysis);

      // Generate warnings and recommendations (including additive warnings)
      const warnings = this.generateWarnings(ingredientScores, profile, additiveAnalysis);

      // Create detailed breakdown
      const breakdown = this.createScoreBreakdown(ingredientScores, category);

      const result = {
        score: Math.max(0, Math.min(100, overallScore)),
        level: this.getScoreLevel(overallScore),
        description: this.getScoreDescription(overallScore, category),
        warnings,
        breakdown,
        ingredientScores,
        additiveAnalysis
      };

      return result;
    } catch (error) {
      console.error('Score calculation failed:', error);
      return {
        score: 50,
        level: 'unknown',
        description: 'Score calculation failed',
        warnings: ['Unable to calculate safety score'],
        breakdown: {},
        additiveAnalysis: additiveAnalysisService.getEmptyAnalysis()
      };
    }
  }

  async calculateIngredientScores(ingredients, category, userProfile) {
    const scores = [];

    for (const ingredient of ingredients) {
      try {
        const score = await this.calculateSingleIngredientScore(ingredient, category, userProfile);
        scores.push({
          ingredient,
          ...score
        });
      } catch (error) {
        console.warn('Failed to score ingredient:', ingredient.name, error);
        scores.push({
          ingredient,
          baseScore: 50,
          adjustedScore: 50,
          factors: { unknown: true },
          warnings: []
        });
      }
    }

    return scores;
  }

  async calculateSingleIngredientScore(ingredient, category, userProfile) {
    // Use additive-enhanced safety score if available, otherwise use default
    let baseScore = ingredient.additiveInfo?.safetyScore || ingredient.safetyScore || 50;
    let adjustedScore = baseScore;
    const factors = {};
    const warnings = [];

    // Apply additive-specific scoring if this is an additive
    if (ingredient.isAdditive && ingredient.additiveInfo) {
      factors.additive = {
        eNumber: ingredient.additiveInfo.eNumber,
        category: ingredient.additiveInfo.category,
        safetyScore: ingredient.additiveInfo.safetyScore,
        regulatoryStatus: ingredient.additiveInfo.regulatoryStatus
      };

      // Apply regulatory penalties
      if (!ingredient.additiveInfo.regulatoryStatus.eu.approved) {
        adjustedScore *= 0.6; // Penalty for EU ban
        warnings.push(`${ingredient.name} is banned in the European Union`);
      }
      if (!ingredient.additiveInfo.regulatoryStatus.us.approved) {
        adjustedScore *= 0.6; // Penalty for US ban
        warnings.push(`${ingredient.name} is banned or restricted in the United States`);
      }

      // Add controversy warnings
      if (ingredient.additiveInfo.controversies && ingredient.additiveInfo.controversies.length > 0) {
        warnings.push(`${ingredient.name} is subject to ongoing safety debates`);
      }

      // Add health concern warnings
      if (ingredient.additiveInfo.healthConcerns && ingredient.additiveInfo.healthConcerns.length > 0) {
        const majorConcerns = ingredient.additiveInfo.healthConcerns.slice(0, 2);
        warnings.push(`${ingredient.name}: ${majorConcerns.join(', ')}`);
      }
    }

    // Apply hazard level multiplier
    if (ingredient.hazardLevel && this.hazardMultipliers[ingredient.hazardLevel]) {
      const multiplier = this.hazardMultipliers[ingredient.hazardLevel];
      adjustedScore *= multiplier;
      factors.hazardLevel = {
        level: ingredient.hazardLevel,
        multiplier,
        impact: (1 - multiplier) * -100
      };

      if (ingredient.hazardLevel === 'high' || ingredient.hazardLevel === 'danger') {
        warnings.push(`${ingredient.name} has ${ingredient.hazardLevel} safety concerns`);
      }
    }

    // Check for user-specific allergies and sensitivities
    if (userProfile) {
      const allergyImpact = this.checkUserAllergies(ingredient, userProfile);
      if (allergyImpact.hasAllergy) {
        adjustedScore *= 0.1; // Severe penalty for known allergens
        factors.allergy = allergyImpact;
        warnings.push(`⚠️ ALLERGEN: ${ingredient.name} may cause allergic reactions`);
      }

      const sensitivityImpact = this.checkUserSensitivities(ingredient, userProfile);
      if (sensitivityImpact.hasSensitivity) {
        adjustedScore *= 0.6; // Moderate penalty for sensitivities
        factors.sensitivity = sensitivityImpact;
        warnings.push(`${ingredient.name} may cause skin/health sensitivities`);
      }
    }

    // Category-specific adjustments
    const categoryAdjustment = this.getCategorySpecificAdjustment(ingredient, category);
    if (categoryAdjustment !== 1.0) {
      adjustedScore *= categoryAdjustment;
      factors.categoryAdjustment = {
        category,
        multiplier: categoryAdjustment,
        impact: (categoryAdjustment - 1) * 100
      };
    }

    // Unknown ingredient penalty
    if (!ingredient.isKnown) {
      adjustedScore *= 0.8;
      factors.unknown = {
        penalty: 20,
        reason: 'Unknown ingredient with limited safety data'
      };
      warnings.push(`${ingredient.name} is not in our database - limited safety information available`);
    }

    return {
      baseScore,
      adjustedScore: Math.max(0, Math.min(100, adjustedScore)),
      factors,
      warnings
    };
  }

  checkUserAllergies(ingredient, userProfile) {
    if (!userProfile.allergies || userProfile.allergies.length === 0) {
      return { hasAllergy: false };
    }

    for (const allergy of userProfile.allergies) {
      if (this.isIngredientMatch(ingredient, allergy)) {
        return {
          hasAllergy: true,
          allergen: allergy,
          severity: allergy.severity || 'medium'
        };
      }
    }

    return { hasAllergy: false };
  }

  checkUserSensitivities(ingredient, userProfile) {
    if (!userProfile.sensitivities || userProfile.sensitivities.length === 0) {
      return { hasSensitivity: false };
    }

    for (const sensitivity of userProfile.sensitivities) {
      if (this.isIngredientMatch(ingredient, sensitivity)) {
        return {
          hasSensitivity: true,
          sensitivity: sensitivity,
          severity: sensitivity.severity || 'low'
        };
      }
    }

    return { hasSensitivity: false };
  }

  isIngredientMatch(ingredient, condition) {
    const searchTerms = [
      ingredient.name.toLowerCase(),
      ingredient.normalizedName?.toLowerCase(),
      ...(ingredient.synonyms || []).map(s => s.toLowerCase())
    ].filter(Boolean);

    const conditionTerms = [
      condition.name?.toLowerCase(),
      condition.ingredient?.toLowerCase(),
      ...(condition.synonyms || []).map(s => s.toLowerCase())
    ].filter(Boolean);

    return searchTerms.some(searchTerm =>
      conditionTerms.some(conditionTerm =>
        searchTerm.includes(conditionTerm) || conditionTerm.includes(searchTerm)
      )
    );
  }

  getCategorySpecificAdjustment(ingredient, category) {
    // Different ingredients have different risk profiles by category
    const adjustments = {
      food: {
        'preservative': 0.9,
        'artificial color': 0.8,
        'flavor enhancer': 0.85,
        'sweetener': 0.9
      },
      cosmetic: {
        'fragrance': 0.7,
        'preservative': 0.8,
        'colorant': 0.85,
        'surfactant': 0.9
      },
      household: {
        'surfactant': 0.6,
        'solvent': 0.5,
        'bleach': 0.4,
        'acid': 0.6
      }
    };

    const categoryAdjustments = adjustments[category];
    if (!categoryAdjustments) return 1.0;

    // Check if ingredient matches any category-specific concerns
    for (const [concernType, multiplier] of Object.entries(categoryAdjustments)) {
      if (ingredient.category?.toLowerCase().includes(concernType) ||
          ingredient.name.toLowerCase().includes(concernType)) {
        return multiplier;
      }
    }

    return 1.0;
  }

  calculateWeightedScore(ingredientScores, category, additiveAnalysis) {
    if (ingredientScores.length === 0) return 50;

    // Simple average for now - could be enhanced with ingredient quantity weighting
    const totalScore = ingredientScores.reduce((sum, item) => sum + item.adjustedScore, 0);
    let averageScore = totalScore / ingredientScores.length;

    // Apply additive-based penalties
    if (additiveAnalysis) {
      // Penalty for high number of additives
      if (additiveAnalysis.additiveSummary.totalAdditives > 10) {
        averageScore *= 0.9; // 10% penalty for excessive additives
      } else if (additiveAnalysis.additiveSummary.totalAdditives > 5) {
        averageScore *= 0.95; // 5% penalty for many additives
      }

      // Penalty for concerning additives
      const concerningCount = additiveAnalysis.additiveSummary.safetyBreakdown.concerning;
      if (concerningCount > 0) {
        averageScore *= Math.max(0.6, 1 - (concerningCount * 0.1)); // Up to 40% penalty
      }

      // Penalty for banned additives
      if (additiveAnalysis.additiveSummary.bannedAdditives.length > 0) {
        averageScore *= 0.5; // 50% penalty for any banned additives
      }

      // Penalty for regulatory issues
      if (additiveAnalysis.additiveSummary.regulatoryIssues.length > 0) {
        averageScore *= 0.8; // 20% penalty for regulatory issues
      }
    }

    // Apply category-specific overall adjustments
    const categoryMultipliers = {
      food: 1.0,
      cosmetic: 0.95, // Slightly more conservative for cosmetics
      household: 0.9  // More conservative for household products
    };

    return averageScore * (categoryMultipliers[category] || 1.0);
  }

  generateWarnings(ingredientScores, userProfile, additiveAnalysis) {
    const warnings = [];
    const warningSet = new Set();

    // Add ingredient-specific warnings
    for (const scoreData of ingredientScores) {
      for (const warning of scoreData.warnings) {
        if (!warningSet.has(warning)) {
          warningSet.add(warning);
          warnings.push(warning);
        }
      }
    }

    // Add additive-specific warnings
    if (additiveAnalysis) {
      // Banned additives warning
      if (additiveAnalysis.additiveSummary.bannedAdditives.length > 0) {
        warnings.unshift(`🚫 Contains ${additiveAnalysis.additiveSummary.bannedAdditives.length} banned additive(s)`);
      }

      // Regulatory differences warning
      if (additiveAnalysis.additiveSummary.regulatoryIssues.length > 0) {
        warnings.push(`⚖️ ${additiveAnalysis.additiveSummary.regulatoryIssues.length} additive(s) have regulatory restrictions`);
      }

      // High additive count warning
      if (additiveAnalysis.additiveSummary.totalAdditives > 10) {
        warnings.push(`🧪 High additive count: ${additiveAnalysis.additiveSummary.totalAdditives} additives detected`);
      }

      // Controversial additives warning
      if (additiveAnalysis.additiveSummary.controversialAdditives.length > 0) {
        warnings.push(`❓ ${additiveAnalysis.additiveSummary.controversialAdditives.length} controversial additive(s) with ongoing safety debates`);
      }

      // Add recommendations as warnings
      if (additiveAnalysis.recommendations) {
        additiveAnalysis.recommendations
          .filter(rec => rec.type === 'danger' || rec.type === 'warning')
          .slice(0, 2)
          .forEach(rec => warnings.push(`${rec.title}: ${rec.message}`));
      }
    }

    // Add overall warnings based on score distribution
    const dangerousIngredients = ingredientScores.filter(s => s.adjustedScore < 30);
    if (dangerousIngredients.length > 0) {
      warnings.unshift(`⚠️ ${dangerousIngredients.length} ingredient(s) with safety concerns detected`);
    }

    return warnings.slice(0, 8); // Increased limit to accommodate additive warnings
  }

  createScoreBreakdown(ingredientScores, category) {
    const breakdown = {
      totalIngredients: ingredientScores.length,
      knownIngredients: ingredientScores.filter(s => s.ingredient.isKnown).length,
      averageBaseScore: 0,
      averageAdjustedScore: 0,
      scoreDistribution: {
        excellent: 0, // 80-100
        good: 0,      // 60-79
        fair: 0,      // 40-59
        poor: 0,      // 20-39
        danger: 0     // 0-19
      },
      topConcerns: [],
      category
    };

    if (ingredientScores.length > 0) {
      breakdown.averageBaseScore = ingredientScores.reduce((sum, s) => sum + s.baseScore, 0) / ingredientScores.length;
      breakdown.averageAdjustedScore = ingredientScores.reduce((sum, s) => sum + s.adjustedScore, 0) / ingredientScores.length;

      // Calculate score distribution
      for (const scoreData of ingredientScores) {
        const score = scoreData.adjustedScore;
        if (score >= 80) breakdown.scoreDistribution.excellent++;
        else if (score >= 60) breakdown.scoreDistribution.good++;
        else if (score >= 40) breakdown.scoreDistribution.fair++;
        else if (score >= 20) breakdown.scoreDistribution.poor++;
        else breakdown.scoreDistribution.danger++;
      }

      // Identify top concerns
      breakdown.topConcerns = ingredientScores
        .filter(s => s.adjustedScore < 50)
        .sort((a, b) => a.adjustedScore - b.adjustedScore)
        .slice(0, 3)
        .map(s => ({
          ingredient: s.ingredient.name,
          score: s.adjustedScore,
          mainConcern: this.getMainConcern(s.factors)
        }));
    }

    return breakdown;
  }

  getMainConcern(factors) {
    if (factors.allergy) return 'Allergen';
    if (factors.hazardLevel && factors.hazardLevel.level === 'high') return 'High Risk';
    if (factors.sensitivity) return 'Sensitivity';
    if (factors.unknown) return 'Unknown Safety';
    return 'General Safety';
  }

  getScoreLevel(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    if (score >= 20) return 'poor';
    return 'danger';
  }

  getScoreDescription(score, category) {
    const level = this.getScoreLevel(score);
    const descriptions = {
      excellent: `This ${category} product has excellent safety profile with minimal concerns.`,
      good: `This ${category} product is generally safe with minor considerations.`,
      fair: `This ${category} product has moderate safety concerns that should be considered.`,
      poor: `This ${category} product has significant safety concerns.`,
      danger: `This ${category} product has serious safety concerns and should be used with caution.`
    };

    return descriptions[level];
  }
}

export const scoringService = new ScoringService();