import { offlineService } from './OfflineService';

/**
 * MealHistoryService - Manages meal history data and trend analysis
 * Provides functionality for storing, retrieving, and analyzing meal patterns
 */
class MealHistoryService {
  constructor() {
    this.storageKey = 'labeliq_meal_history'; // Legacy - now uses OfflineService
    this.maxHistoryEntries = 1000; // Legacy - now handled by 90-day retention in OfflineService
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
  }

  /**
   * Store a new meal entry in history
   */
  async saveMealEntry(mealData) {
    try {
      const entry = {
        id: this.generateMealId(),
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        ...mealData,
        createdAt: new Date().toISOString()
      };

      // Save to OfflineService with automatic cleanup
      await offlineService.saveScanResult({
        ...entry,
        type: 'meal_entry'
      });

      this.clearCache(); // Clear cache to ensure fresh data

      return entry;
    } catch (error) {
      console.error('Failed to save meal entry:', error);
      throw new Error('Unable to save meal to history');
    }
  }

  /**
   * Get complete meal history
   */
  async getMealHistory() {
    try {
      const cacheKey = 'meal_history_all';

      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      // Get from OfflineService which handles 90-day retention automatically
      const scanResults = await offlineService.getScanResults(1000);
      const mealEntries = scanResults.filter(result => result.type === 'meal_entry');

      // Cache the result
      this.cache.set(cacheKey, {
        data: mealEntries,
        timestamp: Date.now()
      });

      return mealEntries;
    } catch (error) {
      console.error('Failed to load meal history:', error);
      return [];
    }
  }

  /**
   * Get meals for a specific date range
   */
  async getMealsInDateRange(startDate, endDate) {
    try {
      const history = await this.getMealHistory();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime() + (24 * 60 * 60 * 1000 - 1); // End of day

      return history.filter(meal => {
        const mealTime = new Date(meal.timestamp).getTime();
        return mealTime >= start && mealTime <= end;
      });
    } catch (error) {
      console.error('Failed to get meals in date range:', error);
      return [];
    }
  }

  /**
   * Get recent meals (last N days)
   */
  async getRecentMeals(days = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return await this.getMealsInDateRange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
    } catch (error) {
      console.error('Failed to get recent meals:', error);
      return [];
    }
  }

  /**
   * Generate nutrition trends analysis
   */
  async generateNutritionTrends(days = 30) {
    try {
      const recentMeals = await this.getRecentMeals(days);

      if (recentMeals.length === 0) {
        return this.createEmptyTrends();
      }

      // Group meals by date
      const mealsByDate = this.groupMealsByDate(recentMeals);

      // Calculate daily totals
      const dailyTotals = this.calculateDailyTotals(mealsByDate);

      // Generate trend analysis
      return {
        period: `Last ${days} days`,
        totalMeals: recentMeals.length,
        averages: this.calculateAverages(dailyTotals),
        trends: this.analyzeTrends(dailyTotals),
        dailyBreakdown: dailyTotals,
        recommendations: this.generateTrendRecommendations(dailyTotals),
        healthScore: this.calculateOverallHealthTrend(recentMeals)
      };
    } catch (error) {
      console.error('Failed to generate nutrition trends:', error);
      return this.createEmptyTrends();
    }
  }

  /**
   * Get meal frequency patterns
   */
  async getMealPatterns(days = 30) {
    try {
      const recentMeals = await this.getRecentMeals(days);

      const patterns = {
        mealTimes: this.analyzeMealTimes(recentMeals),
        weeklyPatterns: this.analyzeWeeklyPatterns(recentMeals),
        frequentFoods: this.analyzeFrequentFoods(recentMeals),
        categories: this.analyzeFoodCategories(recentMeals)
      };

      return patterns;
    } catch (error) {
      console.error('Failed to analyze meal patterns:', error);
      return this.createEmptyPatterns();
    }
  }

  /**
   * Get health progress analysis
   */
  async getHealthProgress(days = 30) {
    try {
      const recentMeals = await this.getRecentMeals(days);

      const progress = {
        healthScoreProgress: this.analyzeHealthScoreProgress(recentMeals),
        nutritionGoals: this.analyzeNutritionGoals(recentMeals),
        improvements: this.identifyImprovements(recentMeals),
        challenges: this.identifyChallenges(recentMeals)
      };

      return progress;
    } catch (error) {
      console.error('Failed to analyze health progress:', error);
      return this.createEmptyProgress();
    }
  }

  /**
   * Delete a meal entry
   */
  async deleteMealEntry(mealId) {
    try {
      await offlineService.deleteScanResult(mealId);
      this.clearCache();

      return true;
    } catch (error) {
      console.error('Failed to delete meal entry:', error);
      throw new Error('Unable to delete meal entry');
    }
  }

  /**
   * Clear all meal history
   */
  async clearHistory() {
    try {
      // Get all meal entries and delete them
      const mealEntries = await this.getMealHistory();
      for (const meal of mealEntries) {
        await offlineService.deleteScanResult(meal.id);
      }

      this.clearCache();
      return true;
    } catch (error) {
      console.error('Failed to clear meal history:', error);
      throw new Error('Unable to clear meal history');
    }
  }

  // Private helper methods

  groupMealsByDate(meals) {
    const grouped = {};

    meals.forEach(meal => {
      const date = meal.date || new Date(meal.timestamp).toISOString().split('T')[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(meal);
    });

    return grouped;
  }

  calculateDailyTotals(mealsByDate) {
    const dailyTotals = [];

    Object.entries(mealsByDate).forEach(([date, meals]) => {
      const dayTotal = {
        date,
        mealCount: meals.length,
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        healthScore: 0
      };

      meals.forEach(meal => {
        if (meal.nutrition && meal.nutrition.totals) {
          const nutrition = meal.nutrition.totals;
          dayTotal.calories += nutrition.calories || 0;
          dayTotal.protein += nutrition.protein || 0;
          dayTotal.carbohydrates += nutrition.carbohydrates || 0;
          dayTotal.fat += nutrition.fat || 0;
          dayTotal.fiber += nutrition.fiber || 0;
          dayTotal.sugar += nutrition.sugar || 0;
          dayTotal.sodium += nutrition.sodium || 0;
        }

        if (meal.healthAssessment && meal.healthAssessment.overallHealthScore) {
          dayTotal.healthScore += meal.healthAssessment.overallHealthScore;
        }
      });

      // Calculate average health score for the day
      if (meals.length > 0) {
        dayTotal.healthScore = dayTotal.healthScore / meals.length;
      }

      dailyTotals.push(dayTotal);
    });

    return dailyTotals.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  calculateAverages(dailyTotals) {
    if (dailyTotals.length === 0) return {};

    const totals = dailyTotals.reduce((acc, day) => {
      acc.calories += day.calories;
      acc.protein += day.protein;
      acc.carbohydrates += day.carbohydrates;
      acc.fat += day.fat;
      acc.fiber += day.fiber;
      acc.sugar += day.sugar;
      acc.sodium += day.sodium;
      acc.healthScore += day.healthScore;
      acc.mealCount += day.mealCount;
      return acc;
    }, {
      calories: 0, protein: 0, carbohydrates: 0, fat: 0,
      fiber: 0, sugar: 0, sodium: 0, healthScore: 0, mealCount: 0
    });

    const dayCount = dailyTotals.length;

    return {
      dailyCalories: Math.round(totals.calories / dayCount),
      dailyProtein: Math.round(totals.protein / dayCount),
      dailyCarbohydrates: Math.round(totals.carbohydrates / dayCount),
      dailyFat: Math.round(totals.fat / dayCount),
      dailyFiber: Math.round(totals.fiber / dayCount),
      dailySugar: Math.round(totals.sugar / dayCount),
      dailySodium: Math.round(totals.sodium / dayCount),
      averageHealthScore: Math.round(totals.healthScore / dayCount),
      averageMealsPerDay: Math.round((totals.mealCount / dayCount) * 10) / 10
    };
  }

  analyzeTrends(dailyTotals) {
    if (dailyTotals.length < 7) {
      return { insufficient_data: true };
    }

    // Calculate week-over-week trends
    const midpoint = Math.floor(dailyTotals.length / 2);
    const firstHalf = dailyTotals.slice(0, midpoint);
    const secondHalf = dailyTotals.slice(midpoint);

    const firstHalfAvg = this.calculateAverages(firstHalf);
    const secondHalfAvg = this.calculateAverages(secondHalf);

    return {
      calories: this.calculateTrendDirection(firstHalfAvg.dailyCalories, secondHalfAvg.dailyCalories),
      protein: this.calculateTrendDirection(firstHalfAvg.dailyProtein, secondHalfAvg.dailyProtein),
      healthScore: this.calculateTrendDirection(firstHalfAvg.averageHealthScore, secondHalfAvg.averageHealthScore),
      mealFrequency: this.calculateTrendDirection(firstHalfAvg.averageMealsPerDay, secondHalfAvg.averageMealsPerDay)
    };
  }

  calculateTrendDirection(oldValue, newValue) {
    const change = newValue - oldValue;
    const percentChange = oldValue > 0 ? (change / oldValue) * 100 : 0;

    return {
      direction: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
      change: Math.round(change * 10) / 10,
      percentChange: Math.round(percentChange * 10) / 10
    };
  }

  analyzeMealTimes(meals) {
    const timeDistribution = {
      breakfast: 0, // 5 AM - 11 AM
      lunch: 0,     // 11 AM - 3 PM
      dinner: 0,    // 5 PM - 10 PM
      snacks: 0     // Other times
    };

    meals.forEach(meal => {
      const hour = new Date(meal.timestamp).getHours();

      if (hour >= 5 && hour < 11) {
        timeDistribution.breakfast++;
      } else if (hour >= 11 && hour < 15) {
        timeDistribution.lunch++;
      } else if (hour >= 17 && hour < 22) {
        timeDistribution.dinner++;
      } else {
        timeDistribution.snacks++;
      }
    });

    return timeDistribution;
  }

  analyzeFrequentFoods(meals) {
    const foodFrequency = {};

    meals.forEach(meal => {
      if (meal.components) {
        meal.components.forEach(component => {
          const name = component.name.toLowerCase();
          foodFrequency[name] = (foodFrequency[name] || 0) + 1;
        });
      }
    });

    // Sort by frequency and return top 10
    return Object.entries(foodFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([food, count]) => ({ food, count }));
  }

  generateTrendRecommendations(dailyTotals) {
    const recommendations = [];
    const averages = this.calculateAverages(dailyTotals);

    // Calorie recommendations
    if (averages.dailyCalories > 2500) {
      recommendations.push({
        type: 'calories',
        message: 'Consider reducing portion sizes or choosing lower-calorie alternatives',
        priority: 'medium'
      });
    } else if (averages.dailyCalories < 1500) {
      recommendations.push({
        type: 'calories',
        message: 'You may be under-eating. Consider adding healthy snacks',
        priority: 'medium'
      });
    }

    // Protein recommendations
    if (averages.dailyProtein < 50) {
      recommendations.push({
        type: 'protein',
        message: 'Try to include more protein-rich foods in your meals',
        priority: 'high'
      });
    }

    // Health score recommendations
    if (averages.averageHealthScore < 60) {
      recommendations.push({
        type: 'health',
        message: 'Focus on adding more vegetables and whole foods to improve meal quality',
        priority: 'high'
      });
    }

    return recommendations;
  }

  // Legacy methods - now handled by OfflineService
  async loadHistoryFromStorage() {
    // This method is now deprecated - use getMealHistory() instead
    // which uses OfflineService with 90-day retention
    console.warn('loadHistoryFromStorage is deprecated, use getMealHistory() instead');
    return this.getMealHistory();
  }

  async saveHistoryToStorage(history) {
    // This method is now deprecated - use saveMealEntry() instead
    // which uses OfflineService with 90-day retention
    console.warn('saveHistoryToStorage is deprecated, use saveMealEntry() instead');
    throw new Error('saveHistoryToStorage is deprecated - use individual saveMealEntry() calls');
  }

  generateMealId() {
    return `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clearCache() {
    this.cache.clear();
  }

  createEmptyTrends() {
    return {
      period: 'No data available',
      totalMeals: 0,
      averages: {},
      trends: {},
      dailyBreakdown: [],
      recommendations: [],
      healthScore: { current: 0, trend: 'stable' }
    };
  }

  createEmptyPatterns() {
    return {
      mealTimes: { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 },
      weeklyPatterns: {},
      frequentFoods: [],
      categories: {}
    };
  }

  createEmptyProgress() {
    return {
      healthScoreProgress: { trend: 'stable', change: 0 },
      nutritionGoals: {},
      improvements: [],
      challenges: []
    };
  }

  analyzeWeeklyPatterns(meals) {
    const weeklyPattern = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    days.forEach(day => {
      weeklyPattern[day] = 0;
    });

    meals.forEach(meal => {
      const dayOfWeek = days[new Date(meal.timestamp).getDay()];
      weeklyPattern[dayOfWeek]++;
    });

    return weeklyPattern;
  }

  analyzeFoodCategories(meals) {
    const categories = {};

    meals.forEach(meal => {
      if (meal.components) {
        meal.components.forEach(component => {
          const category = component.category || 'other';
          categories[category] = (categories[category] || 0) + 1;
        });
      }
    });

    return categories;
  }

  analyzeHealthScoreProgress(meals) {
    if (meals.length < 7) {
      return { trend: 'insufficient_data', change: 0 };
    }

    // Split into two halves to compare progress
    const midpoint = Math.floor(meals.length / 2);
    const firstHalf = meals.slice(0, midpoint);
    const secondHalf = meals.slice(midpoint);

    const firstHalfScore = this.calculateAverageHealthScore(firstHalf);
    const secondHalfScore = this.calculateAverageHealthScore(secondHalf);

    const change = secondHalfScore - firstHalfScore;

    return {
      trend: change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable',
      change: Math.round(change * 10) / 10,
      firstHalfScore: Math.round(firstHalfScore),
      secondHalfScore: Math.round(secondHalfScore)
    };
  }

  calculateAverageHealthScore(meals) {
    if (meals.length === 0) return 0;

    const totalScore = meals.reduce((sum, meal) => {
      return sum + (meal.healthAssessment?.overallHealthScore || 50);
    }, 0);

    return totalScore / meals.length;
  }

  analyzeNutritionGoals(meals) {
    // Placeholder for nutrition goal analysis
    // This would integrate with user-defined nutrition goals
    return {
      protein: { target: 50, average: 45, achievement: 90 },
      calories: { target: 2000, average: 1950, achievement: 97 },
      fiber: { target: 25, average: 20, achievement: 80 }
    };
  }

  identifyImprovements(meals) {
    const improvements = [];

    // Analyze recent vs older meals for improvements
    const recentMeals = meals.slice(0, Math.floor(meals.length / 3));
    const olderMeals = meals.slice(-Math.floor(meals.length / 3));

    const recentAvgHealth = this.calculateAverageHealthScore(recentMeals);
    const olderAvgHealth = this.calculateAverageHealthScore(olderMeals);

    if (recentAvgHealth > olderAvgHealth + 5) {
      improvements.push('Your meal health scores have improved recently!');
    }

    return improvements;
  }

  identifyChallenges(meals) {
    const challenges = [];

    // Identify patterns that might be challenging
    const avgHealthScore = this.calculateAverageHealthScore(meals);

    if (avgHealthScore < 50) {
      challenges.push('Focus on incorporating more nutritious whole foods');
    }

    if (meals.length < 14) { // Less than 2 meals per week on average
      challenges.push('Try to maintain more consistent meal tracking');
    }

    return challenges;
  }

  calculateOverallHealthTrend(meals) {
    if (meals.length === 0) {
      return { current: 0, trend: 'no_data' };
    }

    const currentScore = this.calculateAverageHealthScore(meals.slice(0, 7)); // Last week
    const progress = this.analyzeHealthScoreProgress(meals);

    return {
      current: Math.round(currentScore),
      trend: progress.trend,
      change: progress.change
    };
  }
}

export const mealHistoryService = new MealHistoryService();