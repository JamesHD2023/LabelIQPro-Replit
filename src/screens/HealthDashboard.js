import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';
import ipiciaLogo from '../assets/ipicia-logo-yellow.png';
import './HealthDashboard.css';
import healthAnalyticsService from '../services/HealthAnalyticsService';

/**
 * HealthDashboard - Central hub for health insights and trend analysis
 * Provides comprehensive health tracking, nutrition analysis, and personalized recommendations
 */
const HealthDashboard = ({ userId, userProfile }) => {
  const { currentLanguage } = useLanguage();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data state
  const [healthOverview, setHealthOverview] = useState(null);
  const [nutritionAnalytics, setNutritionAnalytics] = useState(null);
  const [safetyAnalytics, setSafetyAnalytics] = useState(null);
  const [healthImpact, setHealthImpact] = useState(null);

  // Load dashboard data
  const loadDashboardData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const [overview, nutrition, safety, impact] = await Promise.all([
        healthAnalyticsService.getHealthOverview(userId || 'demo', timeRange),
        healthAnalyticsService.getNutritionAnalytics(userId || 'demo', '30d'),
        healthAnalyticsService.getIngredientSafetyAnalytics(userId || 'demo', '30d'),
        healthAnalyticsService.getHealthImpactAnalysis(userId || 'demo')
      ]);

      setHealthOverview(overview);
      setNutritionAnalytics(nutrition);
      setSafetyAnalytics(safety);
      setHealthImpact(impact);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, timeRange]);

  useEffect(() => {
    // Load data regardless of userId for demo purposes
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  if (loading && !healthOverview) {
    return <LoadingSpinner />;
  }

  return (
    <div className="health-dashboard">
      {/* Header Section */}
      <DashboardHeader
        healthScore={healthOverview?.healthScore}
        trendDirection={healthOverview?.trendDirection}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Navigation Tabs */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Time Range Selector */}
      <TimeRangeSelector
        activeRange={timeRange}
        onChange={handleTimeRangeChange}
      />

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="tab-content"
        >
          {activeTab === 'overview' && (
            <OverviewTab
              data={healthOverview}
              timeRange={timeRange}
            />
          )}
          {activeTab === 'nutrition' && (
            <NutritionTab
              data={nutritionAnalytics}
              timeRange={timeRange}
            />
          )}
          {activeTab === 'safety' && (
            <SafetyTab
              data={safetyAnalytics}
              timeRange={timeRange}
            />
          )}
          {activeTab === 'impact' && (
            <HealthImpactTab
              data={healthImpact}
              userProfile={userProfile}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Header Component
const DashboardHeader = ({ healthScore, trendDirection, onRefresh, refreshing }) => {
  const { currentLanguage } = useLanguage();
  const getScoreColor = (score) => {
    if (score >= 85) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '📊';
    }
  };

  return (
    <header className="dashboard-header">
      <div className="brand-header">
        <h1 className="app-title">
          <img src={ipiciaLogo} alt="IPICIA" className="app-icon" />
          IPICIA.COM
        </h1>
        <div className="brand-tagline">
          <p className="tagline-main">{t('home.subtitle', currentLanguage)}</p>
          <p className="tagline-sub">{t('home.taglineSub', currentLanguage)}</p>
        </div>
        <div className="page-title">
          <h2>{t('dashboard.title', currentLanguage)}</h2>
        </div>
      </div>
      <div className="header-content">
        <div className="health-score-section">
          <div className="score-display">
            <div
              className="score-circle"
              style={{ '--score-color': getScoreColor(healthScore) }}
            >
              <span className="score-value">{healthScore || '--'}</span>
            </div>
            <div className="score-info">
              <h2>Health Score</h2>
              <div className="trend-indicator">
                <span className="trend-icon">{getTrendIcon(trendDirection)}</span>
                <span className="trend-text">{trendDirection}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
          onClick={onRefresh}
          disabled={refreshing}
        >
          🔄
        </button>
      </div>
    </header>
  );
};

// Tab Navigation
const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'safety', label: 'Safety', icon: '🛡️' },
    { id: 'impact', label: 'Impact', icon: '💡' }
  ];

  return (
    <nav className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

// Time Range Selector
const TimeRangeSelector = ({ activeRange, onChange }) => {
  const ranges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' }
  ];

  return (
    <div className="time-range-selector">
      {ranges.map(range => (
        <button
          key={range.id}
          className={`range-btn ${activeRange === range.id ? 'active' : ''}`}
          onClick={() => onChange(range.id)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ data, timeRange }) => {
  if (!data) return <div className="no-data">No data available</div>;

  return (
    <div className="overview-tab">
      {/* Quick Stats */}
      <section className="quick-stats">
        <StatCard
          title="Recent Scans"
          value={data.scanSummary.total}
          subtitle={`${data.scanSummary.ingredients} ingredients, ${data.scanSummary.meals} meals`}
          icon="🔍"
        />
        <StatCard
          title="Goal Progress"
          value={`${Math.round(data.goalProgress * 100)}%`}
          subtitle="Nutrition goals"
          icon="🎯"
          progress={data.goalProgress}
        />
        <StatCard
          title="Improvement"
          value={`${data.scanSummary.improvement > 0 ? '+' : ''}${data.scanSummary.improvement.toFixed(1)}%`}
          subtitle="vs last period"
          icon={data.scanSummary.improvement > 0 ? '📈' : '📉'}
          color={data.scanSummary.improvement > 0 ? '#4CAF50' : '#F44336'}
        />
      </section>

      {/* Weekly Trend Chart */}
      <section className="chart-section">
        <h3>Health Score Trend</h3>
        <WeeklyTrendChart data={data.weeklyTrend} />
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <ActionButton icon="📸" label="Scan Product" action="scan" />
          <ActionButton icon="🍽️" label="Log Meal" action="meal" />
          <ActionButton icon="🎯" label="Set Goals" action="goals" />
          <ActionButton icon="📋" label="View History" action="history" />
        </div>
      </section>
    </div>
  );
};

// Nutrition Tab Component
const NutritionTab = ({ data, timeRange }) => {
  if (!data) return <div className="no-data">No nutrition data available</div>;

  return (
    <div className="nutrition-tab">
      {/* Daily Nutrition Overview */}
      <section className="nutrition-overview">
        <h3>Daily Nutrition Tracking</h3>
        <div className="nutrition-cards">
          <NutritionCard
            title="Calories"
            current={data.calorieBalance?.average || 2000}
            target={data.calorieBalance?.target || 2000}
            unit="kcal"
            color="#FF6B35"
          />
          <MacroDistributionChart data={data.macroDistribution} />
        </div>
      </section>

      {/* Weekly Trends */}
      <section className="chart-section">
        <h3>Weekly Nutrition Trends</h3>
        <NutritionTrendChart data={data.dailyTrends} />
      </section>

      {/* Nutrient Goals */}
      <section className="nutrient-goals">
        <h3>Nutrient Goal Achievement</h3>
        <div className="goals-grid">
          {Object.entries(data.nutrientGoals || {}).map(([nutrient, achievement]) => (
            <NutrientGoalCard
              key={nutrient}
              nutrient={nutrient}
              achievement={achievement}
            />
          ))}
        </div>
      </section>

      {/* Meal Patterns */}
      <section className="meal-patterns">
        <h3>Meal Frequency Analysis</h3>
        <MealPatternChart data={data.mealPatterns} />
      </section>
    </div>
  );
};

// Safety Tab Component
const SafetyTab = ({ data, timeRange }) => {
  if (!data) return <div className="no-data">No safety data available</div>;

  return (
    <div className="safety-tab">
      {/* Safety Score Trends */}
      <section className="chart-section">
        <h3>Safety Score Trends</h3>
        <SafetyTrendChart data={data.safetyTrends} />
      </section>

      {/* Concerning Ingredients */}
      <section className="concerning-ingredients">
        <h3>Most Concerning Ingredients</h3>
        <div className="ingredients-list">
          {(data.concerningIngredients || []).map((ingredient, index) => (
            <IngredientCard
              key={index}
              ingredient={ingredient}
            />
          ))}
        </div>
      </section>

      {/* Risk Distribution */}
      <section className="risk-analysis">
        <h3>Risk Factor Distribution</h3>
        <RiskDistributionChart data={data.riskDistribution} />
      </section>

      {/* Improvement Suggestions */}
      <section className="improvements">
        <h3>Improvement Suggestions</h3>
        <div className="suggestions-list">
          {(data.improvementSuggestions || []).map((suggestion, index) => (
            <SuggestionCard
              key={index}
              suggestion={suggestion}
            />
          ))}
        </div>
      </section>

      {/* Alternative Recommendations */}
      <section className="alternatives">
        <h3>Alternative Product Recommendations</h3>
        <div className="alternatives-grid">
          {(data.alternativeRecommendations || []).map((alternative, index) => (
            <AlternativeCard
              key={index}
              alternative={alternative}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

// Health Impact Tab Component
const HealthImpactTab = ({ data, userProfile }) => {
  if (!data) return <div className="no-data">No health impact data available</div>;

  return (
    <div className="health-impact-tab">
      {/* Long-term Trends */}
      <section className="chart-section">
        <h3>Long-term Health Predictions</h3>
        <PredictionChart data={data.longTermTrends} />
      </section>

      {/* Risk Factors */}
      <section className="risk-factors">
        <h3>Identified Risk Factors</h3>
        <div className="risk-cards">
          {(data.riskFactors || []).map((risk, index) => (
            <RiskFactorCard
              key={index}
              risk={risk}
            />
          ))}
        </div>
      </section>

      {/* Health Goal Progress */}
      <section className="goal-progress">
        <h3>Health Goal Progress</h3>
        <div className="progress-cards">
          {Object.entries(data.healthGoalProgress || {}).map(([goal, progress]) => (
            <GoalProgressCard
              key={goal}
              goal={goal}
              progress={progress}
            />
          ))}
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="recommendations">
        <h3>Personalized Recommendations</h3>
        <div className="recommendations-list">
          {(data.personalizedRecommendations || []).map((recommendation, index) => (
            <RecommendationCard
              key={index}
              recommendation={recommendation}
            />
          ))}
        </div>
      </section>

      {/* Behavior Patterns */}
      <section className="behavior-patterns">
        <h3>Behavior Pattern Analysis</h3>
        <BehaviorPatternChart data={data.behaviorPatterns} />
      </section>
    </div>
  );
};

// Utility Components
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading health insights...</p>
  </div>
);

const StatCard = ({ title, value, subtitle, icon, progress, color }) => (
  <div className="stat-card" style={{ '--accent-color': color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-subtitle">{subtitle}</div>
      {progress !== undefined && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </div>
  </div>
);

const ActionButton = ({ icon, label, action, onClick }) => (
  <button
    className="action-button"
    onClick={() => onClick && onClick(action)}
  >
    <span className="action-icon">{icon}</span>
    <span className="action-label">{label}</span>
  </button>
);

// Chart Components (simplified implementations)
const WeeklyTrendChart = ({ data }) => (
  <div className="chart-container">
    <div className="trend-chart">
      {(data || []).map((point, index) => (
        <div
          key={index}
          className="trend-point"
          style={{
            height: `${point.score}%`,
            animationDelay: `${index * 0.1}s`
          }}
          title={`${point.week}: ${point.score}`}
        />
      ))}
    </div>
    <div className="chart-labels">
      {(data || []).map((point, index) => (
        <span key={index} className="chart-label">
          {point.week}
        </span>
      ))}
    </div>
  </div>
);

const NutritionCard = ({ title, current, target, unit, color }) => (
  <div className="nutrition-card" style={{ '--color': color }}>
    <h4>{title}</h4>
    <div className="nutrition-values">
      <span className="current">{current}</span>
      <span className="separator">/</span>
      <span className="target">{target}</span>
      <span className="unit">{unit}</span>
    </div>
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
      />
    </div>
  </div>
);

const MacroDistributionChart = ({ data }) => {
  const total = (data?.protein || 0) + (data?.carbs || 0) + (data?.fat || 0);

  return (
    <div className="macro-chart">
      <div className="pie-chart">
        <div className="pie-slice protein" style={{ '--percentage': (data?.protein || 0) / total }} />
        <div className="pie-slice carbs" style={{ '--percentage': (data?.carbs || 0) / total }} />
        <div className="pie-slice fat" style={{ '--percentage': (data?.fat || 0) / total }} />
      </div>
      <div className="macro-legend">
        <div className="legend-item protein">
          <span className="legend-color"></span>
          <span>Protein {data?.protein || 0}%</span>
        </div>
        <div className="legend-item carbs">
          <span className="legend-color"></span>
          <span>Carbs {data?.carbs || 0}%</span>
        </div>
        <div className="legend-item fat">
          <span className="legend-color"></span>
          <span>Fat {data?.fat || 0}%</span>
        </div>
      </div>
    </div>
  );
};

// Additional chart components would be implemented similarly...
const NutritionTrendChart = ({ data }) => <div className="chart-placeholder">Nutrition Trend Chart</div>;
const NutrientGoalCard = ({ nutrient, achievement }) => <div className="nutrient-goal-card">{nutrient}: {achievement}%</div>;
const MealPatternChart = ({ data }) => <div className="chart-placeholder">Meal Pattern Chart</div>;
const SafetyTrendChart = ({ data }) => <div className="chart-placeholder">Safety Trend Chart</div>;
const IngredientCard = ({ ingredient }) => <div className="ingredient-card">{ingredient.name}</div>;
const RiskDistributionChart = ({ data }) => <div className="chart-placeholder">Risk Distribution Chart</div>;
const SuggestionCard = ({ suggestion }) => <div className="suggestion-card">{suggestion}</div>;
const AlternativeCard = ({ alternative }) => <div className="alternative-card">{alternative.name}</div>;
const PredictionChart = ({ data }) => <div className="chart-placeholder">Prediction Chart</div>;
const RiskFactorCard = ({ risk }) => <div className="risk-factor-card">{risk.name}</div>;
const GoalProgressCard = ({ goal, progress }) => <div className="goal-progress-card">{goal}: {progress}%</div>;
const RecommendationCard = ({ recommendation }) => <div className="recommendation-card">{recommendation}</div>;
const BehaviorPatternChart = ({ data }) => <div className="chart-placeholder">Behavior Pattern Chart</div>;

export default HealthDashboard;