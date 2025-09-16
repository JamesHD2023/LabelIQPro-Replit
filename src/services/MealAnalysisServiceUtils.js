/**
 * Utility methods for MealAnalysisService
 * Contains helper functions for nutritional analysis and health assessment
 */

export class MealAnalysisUtils {
  /**
   * Get nutrition information for a component
   */
  static async getNutritionInfo(componentName) {
    // This would typically call an external nutrition API
    // For now, return basic structure
    return {
      calories: null,
      macros: { protein: null, carbs: null, fat: null },
      confidence: 0.5,
      source: 'estimated'
    };
  }

  /**
   * Get health profile for a component
   */
  static async getHealthProfile(componentName, category) {
    // Basic health profile based on category and known patterns
    const profiles = {
      vegetables: {
        healthScore: 85,
        benefits: ['High in vitamins', 'Rich in fiber', 'Low in calories'],
        concerns: [],
        antioxidants: 'high'
      },
      fruits: {
        healthScore: 80,
        benefits: ['Natural vitamins', 'Fiber', 'Antioxidants'],
        concerns: ['Natural sugars'],
        antioxidants: 'high'
      },
      proteins: {
        healthScore: 75,
        benefits: ['Complete amino acids', 'Muscle building'],
        concerns: componentName.toLowerCase().includes('processed') ? ['High sodium'] : [],
        antioxidants: 'low'
      },
      processed: {
        healthScore: 35,
        benefits: [],
        concerns: ['High sodium', 'Preservatives', 'Added sugars'],
        antioxidants: 'low'
      }
    };

    return profiles[category] || {
      healthScore: 50,
      benefits: [],
      concerns: [],
      antioxidants: 'medium'
    };
  }

  /**
   * Get allergen information for a component
   */
  static async getAllergenInfo(componentName) {
    const name = componentName.toLowerCase();
    const allergens = [];

    // Common allergen patterns
    const allergenMap = {
      dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream'],
      nuts: ['nuts', 'almond', 'peanut', 'walnut', 'cashew'],
      soy: ['soy', 'tofu', 'tempeh'],
      gluten: ['wheat', 'bread', 'pasta', 'flour'],
      eggs: ['egg', 'mayonnaise'],
      shellfish: ['shrimp', 'crab', 'lobster', 'shellfish'],
      fish: ['fish', 'salmon', 'tuna', 'cod']
    };

    for (const [allergen, keywords] of Object.entries(allergenMap)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        allergens.push({
          type: allergen,
          confidence: 0.8,
          severity: allergen === 'nuts' || allergen === 'shellfish' ? 'high' : 'medium'
        });
      }
    }

    return {
      allergens,
      hasCommonAllergens: allergens.length > 0,
      riskLevel: allergens.some(a => a.severity === 'high') ? 'high' :
                allergens.length > 0 ? 'medium' : 'low'
    };
  }

  /**
   * Check dietary restrictions against meal components
   */
  static checkDietaryRestrictions(components, restrictions) {
    const warnings = [];

    for (const restriction of restrictions) {
      const violatingComponents = this.findRestrictedComponents(components, restriction);

      if (violatingComponents.length > 0) {
        warnings.push({
          restriction: restriction.name || restriction,
          violatingComponents: violatingComponents.map(c => c.name),
          severity: restriction.severity || 'medium',
          message: `This meal may not be suitable for ${restriction.name || restriction} diet`
        });
      }
    }

    return warnings;
  }

  /**
   * Find components that violate dietary restrictions
   */
  static findRestrictedComponents(components, restriction) {
    const restrictionName = (restriction.name || restriction).toLowerCase();

    const restrictions = {
      vegetarian: (comp) => ['meat', 'fish', 'seafood'].includes(comp.category),
      vegan: (comp) => ['meat', 'fish', 'seafood', 'dairy'].includes(comp.category) ||
                       comp.name.toLowerCase().includes('egg'),
      'gluten-free': (comp) => ['bread', 'pasta', 'wheat'].some(item =>
                               comp.name.toLowerCase().includes(item)),
      'dairy-free': (comp) => comp.category === 'dairy' ||
                             ['milk', 'cheese', 'yogurt'].some(item =>
                               comp.name.toLowerCase().includes(item)),
      keto: (comp) => ['bread', 'rice', 'pasta', 'potato'].some(item =>
                      comp.name.toLowerCase().includes(item)),
      paleo: (comp) => ['grains', 'dairy', 'legumes'].includes(comp.category) ||
                       comp.category === 'processed'
    };

    const checkFunction = restrictions[restrictionName];

    if (checkFunction) {
      return components.filter(checkFunction);
    }

    return [];
  }

  /**
   * Check allergy warnings against meal components
   */
  static checkAllergenWarnings(components, allergies) {
    const warnings = [];

    for (const component of components) {
      if (component.allergenInfo?.allergens) {
        for (const allergen of component.allergenInfo.allergens) {
          const matchingAllergy = allergies.find(allergy =>
            (allergy.name || allergy).toLowerCase().includes(allergen.type.toLowerCase())
          );

          if (matchingAllergy) {
            warnings.push({
              component: component.name,
              allergen: allergen.type,
              severity: allergen.severity,
              userSeverity: matchingAllergy.severity || 'medium',
              message: `⚠️ ALLERGEN ALERT: ${component.name} contains ${allergen.type}`,
              priority: 'high'
            });
          }
        }
      }
    }

    return warnings.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Assess nutritional quality of meal components
   */
  static async assessNutritionalQuality(components) {
    const quality = {
      score: 0,
      factors: {
        diversity: 0,
        processedRatio: 0,
        vegetableRatio: 0,
        proteinQuality: 0
      },
      recommendations: []
    };

    if (components.length === 0) return quality;

    // Calculate diversity score
    const categories = new Set(components.map(c => c.category));
    quality.factors.diversity = Math.min(100, (categories.size / 5) * 100); // Max 5 categories

    // Calculate processed food ratio
    const processedCount = components.filter(c => c.category === 'processed').length;
    quality.factors.processedRatio = (processedCount / components.length) * 100;

    // Calculate vegetable/fruit ratio
    const plantCount = components.filter(c =>
      c.category === 'vegetables' || c.category === 'fruits'
    ).length;
    quality.factors.vegetableRatio = (plantCount / components.length) * 100;

    // Assess protein quality
    const proteinComponents = components.filter(c => c.category === 'proteins');
    if (proteinComponents.length > 0) {
      const leanProteins = proteinComponents.filter(p =>
        !p.name.toLowerCase().includes('fried') &&
        !p.name.toLowerCase().includes('processed')
      ).length;
      quality.factors.proteinQuality = (leanProteins / proteinComponents.length) * 100;
    }

    // Calculate overall score
    quality.score = (
      quality.factors.diversity * 0.3 +
      (100 - quality.factors.processedRatio) * 0.3 +
      quality.factors.vegetableRatio * 0.3 +
      quality.factors.proteinQuality * 0.1
    );

    // Generate recommendations
    if (quality.factors.diversity < 60) {
      quality.recommendations.push('Try to include more variety of food groups');
    }
    if (quality.factors.processedRatio > 40) {
      quality.recommendations.push('Consider reducing processed foods');
    }
    if (quality.factors.vegetableRatio < 30) {
      quality.recommendations.push('Add more vegetables and fruits to your meal');
    }

    return quality;
  }

  /**
   * Generate personalized recommendations based on user profile
   */
  static generatePersonalizedRecommendations(mealAnalysis, userPreferences) {
    const recommendations = [];

    // Health goal based recommendations
    if (userPreferences.healthGoals) {
      for (const goal of userPreferences.healthGoals) {
        switch (goal.toLowerCase()) {
          case 'weight_loss':
            recommendations.push({
              type: 'portion',
              message: 'For weight loss, consider smaller portions and more vegetables',
              priority: 'high'
            });
            break;
          case 'muscle_gain':
            if (mealAnalysis.categories.stats.categoryDistribution.proteins?.percentage < 25) {
              recommendations.push({
                type: 'nutrition',
                message: 'Add more protein sources to support muscle building',
                priority: 'high'
              });
            }
            break;
          case 'heart_health':
            recommendations.push({
              type: 'preparation',
              message: 'Choose grilled or steamed preparations over fried foods',
              priority: 'medium'
            });
            break;
        }
      }
    }

    // Activity level recommendations
    if (userPreferences.activityLevel) {
      if (userPreferences.activityLevel === 'high' && mealAnalysis.nutritionAnalysis?.totals.carbohydrates < 100) {
        recommendations.push({
          type: 'nutrition',
          message: 'Consider adding healthy carbohydrates for energy',
          priority: 'medium'
        });
      }
    }

    // Age-based recommendations
    if (userPreferences.age) {
      if (userPreferences.age > 50) {
        recommendations.push({
          type: 'nutrition',
          message: 'Ensure adequate calcium and protein for bone health',
          priority: 'medium'
        });
      }
    }

    return recommendations;
  }

  /**
   * Generate healthier alternatives for meal components
   */
  static async generateHealthierAlternatives(components) {
    const alternatives = [];

    const healthierSubstitutions = {
      'white rice': {
        alternatives: ['brown rice', 'quinoa', 'cauliflower rice'],
        reason: 'Higher in fiber and nutrients'
      },
      'french fries': {
        alternatives: ['baked sweet potato fries', 'roasted vegetables'],
        reason: 'Lower in unhealthy fats'
      },
      'fried chicken': {
        alternatives: ['grilled chicken', 'baked chicken'],
        reason: 'Lower in saturated fat and calories'
      },
      'white bread': {
        alternatives: ['whole grain bread', 'ezekiel bread'],
        reason: 'Higher in fiber and nutrients'
      },
      'ice cream': {
        alternatives: ['Greek yogurt with berries', 'frozen banana'],
        reason: 'Lower in sugar, higher in protein'
      }
    };

    for (const component of components) {
      const name = component.name.toLowerCase();

      for (const [food, substitution] of Object.entries(healthierSubstitutions)) {
        if (name.includes(food)) {
          alternatives.push({
            original: component.name,
            alternatives: substitution.alternatives,
            reason: substitution.reason,
            healthImpact: '+10-20 health points',
            category: component.category
          });
        }
      }
    }

    return alternatives;
  }

  /**
   * Generate dietary-specific alternatives
   */
  static async generateDietaryAlternatives(components, dietaryRestrictions) {
    const alternatives = [];

    const dietarySubstitutions = {
      vegetarian: {
        'chicken': ['tofu', 'tempeh', 'lentil protein'],
        'beef': ['black bean burger', 'mushroom protein'],
        'fish': ['jackfruit', 'seitan']
      },
      vegan: {
        'chicken': ['tofu', 'tempeh', 'seitan'],
        'cheese': ['nutritional yeast', 'cashew cheese'],
        'milk': ['almond milk', 'oat milk', 'soy milk'],
        'eggs': ['tofu scramble', 'chickpea flour omelet']
      },
      'gluten-free': {
        'bread': ['gluten-free bread', 'lettuce wraps'],
        'pasta': ['zucchini noodles', 'rice noodles'],
        'flour': ['almond flour', 'coconut flour']
      }
    };

    for (const restriction of dietaryRestrictions) {
      const restrictionName = (restriction.name || restriction).toLowerCase();
      const substitutions = dietarySubstitutions[restrictionName];

      if (substitutions) {
        for (const component of components) {
          const name = component.name.toLowerCase();

          for (const [food, alts] of Object.entries(substitutions)) {
            if (name.includes(food)) {
              alternatives.push({
                type: 'dietary',
                dietaryRestriction: restrictionName,
                original: component.name,
                alternatives: alts,
                reason: `${restrictionName} alternative`,
                priority: 'high'
              });
            }
          }
        }
      }
    }

    return alternatives;
  }

  /**
   * Generate allergy-safe alternatives
   */
  static async generateAllergySafeAlternatives(components, allergies) {
    const alternatives = [];

    const allergySubstitutions = {
      dairy: {
        'milk': ['almond milk', 'oat milk', 'coconut milk'],
        'cheese': ['dairy-free cheese', 'nutritional yeast'],
        'yogurt': ['coconut yogurt', 'almond yogurt']
      },
      nuts: {
        'almonds': ['sunflower seeds', 'pumpkin seeds'],
        'peanuts': ['sunflower seed butter', 'soy butter'],
        'walnuts': ['hemp seeds', 'chia seeds']
      },
      eggs: {
        'eggs': ['flax eggs', 'chia eggs', 'aquafaba'],
        'mayonnaise': ['avocado', 'hummus']
      }
    };

    for (const allergy of allergies) {
      const allergyName = (allergy.name || allergy).toLowerCase();
      const substitutions = allergySubstitutions[allergyName];

      if (substitutions) {
        for (const component of components) {
          const name = component.name.toLowerCase();

          for (const [food, alts] of Object.entries(substitutions)) {
            if (name.includes(food)) {
              alternatives.push({
                type: 'allergy_safe',
                allergen: allergyName,
                original: component.name,
                alternatives: alts,
                reason: `Safe for ${allergyName} allergy`,
                priority: 'critical'
              });
            }
          }
        }
      }
    }

    return alternatives;
  }

  /**
   * Generate portion optimization suggestions
   */
  static generatePortionOptimizations(mealAnalysis) {
    const suggestions = [];

    if (!mealAnalysis.portions) return suggestions;

    // Check if portions are reasonable
    for (const [componentId, portion] of Object.entries(mealAnalysis.portions)) {
      const component = mealAnalysis.components.find(c => c.id === componentId);

      if (!component) continue;

      const weight = portion.weight?.value || 0;

      // Suggest portion adjustments based on category
      switch (component.category) {
        case 'processed':
          if (weight > 150) {
            suggestions.push({
              type: 'portion_reduction',
              component: component.name,
              currentPortion: `${weight}g`,
              suggestedPortion: '100g',
              reason: 'Reduce processed food portions for better health'
            });
          }
          break;
        case 'vegetables':
          if (weight < 80) {
            suggestions.push({
              type: 'portion_increase',
              component: component.name,
              currentPortion: `${weight}g`,
              suggestedPortion: '120g',
              reason: 'Increase vegetable portions for more nutrients'
            });
          }
          break;
        case 'proteins':
          if (weight > 200) {
            suggestions.push({
              type: 'portion_reduction',
              component: component.name,
              currentPortion: `${weight}g`,
              suggestedPortion: '150g',
              reason: 'Moderate protein portion for balanced nutrition'
            });
          }
          break;
      }
    }

    return suggestions;
  }

  /**
   * Create fallback component nutrition when API fails
   */
  static createFallbackComponentNutrition(component) {
    const baseNutrition = this.getGenericNutrition(component.category);

    return {
      nutrients: baseNutrition,
      portion: { weight: { value: 100, unit: 'g' } },
      confidence: 0.3,
      source: 'fallback_estimate',
      fallback: true
    };
  }

  /**
   * Get generic nutrition values by category
   */
  static getGenericNutrition(category) {
    const generic = {
      proteins: { calories: 200, protein: 25, carbohydrates: 2, fat: 8, fiber: 0, sugar: 1, sodium: 200 },
      carbohydrates: { calories: 250, protein: 5, carbohydrates: 50, fat: 2, fiber: 3, sugar: 5, sodium: 100 },
      vegetables: { calories: 30, protein: 2, carbohydrates: 6, fat: 0.3, fiber: 2.5, sugar: 3, sodium: 50 },
      fruits: { calories: 60, protein: 0.5, carbohydrates: 15, fat: 0.2, fiber: 2, sugar: 12, sodium: 5 },
      dairy: { calories: 120, protein: 8, carbohydrates: 8, fat: 6, fiber: 0, sugar: 8, sodium: 120 },
      fats: { calories: 400, protein: 2, carbohydrates: 2, fat: 44, fiber: 1, sugar: 1, sodium: 50 },
      processed: { calories: 300, protein: 8, carbohydrates: 35, fat: 12, fiber: 2, sugar: 8, sodium: 600 },
      beverages: { calories: 80, protein: 1, carbohydrates: 20, fat: 0, fiber: 0, sugar: 18, sodium: 30 },
      other: { calories: 150, protein: 5, carbohydrates: 20, fat: 5, fiber: 1.5, sugar: 5, sodium: 150 }
    };

    return generic[category] || generic.other;
  }

  /**
   * Estimate micronutrients based on meal components
   */
  static async estimateMicronutrients(components, portions) {
    const micronutrients = {
      vitamins: {
        'vitamin_c': 0,
        'vitamin_a': 0,
        'vitamin_k': 0,
        'folate': 0,
        'vitamin_b12': 0
      },
      minerals: {
        'iron': 0,
        'calcium': 0,
        'potassium': 0,
        'magnesium': 0,
        'zinc': 0
      }
    };

    // Simple estimation based on food categories
    const categoryMicronutrients = {
      vegetables: {
        vitamin_c: 20, vitamin_k: 15, folate: 10, iron: 2, potassium: 300
      },
      fruits: {
        vitamin_c: 30, vitamin_a: 10, potassium: 200, folate: 5
      },
      proteins: {
        vitamin_b12: 5, iron: 3, zinc: 4, magnesium: 20
      },
      dairy: {
        calcium: 200, vitamin_b12: 2, magnesium: 15
      }
    };

    for (const component of components) {
      const categoryNutrients = categoryMicronutrients[component.category];

      if (categoryNutrients) {
        const portion = portions?.[component.id];
        const multiplier = portion ? (portion.weight?.value || 100) / 100 : 1;

        for (const [nutrient, amount] of Object.entries(categoryNutrients)) {
          if (micronutrients.vitamins[nutrient] !== undefined) {
            micronutrients.vitamins[nutrient] += amount * multiplier;
          } else if (micronutrients.minerals[nutrient] !== undefined) {
            micronutrients.minerals[nutrient] += amount * multiplier;
          }
        }
      }
    }

    return micronutrients;
  }
}