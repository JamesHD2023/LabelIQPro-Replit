/**
 * Complete example demonstrating FoodRecognitionService and MealAnalysisService
 * This file shows how to use both services together for comprehensive meal analysis
 */

import { foodRecognitionService } from './FoodRecognitionService';
import { mealAnalysisService } from './MealAnalysisService';
import { offlineService } from './OfflineService';

// Example user profile for personalized analysis
const exampleUserProfile = {
  id: 'user_123',
  age: 32,
  gender: 'female',
  height: 165, // cm
  weight: 65,  // kg
  activityLevel: 'moderate',
  healthGoals: ['weight_maintenance', 'heart_health'],
  dietaryPreferences: ['heart-healthy'],
  dietaryRestrictions: [], // e.g., ['vegetarian', 'gluten-free']
  allergies: [
    { name: 'nuts', severity: 'high' },
    { name: 'shellfish', severity: 'medium' }
  ],
  learningLevel: 'intermediate'
};

/**
 * Complete meal analysis workflow
 * This is the main function that demonstrates the entire process
 */
export async function analyzeMealComplete(imageInput, userProfile = exampleUserProfile) {
  console.log('🍽️ Starting comprehensive meal analysis...');

  try {
    // Step 1: Recognize meal components using AI vision
    console.log('📸 Step 1: Analyzing meal image...');

    const mealRecognitionResult = await foodRecognitionService.recognizeMeal(imageInput, {
      includePortions: true,
      includeNutrition: true,
      userPreferences: userProfile,
      learningLevel: userProfile.learningLevel
    });

    console.log(`✅ Recognized ${mealRecognitionResult.components.length} food components`);
    console.log(`🎯 Overall confidence: ${Math.round(mealRecognitionResult.confidence * 100)}%`);

    // Step 2: Calculate detailed nutrition information
    console.log('🧮 Step 2: Calculating nutritional content...');

    const nutritionAnalysis = await mealAnalysisService.calculateNutrition(
      mealRecognitionResult.components,
      mealRecognitionResult.portions,
      userProfile
    );

    console.log(`📊 Total calories: ${nutritionAnalysis.totals.calories}`);
    console.log(`🥩 Protein: ${nutritionAnalysis.totals.protein}g`);
    console.log(`🍞 Carbs: ${nutritionAnalysis.totals.carbohydrates}g`);
    console.log(`🥑 Fat: ${nutritionAnalysis.totals.fat}g`);

    // Step 3: Assess health impact and compliance
    console.log('💚 Step 3: Assessing health impact...');

    const healthAssessment = await mealAnalysisService.assessHealthImpact(
      mealRecognitionResult.components,
      mealRecognitionResult.preparationMethod,
      userProfile
    );

    console.log(`💯 Health Score: ${healthAssessment.overallHealthScore}/100`);

    if (healthAssessment.allergenWarnings.length > 0) {
      console.log('⚠️ ALLERGEN ALERTS:', healthAssessment.allergenWarnings.map(w => w.message));
    }

    // Step 4: Generate alternatives and recommendations
    console.log('💡 Step 4: Generating alternatives...');

    const alternatives = await mealAnalysisService.generateAlternatives(
      mealRecognitionResult,
      userProfile
    );

    console.log(`🔄 Generated ${alternatives.alternatives.length} alternative suggestions`);

    // Step 5: Store results for history and trends
    console.log('💾 Step 5: Storing analysis results...');

    const completeResult = {
      id: mealRecognitionResult.id,
      timestamp: mealRecognitionResult.timestamp,
      type: 'meal_analysis',
      category: 'food',

      // Core analysis data
      mealRecognition: mealRecognitionResult,
      nutrition: nutritionAnalysis,
      healthAssessment: healthAssessment,
      alternatives: alternatives,

      // User context
      userProfile: {
        id: userProfile.id,
        learningLevel: userProfile.learningLevel,
        preferences: userProfile.dietaryPreferences
      },

      // For results screen compatibility
      image: mealRecognitionResult.image,
      confidence: mealRecognitionResult.confidence,
      ingredients: mealRecognitionResult.components.map(comp => ({
        name: comp.name,
        category: comp.category,
        confidence: comp.confidence,
        healthProfile: comp.healthProfile
      }))
    };

    // Store in offline database
    await offlineService.saveScanResult(completeResult);

    console.log('✨ Meal analysis completed successfully!');

    return completeResult;

  } catch (error) {
    console.error('❌ Meal analysis failed:', error);

    // Return fallback result for graceful degradation
    return createFallbackResult(imageInput, error, userProfile);
  }
}

/**
 * Example: Basic meal recognition (simplified workflow)
 */
export async function analyzeMealBasic(imageInput) {
  console.log('🍽️ Starting basic meal recognition...');

  try {
    const result = await foodRecognitionService.recognizeMeal(imageInput, {
      includePortions: false,
      includeNutrition: false,
      learningLevel: 'beginner'
    });

    // Simple component listing
    console.log('🥘 Detected food items:');
    result.components.forEach((component, index) => {
      console.log(`  ${index + 1}. ${component.name} (${component.category})`);
    });

    return result;

  } catch (error) {
    console.error('❌ Basic recognition failed:', error);
    throw error;
  }
}

/**
 * Example: Nutrition-focused analysis
 */
export async function analyzeMealNutrition(imageInput, targetCalories = 600) {
  console.log('🧮 Starting nutrition-focused analysis...');

  try {
    // Get meal components
    const mealResult = await foodRecognitionService.recognizeMeal(imageInput);

    // Calculate nutrition
    const nutrition = await mealAnalysisService.calculateNutrition(
      mealResult.components,
      mealResult.portions
    );

    // Check against target
    const caloriesDifference = nutrition.totals.calories - targetCalories;
    const analysis = {
      nutrition,
      targetAnalysis: {
        targetCalories,
        actualCalories: nutrition.totals.calories,
        difference: caloriesDifference,
        status: caloriesDifference > 50 ? 'over' :
                caloriesDifference < -50 ? 'under' : 'on-target'
      }
    };

    console.log(`🎯 Target: ${targetCalories} calories`);
    console.log(`📊 Actual: ${nutrition.totals.calories} calories`);
    console.log(`📈 Status: ${analysis.targetAnalysis.status}`);

    return analysis;

  } catch (error) {
    console.error('❌ Nutrition analysis failed:', error);
    throw error;
  }
}

/**
 * Example: Dietary compliance check
 */
export async function checkDietaryCompliance(imageInput, dietaryRestrictions = ['vegetarian']) {
  console.log('🥗 Checking dietary compliance...');

  try {
    const mealResult = await foodRecognitionService.recognizeMeal(imageInput);

    const healthAssessment = await mealAnalysisService.assessHealthImpact(
      mealResult.components,
      mealResult.preparationMethod,
      { dietaryPreferences: dietaryRestrictions }
    );

    const compliance = {
      isCompliant: true,
      violations: [],
      recommendations: []
    };

    // Check dietary alignment
    for (const [diet, alignment] of Object.entries(healthAssessment.dietaryAlignment)) {
      if (!alignment.compatible) {
        compliance.isCompliant = false;
        compliance.violations.push({
          diet,
          violations: alignment.violations,
          score: alignment.compatibilityScore
        });
      }
    }

    console.log(`✅ Dietary Compliance: ${compliance.isCompliant ? 'PASS' : 'FAIL'}`);

    if (!compliance.isCompliant) {
      console.log('❌ Violations found:');
      compliance.violations.forEach(v => {
        console.log(`  - ${v.diet}: ${v.violations.join(', ')}`);
      });
    }

    return compliance;

  } catch (error) {
    console.error('❌ Compliance check failed:', error);
    throw error;
  }
}

/**
 * Example: Trend analysis from meal history
 */
export async function analyzeMealTrends(days = 7) {
  console.log(`📈 Analyzing meal trends for last ${days} days...`);

  try {
    // Get recent meal data
    const trendData = await foodRecognitionService.getTrendingMeals(days * 3); // ~3 meals per day

    const analysis = {
      period: `${days} days`,
      totalMeals: trendData.recentMeals.length,
      trends: trendData.trends,
      insights: [],
      recommendations: []
    };

    // Analyze balance trends
    if (trendData.trends.balanceScores.length > 0) {
      const avgBalance = trendData.trends.balanceScores.reduce((sum, score) => sum + score, 0) /
                        trendData.trends.balanceScores.length;

      analysis.averageBalanceScore = Math.round(avgBalance);

      if (avgBalance < 60) {
        analysis.insights.push('Meals tend to be nutritionally unbalanced');
        analysis.recommendations.push('Try to include more vegetables and variety');
      } else if (avgBalance > 80) {
        analysis.insights.push('Excellent meal balance maintained');
      }
    }

    // Popular categories analysis
    const topCategory = Object.entries(trendData.trends.popularCategories)
      .sort(([,a], [,b]) => b - a)[0];

    if (topCategory) {
      analysis.insights.push(`Most common food category: ${topCategory[0]}`);
    }

    console.log(`📊 Analyzed ${analysis.totalMeals} meals`);
    console.log(`⚖️ Average balance score: ${analysis.averageBalanceScore}/100`);

    return analysis;

  } catch (error) {
    console.error('❌ Trend analysis failed:', error);
    throw error;
  }
}

/**
 * Example: Meal optimization suggestions
 */
export async function optimizeMeal(imageInput, optimizationGoal = 'health') {
  console.log(`🎯 Optimizing meal for: ${optimizationGoal}`);

  try {
    const mealResult = await foodRecognitionService.recognizeMeal(imageInput);
    const nutrition = await mealAnalysisService.calculateNutrition(
      mealResult.components,
      mealResult.portions
    );

    const alternatives = await mealAnalysisService.generateAlternatives(mealResult, {
      healthGoals: [optimizationGoal]
    });

    const optimization = {
      originalMeal: {
        components: mealResult.components.map(c => c.name),
        calories: nutrition.totals.calories,
        healthScore: mealResult.categories?.stats?.balanceScore || 'unknown'
      },
      suggestions: alternatives.alternatives.filter(alt => alt.priority === 'high'),
      estimatedImprovements: {
        calories: 0,
        healthScore: 0,
        nutritionQuality: 0
      }
    };

    // Calculate estimated improvements
    optimization.suggestions.forEach(suggestion => {
      if (suggestion.type === 'healthier') {
        optimization.estimatedImprovements.healthScore += 10;
      }
      if (suggestion.healthImpact?.includes('-')) {
        optimization.estimatedImprovements.calories -= 50; // Estimate
      }
    });

    console.log(`💡 Found ${optimization.suggestions.length} optimization opportunities`);
    console.log(`📈 Estimated health score improvement: +${optimization.estimatedImprovements.healthScore}`);

    return optimization;

  } catch (error) {
    console.error('❌ Meal optimization failed:', error);
    throw error;
  }
}

/**
 * Example: Progressive learning adaptation
 */
export function adaptResultsForLearningLevel(results, learningLevel) {
  console.log(`🎓 Adapting results for ${learningLevel} level`);

  switch (learningLevel) {
    case 'beginner':
      return {
        ...results,
        simplifiedView: {
          components: results.mealRecognition.components.slice(0, 3), // Show top 3 only
          keyMetrics: {
            calories: results.nutrition.totals.calories,
            healthScore: results.healthAssessment.overallHealthScore,
            mainConcerns: results.healthAssessment.concerns.slice(0, 2)
          },
          simpleRecommendations: [
            results.alternatives.alternatives
              .filter(alt => alt.priority === 'high')
              .slice(0, 2)
              .map(alt => `Try: ${alt.suggested || alt.alternatives?.[0]}`)
          ].flat(),
          learningTips: [
            "Focus on balanced portions",
            "Include vegetables in every meal",
            "Watch your portion sizes"
          ]
        }
      };

    case 'intermediate':
      return {
        ...results,
        enhancedView: {
          macroBreakdown: results.nutrition.macroBreakdown,
          preparationAnalysis: results.mealRecognition.preparationMethod,
          balanceScore: results.mealRecognition.categories.stats.balanceScore,
          improvementAreas: results.healthAssessment.recommendations.slice(0, 4),
          nutritionInsights: [
            `Protein: ${Math.round(results.nutrition.macroBreakdown.protein.percentage)}%`,
            `Carbs: ${Math.round(results.nutrition.macroBreakdown.carbohydrates.percentage)}%`,
            `Fat: ${Math.round(results.nutrition.macroBreakdown.fat.percentage)}%`
          ]
        }
      };

    case 'advanced':
      return {
        ...results,
        detailedView: {
          micronutrients: results.nutrition.micronutrients,
          dailyValueAnalysis: results.nutrition.dailyValuePercentages,
          preparationImpact: results.healthAssessment.preparationImpact,
          nutritionalQuality: results.healthAssessment.nutritionalQuality,
          optimizationPotential: {
            portionAdjustments: results.alternatives.alternatives.filter(alt => alt.type === 'portion_reduction'),
            substitutionOpportunities: results.alternatives.alternatives.filter(alt => alt.type === 'healthier'),
            dietaryAdaptations: results.alternatives.alternatives.filter(alt => alt.type === 'dietary')
          },
          advancedMetrics: {
            nutrientDensity: calculateNutrientDensity(results.nutrition),
            inflammationScore: estimateInflammationScore(results.mealRecognition.components),
            glycemicLoad: estimateGlycemicLoad(results.mealRecognition.components, results.nutrition)
          }
        }
      };

    default:
      return results;
  }
}

/**
 * Helper: Create fallback result when analysis fails
 */
function createFallbackResult(imageInput, error, userProfile) {
  return {
    id: `fallback_${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'meal_analysis_fallback',
    error: error.message,
    fallback: true,

    mealRecognition: {
      components: [],
      confidence: 0.1,
      fallback: true
    },

    recommendations: [
      'Image quality may be too low for accurate recognition',
      'Try taking a clearer photo with better lighting',
      'Consider manual entry for this meal',
      'Ensure food items are clearly visible and well-separated'
    ]
  };
}

/**
 * Helper: Calculate nutrient density score
 */
function calculateNutrientDensity(nutrition) {
  if (nutrition.totals.calories === 0) return 0;

  const importantNutrients = [
    nutrition.totals.protein,
    nutrition.totals.fiber,
    nutrition.micronutrients?.vitamins?.vitamin_c || 0,
    nutrition.micronutrients?.vitamins?.vitamin_a || 0,
    nutrition.micronutrients?.minerals?.iron || 0
  ];

  const totalNutrients = importantNutrients.reduce((sum, nutrient) => sum + nutrient, 0);
  return Math.round((totalNutrients / nutrition.totals.calories) * 100);
}

/**
 * Helper: Estimate inflammation score
 */
function estimateInflammationScore(components) {
  let score = 50; // Neutral baseline

  components.forEach(component => {
    const name = component.name.toLowerCase();

    // Anti-inflammatory foods
    if (['salmon', 'berries', 'leafy greens', 'nuts', 'olive oil'].some(food => name.includes(food))) {
      score += 10;
    }

    // Pro-inflammatory foods
    if (['fried', 'processed', 'sugar', 'refined'].some(concern => name.includes(concern))) {
      score -= 15;
    }
  });

  return Math.max(0, Math.min(100, score));
}

/**
 * Helper: Estimate glycemic load
 */
function estimateGlycemicLoad(components, nutrition) {
  const totalCarbs = nutrition.totals.carbohydrates;
  if (totalCarbs === 0) return 0;

  let avgGI = 55; // Medium baseline

  components.forEach(component => {
    const name = component.name.toLowerCase();

    // High GI foods
    if (['white bread', 'potato', 'rice', 'sugar'].some(food => name.includes(food))) {
      avgGI += 10;
    }

    // Low GI foods
    if (['whole grain', 'beans', 'vegetables', 'nuts'].some(food => name.includes(food))) {
      avgGI -= 10;
    }
  });

  return Math.round((avgGI * totalCarbs) / 100);
}

/**
 * Demo function - runs a complete example
 */
export async function runCompleteDemo() {
  console.log('🚀 Running complete FoodRecognitionService demo...\n');

  // Create a mock image (in real usage, this would be actual image data)
  const mockImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...'; // Truncated for brevity

  try {
    console.log('=== COMPLETE MEAL ANALYSIS ===');
    const completeResult = await analyzeMealComplete(mockImage, exampleUserProfile);
    console.log('\n=== BASIC RECOGNITION ===');
    await analyzeMealBasic(mockImage);

    console.log('\n=== NUTRITION ANALYSIS ===');
    await analyzeMealNutrition(mockImage, 500);

    console.log('\n=== DIETARY COMPLIANCE ===');
    await checkDietaryCompliance(mockImage, ['heart-healthy']);

    console.log('\n=== MEAL OPTIMIZATION ===');
    await optimizeMeal(mockImage, 'weight_loss');

    console.log('\n=== LEARNING LEVEL ADAPTATION ===');
    const beginnerView = adaptResultsForLearningLevel(completeResult, 'beginner');
    console.log('👶 Beginner view keys:', Object.keys(beginnerView.simplifiedView));

    const advancedView = adaptResultsForLearningLevel(completeResult, 'advanced');
    console.log('🎓 Advanced view keys:', Object.keys(advancedView.detailedView));

    console.log('\n✨ Demo completed successfully!');

  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Export all example functions for use in other parts of the application
export default {
  analyzeMealComplete,
  analyzeMealBasic,
  analyzeMealNutrition,
  checkDietaryCompliance,
  analyzeMealTrends,
  optimizeMeal,
  adaptResultsForLearningLevel,
  runCompleteDemo
};