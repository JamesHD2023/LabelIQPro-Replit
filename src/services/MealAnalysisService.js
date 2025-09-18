import { apiOrchestrator } from './APIOrchestrator';
import { offlineService } from './OfflineService';
import { MealAnalysisUtils } from './MealAnalysisServiceUtils';
import { FoodRecognitionUtils } from './FoodRecognitionServiceUtils';

class MealAnalysisService {
  constructor() {
    this.nutritionCache = new Map();
    this.healthProfileCache = new Map();

    // Nutritional reference database
    this.nutritionDB = {
      // Per 100g values
      proteins: {
        'chicken breast': { calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0 },
        'beef': { calories: 250, protein: 26, fat: 15, carbs: 0, fiber: 0 },
        'fish': { calories: 206, protein: 22, fat: 12, carbs: 0, fiber: 0 },
        'eggs': { calories: 155, protein: 13, fat: 11, carbs: 1.1, fiber: 0 },
        'tofu': { calories: 76, protein: 8, fat: 4.8, carbs: 1.9, fiber: 0.3 },
        'beans': { calories: 347, protein: 22, fat: 1.2, carbs: 63, fiber: 15 }
      },
      carbohydrates: {
        'rice': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28, fiber: 0.4 },
        'bread': { calories: 265, protein: 9, fat: 3.2, carbs: 49, fiber: 2.7 },
        'pasta': { calories: 371, protein: 13, fat: 1.1, carbs: 75, fiber: 3.2 },
        'potato': { calories: 77, protein: 2, fat: 0.1, carbs: 17, fiber: 2.2 }
      },
      vegetables: {
        'broccoli': { calories: 34, protein: 2.8, fat: 0.4, carbs: 7, fiber: 2.6 },
        'carrots': { calories: 41, protein: 0.9, fat: 0.2, carbs: 10, fiber: 2.8 },
        'spinach': { calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2 },
        'tomato': { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.2 }
      },
      fruits: {
        'apple': { calories: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4 },
        'banana': { calories: 89, protein: 1.1, fat: 0.3, carbs: 23, fiber: 2.6 },
        'orange': { calories: 47, protein: 0.9, fat: 0.1, carbs: 12, fiber: 2.4 }
      }
    };

    // Health impact factors
    this.healthFactors = {
      preparation: {
        'grilled': { healthScore: 85, benefits: ['Lower fat content', 'Retains nutrients'] },
        'fried': { healthScore: 45, concerns: ['High fat', 'Acrylamide formation'] },
        'steamed': { healthScore: 95, benefits: ['Preserves nutrients', 'No added fats'] },
        'baked': { healthScore: 80, benefits: ['Moderate fat', 'Good nutrient retention'] },
        'raw': { healthScore: 90, benefits: ['Maximum nutrients', 'Natural enzymes'] },
        'processed': { healthScore: 35, concerns: ['Additives', 'High sodium', 'Preservatives'] }
      },
      ingredients: {
        'organic': { modifier: 1.1, benefits: ['No pesticides', 'Better nutrient profile'] },
        'whole_grain': { modifier: 1.15, benefits: ['High fiber', 'B vitamins', 'Minerals'] },
        'lean_protein': { modifier: 1.05, benefits: ['Complete amino acids', 'Low saturated fat'] },
        'processed_meat': { modifier: 0.7, concerns: ['Nitrates', 'High sodium', 'Cancer risk'] },
        'added_sugar': { modifier: 0.8, concerns: ['Empty calories', 'Blood sugar spikes'] },
        'trans_fat': { modifier: 0.5, concerns: ['Cardiovascular risk', 'Inflammation'] }
      }
    };

    // Recommended daily values (RDV)
    this.dailyValues = {
      calories: { adult_male: 2500, adult_female: 2000, child: 1800 },
      protein: { adult_male: 56, adult_female: 46, child: 30 }, // grams
      carbs: { adult_male: 300, adult_female: 225, child: 200 }, // grams
      fat: { adult_male: 70, adult_female: 65, child: 60 }, // grams
      fiber: { adult_male: 38, adult_female: 25, child: 20 }, // grams
      sodium: { adult_male: 2300, adult_female: 2300, child: 1500 } // mg
    };
  }

  /**
   * Calculate comprehensive nutritional information for a meal
   */
  async calculateNutrition(mealComponents, portions = null, userProfile = null) {
    try {
      const nutrition = {
        totals: {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0
        },
        components: [],
        dailyValuePercentages: {},
        macroBreakdown: {},
        micronutrients: {},
        confidence: 0
      };

      // Calculate nutrition for each component
      for (const component of mealComponents) {
        const componentNutrition = await this.calculateComponentNutrition(
          component,
          portions?.[component.id]
        );

        nutrition.components.push({
          id: component.id,
          name: component.name,
          ...componentNutrition
        });

        // Add to totals
        for (const [key, value] of Object.entries(componentNutrition.nutrients)) {
          if (nutrition.totals[key] !== undefined) {
            nutrition.totals[key] += value;
          }
        }
      }

      // Calculate macro breakdown percentages
      const totalCalories = nutrition.totals.calories;
      nutrition.macroBreakdown = {
        protein: {
          grams: nutrition.totals.protein,
          calories: nutrition.totals.protein * 4,
          percentage: totalCalories > 0 ? (nutrition.totals.protein * 4 / totalCalories) * 100 : 0
        },
        carbohydrates: {
          grams: nutrition.totals.carbohydrates,
          calories: nutrition.totals.carbohydrates * 4,
          percentage: totalCalories > 0 ? (nutrition.totals.carbohydrates * 4 / totalCalories) * 100 : 0
        },
        fat: {
          grams: nutrition.totals.fat,
          calories: nutrition.totals.fat * 9,
          percentage: totalCalories > 0 ? (nutrition.totals.fat * 9 / totalCalories) * 100 : 0
        }
      };

      // Calculate daily value percentages
      nutrition.dailyValuePercentages = this.calculateDailyValuePercentages(
        nutrition.totals,
        userProfile
      );

      // Estimate micronutrients
      nutrition.micronutrients = await MealAnalysisUtils.estimateMicronutrients(mealComponents, portions);

      // Calculate overall confidence
      nutrition.confidence = this.calculateNutritionConfidence(nutrition.components);

      return nutrition;
    } catch (error) {
      console.error('Nutrition calculation failed:', error);
      return this.createFallbackNutrition(mealComponents);
    }
  }

  /**
   * Calculate nutrition for individual component
   */
  async calculateComponentNutrition(component, portion) {
    const cacheKey = `${component.name}_${JSON.stringify(portion)}`;

    if (this.nutritionCache.has(cacheKey)) {
      return this.nutritionCache.get(cacheKey);
    }

    try {
      // Try to get nutrition from external API first
      let nutritionData = await this.fetchNutritionFromAPI(component.name);

      // Fallback to local database
      if (!nutritionData) {
        nutritionData = MealAnalysisUtils.getGenericNutrition(component.category);
        nutritionData.source = 'local_database';
        nutritionData.confidence = 0.6;
      }

      // Apply portion scaling
      const portionMultiplier = this.calculatePortionMultiplier(portion);
      const scaledNutrition = this.scaleNutrition(nutritionData, portionMultiplier);

      const result = {
        nutrients: scaledNutrition,
        portion: portion || { weight: { value: 100, unit: 'g' } },
        confidence: nutritionData.confidence || 0.7,
        source: nutritionData.source || 'local_database'
      };

      // Cache result
      this.nutritionCache.set(cacheKey, result);
      setTimeout(() => this.nutritionCache.delete(cacheKey), 1800000); // 30 minutes

      return result;
    } catch (error) {
      console.error(`Failed to get nutrition for ${component.name}:`, error);
      return MealAnalysisUtils.createFallbackComponentNutrition(component);
    }
  }

  /**
   * Fetch nutrition data from external API
   */
  async fetchNutritionFromAPI(foodName) {
    try {
      // Try USDA API first
      const usdaData = await this.fetchUSDANutrition(foodName);
      if (usdaData) return usdaData;

      // Fallback to Edamam
      const edamamData = await this.fetchEdamamNutrition(foodName);
      if (edamamData) return edamamData;

      return null;
    } catch (error) {
      console.warn('API nutrition fetch failed:', error);
      return null;
    }
  }

  /**
   * Fetch from USDA FoodData Central
   */
  async fetchUSDANutrition(foodName) {
    const config = apiOrchestrator.apiConfig.nutrition.usda;

    const searchResponse = await fetch(
      `${config.url}/foods/search?query=${encodeURIComponent(foodName)}&api_key=${config.key}`
    );

    if (!searchResponse.ok) return null;

    const searchData = await searchResponse.json();

    if (!searchData.foods || searchData.foods.length === 0) return null;

    const food = searchData.foods[0];

    return {
      calories: this.extractNutrient(food.foodNutrients, 'Energy'),
      protein: this.extractNutrient(food.foodNutrients, 'Protein'),
      carbs: this.extractNutrient(food.foodNutrients, 'Carbohydrate, by difference'),
      fat: this.extractNutrient(food.foodNutrients, 'Total lipid (fat)'),
      fiber: this.extractNutrient(food.foodNutrients, 'Fiber, total dietary'),
      sugar: this.extractNutrient(food.foodNutrients, 'Sugars, total including NLEA'),
      sodium: this.extractNutrient(food.foodNutrients, 'Sodium'),
      source: 'USDA',
      confidence: 0.9
    };
  }

  /**
   * Extract specific nutrient from USDA food nutrients array
   */
  extractNutrient(nutrients, nutrientName) {
    const nutrient = nutrients.find(n => n.nutrientName === nutrientName);
    return nutrient ? nutrient.value : 0;
  }

  /**
   * Get nutrition from local database
   */
  getNutritionFromLocal(foodName, category) {
    const categoryDB = this.nutritionDB[category];

    if (!categoryDB) {
      return this.getGenericNutrition(category);
    }

    // Try exact match first
    let nutritionData = categoryDB[foodName.toLowerCase()];

    // Try partial matches
    if (!nutritionData) {
      const matchedKey = Object.keys(categoryDB).find(key =>
        foodName.toLowerCase().includes(key) || key.includes(foodName.toLowerCase())
      );
      nutritionData = matchedKey ? categoryDB[matchedKey] : null;
    }

    if (nutritionData) {
      return {
        ...nutritionData,
        sugar: nutritionData.sugar || nutritionData.carbs * 0.1, // Estimate
        sodium: nutritionData.sodium || 100, // Default estimate
        source: 'local_database',
        confidence: 0.7
      };
    }

    return this.getGenericNutrition(category);
  }

  /**
   * Get generic nutrition estimates by category
   */
  getGenericNutrition(category) {
    const generic = {
      proteins: { calories: 200, protein: 25, fat: 8, carbs: 2, fiber: 0 },
      carbohydrates: { calories: 250, protein: 5, fat: 2, carbs: 50, fiber: 3 },
      vegetables: { calories: 30, protein: 2, fat: 0.3, carbs: 6, fiber: 2.5 },
      fruits: { calories: 60, protein: 0.5, fat: 0.2, carbs: 15, fiber: 2 },
      dairy: { calories: 120, protein: 8, fat: 6, carbs: 8, fiber: 0 },
      fats: { calories: 400, protein: 2, fat: 44, carbs: 2, fiber: 1 },
      other: { calories: 150, protein: 5, fat: 5, carbs: 20, fiber: 1.5 }
    };

    const base = generic[category] || generic.other;

    return {
      ...base,
      sugar: base.carbs * 0.3,
      sodium: 150,
      source: 'generic_estimate',
      confidence: 0.4
    };
  }

  /**
   * Calculate health impact assessment
   */
  async assessHealthImpact(mealComponents, preparationMethods, userProfile = null) {
    try {
      const assessment = {
        overallHealthScore: 0,
        benefits: [],
        concerns: [],
        recommendations: [],
        dietaryAlignment: {},
        allergenWarnings: [],
        preparationImpact: {},
        nutritionalQuality: {}
      };

      // Assess each component
      let totalScore = 0;
      let componentCount = 0;

      for (const component of mealComponents) {
        const componentHealth = await this.assessComponentHealth(component);
        totalScore += componentHealth.score;
        componentCount++;

        assessment.benefits.push(...componentHealth.benefits);
        assessment.concerns.push(...componentHealth.concerns);
      }

      // Calculate base health score
      assessment.overallHealthScore = componentCount > 0 ? totalScore / componentCount : 50;

      // Apply preparation method impact
      if (preparationMethods?.methods) {
        const prepImpact = this.assessPreparationImpact(preparationMethods.methods);
        assessment.overallHealthScore *= prepImpact.multiplier;
        assessment.preparationImpact = prepImpact;
        assessment.benefits.push(...prepImpact.benefits);
        assessment.concerns.push(...prepImpact.concerns);
      }

      // Check dietary alignment
      if (userProfile?.dietaryPreferences) {
        assessment.dietaryAlignment = MealAnalysisUtils.checkDietaryAlignment(
          mealComponents,
          userProfile.dietaryPreferences
        );
      }

      // Check allergen warnings
      if (userProfile?.allergies) {
        assessment.allergenWarnings = MealAnalysisUtils.checkAllergenWarnings(
          mealComponents,
          userProfile.allergies
        );
      }

      // Assess nutritional quality
      assessment.nutritionalQuality = await MealAnalysisUtils.assessNutritionalQuality(mealComponents);

      // Generate personalized recommendations
      assessment.recommendations = FoodRecognitionUtils.generateHealthRecommendations(
        assessment,
        userProfile
      );

      // Finalize score (0-100)
      assessment.overallHealthScore = Math.max(0, Math.min(100, assessment.overallHealthScore));

      return assessment;
    } catch (error) {
      console.error('Health impact assessment failed:', error);
      return this.createFallbackHealthAssessment();
    }
  }

  /**
   * Assess individual component health profile
   */
  async assessComponentHealth(component) {
    const cacheKey = `health_${component.name}_${component.category}`;

    if (this.healthProfileCache.has(cacheKey)) {
      return this.healthProfileCache.get(cacheKey);
    }

    let score = 50; // Base neutral score
    const benefits = [];
    const concerns = [];

    // Category-based scoring
    const categoryScores = {
      vegetables: 85,
      fruits: 80,
      proteins: 75,
      carbohydrates: 65,
      dairy: 60,
      fats: 45,
      processed: 30,
      beverages: 40
    };

    score = categoryScores[component.category] || 50;

    // Add category-specific benefits/concerns
    switch (component.category) {
      case 'vegetables':
        benefits.push('High in vitamins and minerals', 'Rich in antioxidants', 'Low in calories');
        break;
      case 'fruits':
        benefits.push('Natural vitamins', 'Fiber content', 'Natural antioxidants');
        break;
      case 'proteins':
        benefits.push('Essential amino acids', 'Muscle building', 'Satiety');
        if (component.name.toLowerCase().includes('fish')) {
          benefits.push('Omega-3 fatty acids');
          score += 5;
        }
        if (component.name.toLowerCase().includes('processed')) {
          concerns.push('High sodium content', 'Preservatives');
          score -= 15;
        }
        break;
      case 'processed':
        concerns.push('High sodium', 'Preservatives', 'Added sugars');
        break;
    }

    // Check for specific ingredient modifiers
    const name = component.name.toLowerCase();

    if (name.includes('organic')) {
      score += 10;
      benefits.push('Organic - no synthetic pesticides');
    }

    if (name.includes('whole grain')) {
      score += 8;
      benefits.push('Whole grains - higher fiber and nutrients');
    }

    if (name.includes('fried') || name.includes('deep fried')) {
      score -= 15;
      concerns.push('High in unhealthy fats');
    }

    if (name.includes('sugar') || name.includes('sweetened')) {
      score -= 10;
      concerns.push('Added sugars');
    }

    const result = {
      score: Math.max(0, Math.min(100, score)),
      benefits: [...new Set(benefits)], // Remove duplicates
      concerns: [...new Set(concerns)]
    };

    this.healthProfileCache.set(cacheKey, result);
    return result;
  }

  /**
   * Assess impact of preparation methods
   */
  assessPreparationImpact(preparationMethods) {
    let multiplier = 1.0;
    const benefits = [];
    const concerns = [];
    const methodImpacts = [];

    for (const method of preparationMethods) {
      const methodData = this.healthFactors.preparation[method];

      if (methodData) {
        const methodMultiplier = methodData.healthScore / 50; // Normalize around 1.0
        multiplier = (multiplier + methodMultiplier) / 2; // Average effect

        methodImpacts.push({
          method,
          score: methodData.healthScore,
          multiplier: methodMultiplier
        });

        if (methodData.benefits) {
          benefits.push(...methodData.benefits);
        }

        if (methodData.concerns) {
          concerns.push(...methodData.concerns);
        }
      }
    }

    return {
      multiplier,
      benefits: [...new Set(benefits)],
      concerns: [...new Set(concerns)],
      methodImpacts,
      overallPreparationScore: multiplier * 50
    };
  }

  /**
   * Check dietary alignment (vegetarian, vegan, keto, etc.)
   */
  checkDietaryAlignment(components, dietaryPreferences) {
    const alignment = {};

    for (const preference of dietaryPreferences) {
      alignment[preference] = this.checkSpecificDiet(components, preference);
    }

    return alignment;
  }

  checkSpecificDiet(components, diet) {
    const dietRules = {
      vegetarian: {
        forbidden: ['meat', 'chicken', 'beef', 'pork', 'fish', 'seafood'],
        allowed: ['vegetables', 'fruits', 'dairy', 'carbohydrates']
      },
      vegan: {
        forbidden: ['meat', 'chicken', 'beef', 'pork', 'fish', 'seafood', 'dairy', 'eggs'],
        allowed: ['vegetables', 'fruits', 'carbohydrates', 'nuts']
      },
      keto: {
        forbidden: ['bread', 'rice', 'pasta', 'potato', 'sugar'],
        preferred: ['meat', 'fish', 'eggs', 'cheese', 'avocado']
      },
      paleo: {
        forbidden: ['grains', 'dairy', 'legumes', 'processed'],
        preferred: ['meat', 'fish', 'vegetables', 'fruits', 'nuts']
      }
    };

    const rules = dietRules[diet.toLowerCase()];
    if (!rules) return { compatible: null, message: 'Unknown diet type' };

    const violations = [];
    const alignments = [];

    for (const component of components) {
      const name = component.name.toLowerCase();
      const category = component.category;

      // Check forbidden items
      if (rules.forbidden) {
        const forbidden = rules.forbidden.some(item =>
          name.includes(item) || category === item
        );

        if (forbidden) {
          violations.push(component.name);
        }
      }

      // Check preferred items
      if (rules.preferred) {
        const preferred = rules.preferred.some(item =>
          name.includes(item) || category === item
        );

        if (preferred) {
          alignments.push(component.name);
        }
      }
    }

    return {
      compatible: violations.length === 0,
      violations,
      alignments,
      compatibilityScore: violations.length === 0 ? 100 :
                         Math.max(0, 100 - (violations.length * 20))
    };
  }

  /**
   * Generate alternative meal suggestions
   */
  async generateAlternatives(mealAnalysis, preferences = {}) {
    try {
      const alternatives = [];
      const currentComponents = mealAnalysis.components;

      // Generate healthier alternatives
      const healthierAlts = await MealAnalysisUtils.generateHealthierAlternatives(currentComponents);
      alternatives.push(...healthierAlts);

      // Generate dietary-specific alternatives
      if (preferences.dietaryRestrictions) {
        const dietaryAlts = await MealAnalysisUtils.generateDietaryAlternatives(
          currentComponents,
          preferences.dietaryRestrictions
        );
        alternatives.push(...dietaryAlts);
      }

      // Generate allergy-safe alternatives
      if (preferences.allergies) {
        const allergyAlts = await MealAnalysisUtils.generateAllergySafeAlternatives(
          currentComponents,
          preferences.allergies
        );
        alternatives.push(...allergyAlts);
      }

      // Generate portion optimization suggestions
      const portionAlts = MealAnalysisUtils.generatePortionOptimizations(mealAnalysis);
      alternatives.push(...portionAlts);

      return {
        alternatives: alternatives.slice(0, 10), // Top 10 suggestions
        categories: {
          healthier: healthierAlts.length,
          dietary: preferences.dietaryRestrictions ?
            alternatives.filter(a => a.type === 'dietary').length : 0,
          allergySafe: preferences.allergies ?
            alternatives.filter(a => a.type === 'allergy_safe').length : 0,
          portionOptimized: portionAlts.length
        }
      };
    } catch (error) {
      console.error('Alternative generation failed:', error);
      return { alternatives: [], categories: {} };
    }
  }

  /**
   * Generate healthier alternatives for components
   */
  async generateHealthierAlternatives(components) {
    const alternatives = [];

    const substitutions = {
      'fried chicken': 'grilled chicken',
      'white rice': 'brown rice or quinoa',
      'white bread': 'whole grain bread',
      'french fries': 'roasted sweet potato',
      'soda': 'sparkling water with lemon',
      'ice cream': 'frozen yogurt with berries',
      'chips': 'air-popped popcorn or nuts',
      'butter': 'avocado or olive oil',
      'sugar': 'honey or stevia',
      'cream': 'Greek yogurt'
    };

    for (const component of components) {
      const name = component.name.toLowerCase();

      // Check for direct substitutions
      for (const [original, substitute] of Object.entries(substitutions)) {
        if (name.includes(original)) {
          alternatives.push({
            type: 'healthier',
            original: component.name,
            suggested: substitute,
            reason: `${substitute} is lower in calories and higher in nutrients`,
            healthImpact: '+15 health points',
            priority: 'high'
          });
        }
      }

      // Category-based suggestions
      if (component.category === 'processed') {
        alternatives.push({
          type: 'healthier',
          original: component.name,
          suggested: 'fresh, whole food alternative',
          reason: 'Reduce preservatives and additives',
          healthImpact: '+20 health points',
          priority: 'high'
        });
      }
    }

    return alternatives;
  }

  /**
   * Calculate daily value percentages
   */
  calculateDailyValuePercentages(totals, userProfile) {
    const profile = userProfile?.demographic || 'adult_male';
    const dailyValues = this.dailyValues;

    return {
      calories: {
        value: totals.calories,
        dailyValue: dailyValues.calories[profile] || dailyValues.calories.adult_male,
        percentage: Math.round((totals.calories / (dailyValues.calories[profile] || dailyValues.calories.adult_male)) * 100)
      },
      protein: {
        value: totals.protein,
        dailyValue: dailyValues.protein[profile] || dailyValues.protein.adult_male,
        percentage: Math.round((totals.protein / (dailyValues.protein[profile] || dailyValues.protein.adult_male)) * 100)
      },
      carbohydrates: {
        value: totals.carbohydrates,
        dailyValue: dailyValues.carbs[profile] || dailyValues.carbs.adult_male,
        percentage: Math.round((totals.carbohydrates / (dailyValues.carbs[profile] || dailyValues.carbs.adult_male)) * 100)
      },
      fat: {
        value: totals.fat,
        dailyValue: dailyValues.fat[profile] || dailyValues.fat.adult_male,
        percentage: Math.round((totals.fat / (dailyValues.fat[profile] || dailyValues.fat.adult_male)) * 100)
      }
    };
  }

  // Utility methods
  calculatePortionMultiplier(portion) {
    if (!portion || !portion.weight) return 1.0;

    // Assume base nutrition is per 100g
    return portion.weight.value / 100;
  }

  scaleNutrition(nutrition, multiplier) {
    const scaled = {};

    for (const [key, value] of Object.entries(nutrition)) {
      if (typeof value === 'number') {
        scaled[key] = Math.round(value * multiplier * 10) / 10;
      }
    }

    return scaled;
  }

  calculateNutritionConfidence(components) {
    if (components.length === 0) return 0;

    const totalConfidence = components.reduce((sum, comp) => sum + comp.confidence, 0);
    return totalConfidence / components.length;
  }

  createFallbackNutrition(components) {
    return {
      totals: {
        calories: components.length * 150, // Rough estimate
        protein: components.length * 10,
        carbohydrates: components.length * 15,
        fat: components.length * 8,
        fiber: components.length * 3,
        sugar: components.length * 5,
        sodium: components.length * 200
      },
      components: components.map(c => ({
        id: c.id,
        name: c.name,
        nutrients: { calories: 150, protein: 10, carbohydrates: 15, fat: 8 },
        confidence: 0.3,
        source: 'fallback_estimate'
      })),
      confidence: 0.3,
      fallback: true
    };
  }

  createFallbackHealthAssessment() {
    return {
      overallHealthScore: 50,
      benefits: [],
      concerns: ['Unable to perform detailed health assessment'],
      recommendations: ['Consider manual ingredient entry for better analysis'],
      dietaryAlignment: {},
      allergenWarnings: [],
      fallback: true
    };
  }
}

export const mealAnalysisService = new MealAnalysisService();