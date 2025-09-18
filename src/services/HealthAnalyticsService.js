/**
 * HealthAnalyticsService - Service for health data aggregation and trend analysis
 * Handles calculations for nutrition tracking, ingredient safety, and health predictions
 */

class HealthAnalyticsService {
  constructor() {
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.cache = new Map();
  }

  // Cache management
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Overview Analytics
  async getHealthOverview(userId, timeRange = '7d') {
    const cacheKey = `overview-${userId}-${timeRange}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Simulate API call - replace with actual API endpoints
      const scanData = await this.getScanHistory(userId, timeRange);
      const nutritionData = await this.getNutritionHistory(userId, timeRange);
      const goalsData = await this.getUserGoals(userId);

      const overview = {
        healthScore: this.calculateHealthScore(scanData, nutritionData),
        trendDirection: this.calculateTrend(scanData, nutritionData),
        scanSummary: {
          total: scanData.length,
          ingredients: scanData.filter(s => s.type === 'ingredient').length,
          meals: scanData.filter(s => s.type === 'meal').length,
          improvement: this.calculateImprovementRate(scanData)
        },
        goalProgress: this.calculateGoalProgress(nutritionData, goalsData),
        weeklyTrend: this.generateWeeklyTrend(scanData, nutritionData)
      };

      this.setCachedData(cacheKey, overview);
      return overview;
    } catch (error) {
      console.error('Error getting health overview:', error);
      return this.getDefaultOverview();
    }
  }

  // Nutrition Analytics
  async getNutritionAnalytics(userId, timeRange = '30d') {
    const cacheKey = `nutrition-${userId}-${timeRange}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const nutritionData = await this.getNutritionHistory(userId, timeRange);
      const goals = await this.getUserGoals(userId);

      const analytics = {
        dailyTrends: this.calculateDailyNutritionTrends(nutritionData),
        weeklyAverages: this.calculateWeeklyAverages(nutritionData),
        macroDistribution: this.calculateMacroDistribution(nutritionData),
        nutrientGoals: this.calculateNutrientGoalAchievement(nutritionData, goals),
        mealPatterns: this.analyzeMealPatterns(nutritionData),
        calorieBalance: this.calculateCalorieBalance(nutritionData, goals)
      };

      this.setCachedData(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error getting nutrition analytics:', error);
      return this.getDefaultNutritionAnalytics();
    }
  }

  // Ingredient Safety Analytics
  async getIngredientSafetyAnalytics(userId, timeRange = '30d') {
    const cacheKey = `safety-${userId}-${timeRange}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const scanData = await this.getScanHistory(userId, timeRange);
      const ingredientData = scanData.filter(s => s.type === 'ingredient' || s.ingredients);

      const analytics = {
        safetyTrends: this.calculateSafetyTrends(ingredientData),
        concerningIngredients: this.identifyConcerningIngredients(ingredientData),
        improvementSuggestions: this.generateImprovementSuggestions(ingredientData),
        alternativeRecommendations: this.getAlternativeRecommendations(ingredientData),
        riskDistribution: this.calculateRiskDistribution(ingredientData),
        frequencyAnalysis: this.analyzeIngredientFrequency(ingredientData)
      };

      this.setCachedData(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error getting ingredient safety analytics:', error);
      return this.getDefaultSafetyAnalytics();
    }
  }

  // Health Impact Analysis
  async getHealthImpactAnalysis(userId) {
    const cacheKey = `impact-${userId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const nutritionData = await this.getNutritionHistory(userId, '90d');
      const scanData = await this.getScanHistory(userId, '90d');
      const userProfile = await this.getUserProfile(userId);

      const analysis = {
        longTermTrends: this.predictLongTermTrends(nutritionData, scanData),
        riskFactors: this.identifyRiskFactors(nutritionData, scanData, userProfile),
        healthGoalProgress: this.analyzeHealthGoalProgress(nutritionData, userProfile.goals),
        personalizedRecommendations: this.generatePersonalizedRecommendations(nutritionData, scanData, userProfile),
        predictiveInsights: this.generatePredictiveInsights(nutritionData, scanData, userProfile),
        behaviorPatterns: this.analyzeBehaviorPatterns(scanData)
      };

      this.setCachedData(cacheKey, analysis);
      return analysis;
    } catch (error) {
      console.error('Error getting health impact analysis:', error);
      return this.getDefaultHealthImpactAnalysis();
    }
  }

  // Calculation Methods
  calculateHealthScore(scanData, nutritionData) {
    let score = 70; // Base score

    // Nutrition score component (40%)
    const nutritionScore = this.calculateNutritionScore(nutritionData);
    score += (nutritionScore - 70) * 0.4;

    // Ingredient safety score component (35%)
    const safetyScore = this.calculateSafetyScore(scanData);
    score += (safetyScore - 70) * 0.35;

    // Consistency bonus (25%)
    const consistencyScore = this.calculateConsistencyScore(scanData, nutritionData);
    score += (consistencyScore - 70) * 0.25;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  calculateNutritionScore(nutritionData) {
    if (!nutritionData.length) return 70;

    const recent = nutritionData.slice(-7); // Last 7 days
    let score = 70;

    // Macro balance
    const avgMacros = this.calculateAverageMacros(recent);
    score += this.scoreMacroBalance(avgMacros);

    // Calorie consistency
    const calorieConsistency = this.calculateCalorieConsistency(recent);
    score += calorieConsistency * 0.3;

    // Nutrient diversity
    const nutrientDiversity = this.calculateNutrientDiversity(recent);
    score += nutrientDiversity * 0.2;

    return Math.max(0, Math.min(100, score));
  }

  calculateSafetyScore(scanData) {
    if (!scanData.length) return 70;

    const recent = scanData.slice(-20); // Last 20 scans
    let score = 85; // Start higher for safety

    recent.forEach(scan => {
      if (scan.safetyScore) {
        score += (scan.safetyScore - 70) * 0.1;
      }
      if (scan.riskIngredients) {
        score -= scan.riskIngredients.length * 2;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  calculateTrend(scanData, nutritionData) {
    const recentHealthScores = [];
    const days = 7;

    for (let i = 0; i < days; i++) {
      const dayData = this.getDataForDay(scanData, nutritionData, i);
      recentHealthScores.push(this.calculateHealthScore(dayData.scans, dayData.nutrition));
    }

    const firstHalf = recentHealthScores.slice(0, Math.floor(days / 2));
    const secondHalf = recentHealthScores.slice(Math.floor(days / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;

    if (difference > 2) return 'improving';
    if (difference < -2) return 'declining';
    return 'stable';
  }

  generateWeeklyTrend(scanData, nutritionData) {
    const weeks = 4;
    const trend = [];

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekData = this.getDataForDateRange(scanData, nutritionData, weekStart, weekEnd);
      const healthScore = this.calculateHealthScore(weekData.scans, weekData.nutrition);

      trend.push({
        week: `Week ${weeks - i}`,
        score: healthScore,
        date: weekStart.toISOString().split('T')[0]
      });
    }

    return trend;
  }

  // Mock data methods (replace with actual API calls)
  async getScanHistory(userId, timeRange) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock data - replace with actual API call
    return this.generateMockScanData(timeRange);
  }

  async getNutritionHistory(userId, timeRange) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.generateMockNutritionData(timeRange);
  }

  async getUserGoals(userId) {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 65,
      fiber: 25,
      sugar: 50
    };
  }

  async getUserProfile(userId) {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      age: 30,
      gender: 'male',
      activityLevel: 'moderate',
      healthConditions: [],
      goals: {
        primary: 'weight_loss',
        target: 'lose_10_lbs',
        timeline: '3_months'
      }
    };
  }

  // Mock data generators
  generateMockScanData(timeRange) {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];

    for (let i = 0; i < days * 2; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(i / 2));

      data.push({
        id: `scan_${i}`,
        type: Math.random() > 0.6 ? 'meal' : 'ingredient',
        date: date.toISOString(),
        safetyScore: Math.floor(Math.random() * 40) + 60,
        riskIngredients: Math.random() > 0.7 ? ['artificial_colors', 'preservatives'] : [],
        healthScore: Math.floor(Math.random() * 30) + 70
      });
    }

    return data.reverse();
  }

  generateMockNutritionData(timeRange) {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toISOString().split('T')[0],
        calories: Math.floor(Math.random() * 500) + 1800,
        protein: Math.floor(Math.random() * 50) + 100,
        carbs: Math.floor(Math.random() * 100) + 200,
        fat: Math.floor(Math.random() * 30) + 50,
        fiber: Math.floor(Math.random() * 15) + 15,
        sugar: Math.floor(Math.random() * 30) + 30,
        meals: Math.floor(Math.random() * 3) + 3
      });
    }

    return data.reverse();
  }

  // Default fallback data
  getDefaultOverview() {
    return {
      healthScore: 75,
      trendDirection: 'stable',
      scanSummary: { total: 0, ingredients: 0, meals: 0, improvement: 0 },
      goalProgress: 0.6,
      weeklyTrend: []
    };
  }

  getDefaultNutritionAnalytics() {
    return {
      dailyTrends: [],
      weeklyAverages: {},
      macroDistribution: { protein: 25, carbs: 45, fat: 30 },
      nutrientGoals: {},
      mealPatterns: {},
      calorieBalance: { average: 2000, target: 2000 }
    };
  }

  getDefaultSafetyAnalytics() {
    return {
      safetyTrends: [],
      concerningIngredients: [],
      improvementSuggestions: [],
      alternativeRecommendations: [],
      riskDistribution: {},
      frequencyAnalysis: {}
    };
  }

  getDefaultHealthImpactAnalysis() {
    return {
      longTermTrends: {},
      riskFactors: [],
      healthGoalProgress: {},
      personalizedRecommendations: [],
      predictiveInsights: {},
      behaviorPatterns: {}
    };
  }

  // Utility methods
  calculateGoalProgress(nutritionData, goals) {
    if (!nutritionData.length || !goals) return 0;

    const recent = nutritionData.slice(-7);
    const avgCalories = recent.reduce((sum, day) => sum + day.calories, 0) / recent.length;

    return Math.min(1, avgCalories / goals.calories);
  }

  calculateImprovementRate(scanData) {
    if (scanData.length < 10) return 0;

    const recent = scanData.slice(-10);
    const older = scanData.slice(-20, -10);

    const recentAvg = recent.reduce((sum, scan) => sum + scan.healthScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, scan) => sum + scan.healthScore, 0) / older.length;

    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }

  getDataForDay(scanData, nutritionData, daysAgo) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    const dateStr = targetDate.toISOString().split('T')[0];

    return {
      scans: scanData.filter(scan => scan.date.startsWith(dateStr)),
      nutrition: nutritionData.filter(nutrition => nutrition.date === dateStr)
    };
  }

  getDataForDateRange(scanData, nutritionData, startDate, endDate) {
    return {
      scans: scanData.filter(scan => {
        const scanDate = new Date(scan.date);
        return scanDate >= startDate && scanDate <= endDate;
      }),
      nutrition: nutritionData.filter(nutrition => {
        const nutritionDate = new Date(nutrition.date);
        return nutritionDate >= startDate && nutritionDate <= endDate;
      })
    };
  }

  // Missing method implementations for demo functionality
  calculateDailyNutritionTrends(nutritionData) {
    return [
      { date: '2024-01-01', calories: 2100, carbs: 250, protein: 110, fat: 80 },
      { date: '2024-01-02', calories: 1950, carbs: 220, protein: 105, fat: 75 },
      { date: '2024-01-03', calories: 2200, carbs: 260, protein: 115, fat: 85 },
      { date: '2024-01-04', calories: 2050, carbs: 240, protein: 108, fat: 78 },
      { date: '2024-01-05', calories: 2150, carbs: 255, protein: 112, fat: 82 },
      { date: '2024-01-06', calories: 1980, carbs: 225, protein: 102, fat: 76 },
      { date: '2024-01-07', calories: 2080, carbs: 245, protein: 109, fat: 79 }
    ];
  }

  calculateSafetyTrends(ingredientData) {
    return [
      { date: '2024-01-01', score: 78 },
      { date: '2024-01-02', score: 82 },
      { date: '2024-01-03', score: 75 },
      { date: '2024-01-04', score: 85 },
      { date: '2024-01-05', score: 79 },
      { date: '2024-01-06', score: 88 },
      { date: '2024-01-07', score: 83 }
    ];
  }

  calculateWeeklyAverages(nutritionData) {
    return { calories: 2070, carbs: 242, protein: 109, fat: 79 };
  }

  calculateMacroDistribution(nutritionData) {
    return { carbs: 47, protein: 21, fat: 32 };
  }

  calculateNutrientGoalAchievement(nutritionData, goals) {
    return {
      protein: { current: 109, target: 120, achievement: 91 },
      fiber: { current: 25, target: 30, achievement: 83 },
      calcium: { current: 850, target: 1000, achievement: 85 },
      iron: { current: 12, target: 15, achievement: 80 }
    };
  }

  analyzeMealPatterns(nutritionData) {
    return { breakfast: 22, lunch: 35, dinner: 33, snacks: 10 };
  }

  calculateCalorieBalance(nutritionData, goals) {
    return { average: 2070, target: 2000, balance: 70, trend: 'stable' };
  }
}

// Export singleton instance
export default new HealthAnalyticsService();