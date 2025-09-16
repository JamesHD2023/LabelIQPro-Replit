/**
 * Additive Analysis Service
 * Enhances ingredient analysis with comprehensive additive information
 * Integrates with existing scoring and health assessment systems
 */

import { additivesDatabase } from './AdditivesDatabase';

class AdditiveAnalysisService {
  constructor() {
    this.database = additivesDatabase;
  }

  /**
   * Enhance ingredient with additive information
   * @param {Object} ingredient - Ingredient object from scanning
   * @returns {Object} Enhanced ingredient with additive data
   */
  enhanceIngredient(ingredient) {
    if (!ingredient || !ingredient.name) return ingredient;

    // Look up additive information
    const additiveInfo = this.database.lookup(ingredient.name);

    if (additiveInfo) {
      return {
        ...ingredient,
        isAdditive: true,
        additiveInfo: {
          eNumber: additiveInfo.eNumber,
          category: additiveInfo.category,
          function: additiveInfo.function,
          sources: additiveInfo.sources,
          safetyScore: additiveInfo.safetyScore,
          regulatoryStatus: additiveInfo.regulatoryStatus,
          healthConcerns: additiveInfo.healthConcerns,
          controversies: additiveInfo.controversies,
          allergenInfo: additiveInfo.allergenInfo
        },
        // Update health profile with additive-specific information
        healthProfile: {
          ...ingredient.healthProfile,
          safetyScore: this.calculateAdditiveScore(additiveInfo),
          isHealthy: additiveInfo.safetyScore >= 70,
          concerns: this.generateConcerns(additiveInfo),
          description: this.generateDescription(additiveInfo),
          regulatoryWarnings: this.generateRegulatoryWarnings(additiveInfo)
        }
      };
    }

    return ingredient;
  }

  /**
   * Calculate safety score for additive
   * @param {Object} additiveInfo - Additive information
   * @returns {number} Safety score (0-100)
   */
  calculateAdditiveScore(additiveInfo) {
    let score = additiveInfo.safetyScore;

    // Adjust score based on regulatory status
    if (!additiveInfo.regulatoryStatus.eu.approved && !additiveInfo.regulatoryStatus.us.approved) {
      score = Math.min(score, 20); // Banned in both regions
    } else if (!additiveInfo.regulatoryStatus.eu.approved || !additiveInfo.regulatoryStatus.us.approved) {
      score = Math.min(score, 40); // Banned in one region
    }

    // Adjust for controversies
    if (additiveInfo.controversies && additiveInfo.controversies.length > 0) {
      score -= additiveInfo.controversies.length * 5;
    }

    // Adjust for health concerns
    if (additiveInfo.healthConcerns && additiveInfo.healthConcerns.length > 0) {
      score -= additiveInfo.healthConcerns.length * 3;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate concerns list for additive
   * @param {Object} additiveInfo - Additive information
   * @returns {Array} List of concerns
   */
  generateConcerns(additiveInfo) {
    const concerns = [];

    // Add health concerns
    if (additiveInfo.healthConcerns && additiveInfo.healthConcerns.length > 0) {
      concerns.push(...additiveInfo.healthConcerns);
    }

    // Add regulatory concerns
    if (!additiveInfo.regulatoryStatus.eu.approved) {
      concerns.push('Banned in European Union');
    }
    if (!additiveInfo.regulatoryStatus.us.approved) {
      concerns.push('Banned or restricted in United States');
    }

    // Add controversy-based concerns
    if (additiveInfo.controversies && additiveInfo.controversies.length > 0) {
      concerns.push('Subject to ongoing safety debates');
    }

    return concerns;
  }

  /**
   * Generate description for additive
   * @param {Object} additiveInfo - Additive information
   * @returns {string} Description
   */
  generateDescription(additiveInfo) {
    let description = `${additiveInfo.name} (${additiveInfo.eNumber}) is a ${additiveInfo.category} used as ${additiveInfo.function}.`;

    // Add source information
    if (additiveInfo.sources && additiveInfo.sources.length > 0) {
      description += ` It is derived from ${additiveInfo.sources.join(', ')}.`;
    }

    // Add safety context
    if (additiveInfo.safetyScore >= 80) {
      description += ' Generally considered safe for consumption.';
    } else if (additiveInfo.safetyScore >= 50) {
      description += ' Has some safety concerns but is approved for use.';
    } else {
      description += ' Has significant safety concerns and regulatory restrictions.';
    }

    return description;
  }

  /**
   * Generate regulatory warnings
   * @param {Object} additiveInfo - Additive information
   * @returns {Array} Regulatory warnings
   */
  generateRegulatoryWarnings(additiveInfo) {
    const warnings = [];

    // EU specific warnings
    if (additiveInfo.regulatoryStatus.eu.restrictions &&
        additiveInfo.regulatoryStatus.eu.restrictions !== 'None') {
      warnings.push(`EU: ${additiveInfo.regulatoryStatus.eu.restrictions}`);
    }

    // US specific warnings
    if (additiveInfo.regulatoryStatus.us.restrictions &&
        additiveInfo.regulatoryStatus.us.restrictions !== 'None') {
      warnings.push(`US: ${additiveInfo.regulatoryStatus.us.restrictions}`);
    }

    // Allergen warnings
    if (additiveInfo.allergenInfo) {
      warnings.push(`Allergen: ${additiveInfo.allergenInfo}`);
    }

    return warnings;
  }

  /**
   * Analyze complete ingredient list for additives
   * @param {Array} ingredients - Array of ingredient objects
   * @returns {Object} Comprehensive additive analysis
   */
  analyzeIngredientList(ingredients) {
    if (!ingredients || !Array.isArray(ingredients)) {
      return this.getEmptyAnalysis();
    }

    const analysis = {
      enhancedIngredients: [],
      additiveSummary: {
        totalAdditives: 0,
        byCategory: {},
        safetyBreakdown: {
          safe: 0,      // 70+
          moderate: 0,  // 40-69
          concerning: 0 // <40
        },
        regulatoryIssues: [],
        controversialAdditives: [],
        bannedAdditives: []
      },
      recommendations: [],
      overallAdditiveScore: 0
    };

    let totalAdditiveScore = 0;
    let additiveCount = 0;

    // Process each ingredient
    ingredients.forEach(ingredient => {
      const enhanced = this.enhanceIngredient(ingredient);
      analysis.enhancedIngredients.push(enhanced);

      if (enhanced.isAdditive) {
        additiveCount++;
        analysis.additiveSummary.totalAdditives++;

        const additiveInfo = enhanced.additiveInfo;

        // Category tracking
        if (!analysis.additiveSummary.byCategory[additiveInfo.category]) {
          analysis.additiveSummary.byCategory[additiveInfo.category] = 0;
        }
        analysis.additiveSummary.byCategory[additiveInfo.category]++;

        // Safety breakdown
        if (additiveInfo.safetyScore >= 70) {
          analysis.additiveSummary.safetyBreakdown.safe++;
        } else if (additiveInfo.safetyScore >= 40) {
          analysis.additiveSummary.safetyBreakdown.moderate++;
        } else {
          analysis.additiveSummary.safetyBreakdown.concerning++;
        }

        // Regulatory issues
        if (!additiveInfo.regulatoryStatus.eu.approved || !additiveInfo.regulatoryStatus.us.approved) {
          analysis.additiveSummary.regulatoryIssues.push({
            name: additiveInfo.name,
            eNumber: additiveInfo.eNumber,
            issue: !additiveInfo.regulatoryStatus.eu.approved ? 'Banned in EU' : 'Banned in US'
          });
        }

        // Controversial additives
        if (additiveInfo.controversies && additiveInfo.controversies.length > 0) {
          analysis.additiveSummary.controversialAdditives.push({
            name: additiveInfo.name,
            eNumber: additiveInfo.eNumber,
            controversies: additiveInfo.controversies
          });
        }

        // Banned additives
        if (!additiveInfo.regulatoryStatus.eu.approved && !additiveInfo.regulatoryStatus.us.approved) {
          analysis.additiveSummary.bannedAdditives.push({
            name: additiveInfo.name,
            eNumber: additiveInfo.eNumber
          });
        }

        totalAdditiveScore += additiveInfo.safetyScore;
      }
    });

    // Calculate overall additive score
    if (additiveCount > 0) {
      analysis.overallAdditiveScore = Math.round(totalAdditiveScore / additiveCount);
    } else {
      analysis.overallAdditiveScore = 100; // No additives = best score
    }

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis);

    return analysis;
  }

  /**
   * Generate recommendations based on additive analysis
   * @param {Object} analysis - Additive analysis results
   * @returns {Array} Recommendations
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    // High number of additives
    if (analysis.additiveSummary.totalAdditives > 10) {
      recommendations.push({
        type: 'warning',
        title: 'High Number of Additives',
        message: `This product contains ${analysis.additiveSummary.totalAdditives} additives. Consider choosing products with fewer additives.`
      });
    }

    // Concerning additives
    if (analysis.additiveSummary.safetyBreakdown.concerning > 0) {
      recommendations.push({
        type: 'danger',
        title: 'Safety Concerns',
        message: `${analysis.additiveSummary.safetyBreakdown.concerning} additives have significant safety concerns.`
      });
    }

    // Regulatory issues
    if (analysis.additiveSummary.regulatoryIssues.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Regulatory Restrictions',
        message: `${analysis.additiveSummary.regulatoryIssues.length} additives are banned or restricted in some regions.`
      });
    }

    // Controversial additives
    if (analysis.additiveSummary.controversialAdditives.length > 0) {
      recommendations.push({
        type: 'info',
        title: 'Controversial Ingredients',
        message: `${analysis.additiveSummary.controversialAdditives.length} additives are subject to ongoing safety debates.`
      });
    }

    // Positive feedback for clean products
    if (analysis.additiveSummary.totalAdditives === 0) {
      recommendations.push({
        type: 'success',
        title: 'No Additives Detected',
        message: 'This product appears to be free from artificial additives.'
      });
    } else if (analysis.overallAdditiveScore >= 80) {
      recommendations.push({
        type: 'success',
        title: 'Safe Additives',
        message: 'The additives in this product are generally considered safe.'
      });
    }

    return recommendations;
  }

  /**
   * Get empty analysis structure
   * @returns {Object} Empty analysis object
   */
  getEmptyAnalysis() {
    return {
      enhancedIngredients: [],
      additiveSummary: {
        totalAdditives: 0,
        byCategory: {},
        safetyBreakdown: { safe: 0, moderate: 0, concerning: 0 },
        regulatoryIssues: [],
        controversialAdditives: [],
        bannedAdditives: []
      },
      recommendations: [],
      overallAdditiveScore: 100
    };
  }

  /**
   * Get additive information by category
   * @param {string} category - Category to search
   * @returns {Array} Additives in category
   */
  getAdditivesByCategory(category) {
    return this.database.getByCategory(category);
  }

  /**
   * Get all controversial additives
   * @returns {Array} Controversial additives
   */
  getControversialAdditives() {
    return this.database.getControversialAdditives();
  }

  /**
   * Get regulatory differences between EU and US
   * @returns {Array} Additives with regulatory differences
   */
  getRegulatoryDifferences() {
    return this.database.getRegulatoryDifferences();
  }

  /**
   * Get recent regulatory changes
   * @returns {Array} Recent regulatory updates
   */
  getRecentRegulatoryChanges() {
    return this.database.getRecentRegulatoryChanges();
  }

  /**
   * Search for specific additive
   * @param {string} query - Search query
   * @returns {Object|null} Additive information
   */
  searchAdditive(query) {
    return this.database.lookup(query);
  }
}

// Create singleton instance
export const additiveAnalysisService = new AdditiveAnalysisService();
export default additiveAnalysisService;