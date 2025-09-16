import { offlineService } from './OfflineService';

/**
 * DailyCalorieTracker - Tracks daily calorie intake with 24-hour rolling periods
 * Provides real-time calorie monitoring, warnings, and recommendations
 */
class DailyCalorieTracker {
  constructor() {
    this.storageKey = 'daily_calorie_tracking';
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes

    // Calorie calculation constants
    this.bmrFormulas = {
      male: (weight, height, age) => 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age),
      female: (weight, height, age) => 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    };

    this.activityMultipliers = {
      sedentary: 1.2,      // Little/no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Heavy exercise 6-7 days/week
      very_active: 1.9     // Very heavy exercise, physical job
    };

    this.goalAdjustments = {
      lose_weight: -500,   // 500 calorie deficit for 1lb/week loss
      maintain: 0,         // Maintenance calories
      gain_weight: 500     // 500 calorie surplus for 1lb/week gain
    };
  }

  /**
   * Add a meal/food scan to today's calorie tracking
   */
  async addCalorieEntry(scanData) {
    try {
      const today = this.getTodayKey();
      const calories = this.extractCalories(scanData);

      if (!calories || calories <= 0) {
        throw new Error('Invalid calorie data');
      }

      const entry = {
        id: this.generateEntryId(),
        timestamp: new Date().toISOString(),
        calories: calories,
        meal: scanData.mealType || this.detectMealType(),
        foods: scanData.components || [],
        scanId: scanData.id,
        confidence: scanData.confidence || 0.8
      };

      // Save to OfflineService with 90-day retention
      await offlineService.saveScanResult({
        ...entry,
        type: 'calorie_entry',
        date: today
      });

      // Clear cache to ensure fresh data
      this.clearCache();

      // Check for warnings after adding entry
      const warnings = await this.checkDailyWarnings();

      return {
        entry,
        dailyTotal: await this.getDailyTotal(today),
        warnings
      };

    } catch (error) {
      console.error('Failed to add calorie entry:', error);
      throw new Error('Unable to track calories for this meal');
    }
  }

  /**
   * Get today's total calorie intake
   */
  async getDailyTotal(date = null) {
    try {
      const targetDate = date || this.getTodayKey();
      const cacheKey = `daily_total_${targetDate}`;

      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      // Get all calorie entries for the day
      const entries = await this.getDayEntries(targetDate);
      const total = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);

      const result = {
        date: targetDate,
        totalCalories: Math.round(total),
        entryCount: entries.length,
        meals: this.groupEntriesByMeal(entries),
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;

    } catch (error) {
      console.error('Failed to get daily total:', error);
      return {
        date: date || this.getTodayKey(),
        totalCalories: 0,
        entryCount: 0,
        meals: {},
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Calculate user's daily calorie needs based on profile
   */
  async calculateDailyNeed() {
    try {
      const userProfile = await offlineService.getUserProfile();

      if (!userProfile || !this.hasRequiredProfileData(userProfile)) {
        return this.getDefaultCalorieNeed();
      }

      const { weight, height, age, gender, activityLevel, goal, units } = userProfile;

      // Convert imperial to metric if needed
      let weightKg = parseFloat(weight);
      let heightCm = parseFloat(height);

      if (units === 'imperial') {
        weightKg = weightKg * 0.453592; // lbs to kg
        heightCm = heightCm * 2.54; // inches to cm
      }

      // Calculate BMR (Basal Metabolic Rate)
      const bmr = this.bmrFormulas[gender.toLowerCase()](
        weightKg,
        heightCm,
        parseInt(age)
      );

      // Apply activity multiplier
      const tdee = bmr * (this.activityMultipliers[activityLevel] || 1.55);

      // Apply goal adjustment
      const dailyNeed = tdee + (this.goalAdjustments[goal] || 0);

      return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        dailyNeed: Math.round(dailyNeed),
        goal: goal || 'maintain',
        profile: {
          weight: parseFloat(weight),
          height: parseFloat(height),
          age: parseInt(age),
          gender: gender,
          activityLevel: activityLevel || 'moderate'
        }
      };

    } catch (error) {
      console.error('Failed to calculate daily calorie need:', error);
      return this.getDefaultCalorieNeed();
    }
  }

  /**
   * Check for daily calorie warnings and recommendations
   */
  async checkDailyWarnings() {
    try {
      const dailyTotal = await this.getDailyTotal();
      const calorieNeed = await this.calculateDailyNeed();
      const currentCalories = dailyTotal.totalCalories;
      const targetCalories = calorieNeed.dailyNeed;

      const warnings = [];
      const percentOfTarget = (currentCalories / targetCalories) * 100;

      // Overconsumption warnings
      if (percentOfTarget > 120) {
        warnings.push({
          type: 'warning',
          level: 'high',
          message: `You've exceeded your daily calorie goal by ${Math.round(currentCalories - targetCalories)} calories`,
          recommendation: 'Consider lighter meals for the rest of the day or increase physical activity'
        });
      } else if (percentOfTarget > 100) {
        warnings.push({
          type: 'info',
          level: 'medium',
          message: `You've reached your daily calorie goal (${Math.round(percentOfTarget)}%)`,
          recommendation: 'Try to maintain this level for the rest of the day'
        });
      }

      // Underconsumption warnings
      if (percentOfTarget < 60) {
        warnings.push({
          type: 'warning',
          level: 'medium',
          message: `You're significantly under your daily calorie goal (${Math.round(percentOfTarget)}%)`,
          recommendation: 'Consider adding healthy snacks or larger portions to meet your nutritional needs'
        });
      }

      // Time-based recommendations
      const currentHour = new Date().getHours();
      if (currentHour > 20 && percentOfTarget > 110) {
        warnings.push({
          type: 'tip',
          level: 'low',
          message: 'Late evening calories can affect sleep quality',
          recommendation: 'Consider lighter options if you need to eat before bed'
        });
      }

      return {
        currentCalories,
        targetCalories,
        percentOfTarget: Math.round(percentOfTarget),
        remainingCalories: Math.max(0, targetCalories - currentCalories),
        warnings,
        status: this.getDayStatus(percentOfTarget)
      };

    } catch (error) {
      console.error('Failed to check daily warnings:', error);
      return {
        currentCalories: 0,
        targetCalories: 2000,
        percentOfTarget: 0,
        remainingCalories: 2000,
        warnings: [],
        status: 'unknown'
      };
    }
  }

  /**
   * Get calorie tracking history for specified number of days
   */
  async getCalorieHistory(days = 7) {
    try {
      const history = [];
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = this.formatDateKey(date);

        const dailyData = await this.getDailyTotal(dateKey);
        const calorieNeed = await this.calculateDailyNeed();

        history.push({
          date: dateKey,
          displayDate: date.toLocaleDateString(),
          ...dailyData,
          targetCalories: calorieNeed.dailyNeed,
          percentOfTarget: Math.round((dailyData.totalCalories / calorieNeed.dailyNeed) * 100)
        });
      }

      return history.reverse(); // Oldest first

    } catch (error) {
      console.error('Failed to get calorie history:', error);
      return [];
    }
  }

  /**
   * Get weekly calorie tracking summary
   */
  async getWeeklySummary() {
    try {
      const weekHistory = await this.getCalorieHistory(7);
      const calorieNeed = await this.calculateDailyNeed();

      const summary = {
        weekTotal: weekHistory.reduce((sum, day) => sum + day.totalCalories, 0),
        weekAverage: 0,
        targetWeekly: calorieNeed.dailyNeed * 7,
        daysTracked: weekHistory.filter(day => day.entryCount > 0).length,
        trends: this.calculateWeeklyTrends(weekHistory),
        bestDay: null,
        challengingDay: null
      };

      summary.weekAverage = Math.round(summary.weekTotal / 7);

      // Find best and most challenging days
      const trackedDays = weekHistory.filter(day => day.entryCount > 0);
      if (trackedDays.length > 0) {
        summary.bestDay = trackedDays.reduce((best, day) => {
          const currentDiff = Math.abs(day.totalCalories - calorieNeed.dailyNeed);
          const bestDiff = Math.abs(best.totalCalories - calorieNeed.dailyNeed);
          return currentDiff < bestDiff ? day : best;
        });

        summary.challengingDay = trackedDays.reduce((worst, day) => {
          const currentDiff = Math.abs(day.totalCalories - calorieNeed.dailyNeed);
          const worstDiff = Math.abs(worst.totalCalories - calorieNeed.dailyNeed);
          return currentDiff > worstDiff ? day : worst;
        });
      }

      return summary;

    } catch (error) {
      console.error('Failed to get weekly summary:', error);
      return this.getEmptyWeeklySummary();
    }
  }

  // Private helper methods

  getTodayKey() {
    return this.formatDateKey(new Date());
  }

  formatDateKey(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  async getDayEntries(dateKey) {
    try {
      const scanResults = await offlineService.getScanResults(1000);
      return scanResults.filter(result =>
        result.type === 'calorie_entry' && result.date === dateKey
      );
    } catch (error) {
      console.error('Failed to get day entries:', error);
      return [];
    }
  }

  extractCalories(scanData) {
    // Extract calories from various possible data structures
    if (scanData.calories) return parseFloat(scanData.calories);
    if (scanData.nutrition?.totals?.calories) return parseFloat(scanData.nutrition.totals.calories);
    if (scanData.nutritionData?.calories) return parseFloat(scanData.nutritionData.calories);

    // Estimate from components if available
    if (scanData.components?.length > 0) {
      return scanData.components.reduce((total, component) => {
        return total + (component.calories || component.nutrition?.calories || 0);
      }, 0);
    }

    return 0;
  }

  detectMealType() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 17 && hour < 22) return 'dinner';
    return 'snack';
  }

  groupEntriesByMeal(entries) {
    const meals = { breakfast: [], lunch: [], dinner: [], snack: [] };

    entries.forEach(entry => {
      const meal = entry.meal || 'snack';
      if (meals[meal]) {
        meals[meal].push(entry);
      }
    });

    // Calculate calories per meal
    Object.keys(meals).forEach(meal => {
      meals[meal] = {
        entries: meals[meal],
        calories: meals[meal].reduce((sum, entry) => sum + entry.calories, 0)
      };
    });

    return meals;
  }

  hasRequiredProfileData(profile) {
    return profile.weight && profile.height && profile.age && profile.gender;
  }

  getDefaultCalorieNeed() {
    return {
      bmr: 1500,
      tdee: 2000,
      dailyNeed: 2000,
      goal: 'maintain',
      profile: null,
      isDefault: true
    };
  }

  getDayStatus(percentOfTarget) {
    if (percentOfTarget < 60) return 'under_eating';
    if (percentOfTarget < 90) return 'below_target';
    if (percentOfTarget <= 110) return 'on_target';
    if (percentOfTarget <= 130) return 'over_target';
    return 'significantly_over';
  }

  calculateWeeklyTrends(weekHistory) {
    if (weekHistory.length < 3) return { trend: 'insufficient_data' };

    const recentDays = weekHistory.slice(-3);
    const earlierDays = weekHistory.slice(0, 3);

    const recentAvg = recentDays.reduce((sum, day) => sum + day.totalCalories, 0) / recentDays.length;
    const earlierAvg = earlierDays.reduce((sum, day) => sum + day.totalCalories, 0) / earlierDays.length;

    const change = recentAvg - earlierAvg;
    const percentChange = earlierAvg > 0 ? (change / earlierAvg) * 100 : 0;

    return {
      trend: Math.abs(percentChange) < 5 ? 'stable' :
             percentChange > 0 ? 'increasing' : 'decreasing',
      change: Math.round(change),
      percentChange: Math.round(percentChange * 10) / 10
    };
  }

  getEmptyWeeklySummary() {
    return {
      weekTotal: 0,
      weekAverage: 0,
      targetWeekly: 14000,
      daysTracked: 0,
      trends: { trend: 'no_data' },
      bestDay: null,
      challengingDay: null
    };
  }

  generateEntryId() {
    return `calorie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clearCache() {
    this.cache.clear();
  }

  /**
   * Update user's calorie goal and recalculate needs
   */
  async updateCalorieGoal(newGoal) {
    try {
      const userProfile = await offlineService.getUserProfile();
      if (userProfile) {
        userProfile.goal = newGoal;
        await offlineService.saveUserProfile(userProfile);
        this.clearCache(); // Clear cache to recalculate with new goal
      }
      return await this.calculateDailyNeed();
    } catch (error) {
      console.error('Failed to update calorie goal:', error);
      throw error;
    }
  }

  /**
   * Get meal timing insights
   */
  async getMealTimingInsights(days = 7) {
    try {
      const history = await this.getCalorieHistory(days);
      const insights = {
        averageCaloriesByMeal: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
        mealFrequency: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
        recommendations: []
      };

      let totalDays = 0;
      const mealTotals = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
      const mealCounts = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };

      history.forEach(day => {
        if (day.entryCount > 0) {
          totalDays++;
          Object.keys(day.meals).forEach(meal => {
            if (day.meals[meal].calories > 0) {
              mealTotals[meal] += day.meals[meal].calories;
              mealCounts[meal]++;
            }
          });
        }
      });

      // Calculate averages
      Object.keys(mealTotals).forEach(meal => {
        insights.averageCaloriesByMeal[meal] = mealCounts[meal] > 0
          ? Math.round(mealTotals[meal] / mealCounts[meal])
          : 0;
        insights.mealFrequency[meal] = totalDays > 0
          ? Math.round((mealCounts[meal] / totalDays) * 100)
          : 0;
      });

      // Generate recommendations
      if (insights.mealFrequency.breakfast < 50) {
        insights.recommendations.push('Consider eating breakfast more regularly to maintain stable energy levels');
      }
      if (insights.averageCaloriesByMeal.dinner > 800) {
        insights.recommendations.push('Try to have lighter dinners to improve sleep quality');
      }
      if (insights.averageCaloriesByMeal.snack > 300) {
        insights.recommendations.push('Consider healthier snack options or smaller portions');
      }

      return insights;

    } catch (error) {
      console.error('Failed to get meal timing insights:', error);
      return {
        averageCaloriesByMeal: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
        mealFrequency: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
        recommendations: []
      };
    }
  }
}

export const dailyCalorieTracker = new DailyCalorieTracker();