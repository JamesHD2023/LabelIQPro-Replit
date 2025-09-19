import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';
import ipiciaLogo from '../assets/ipicia-logo-yellow.png';
import './HealthDashboard.css';

/**
 * Simplified HealthDashboard - Shows intended functionality without complex service dependencies
 */
const HealthDashboardSimple = () => {
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Demo data to show what dashboard should display
  const demoData = {
    healthScore: 82,
    trendDirection: t('dashboard.improving', currentLanguage),
    scanSummary: { total: 45, ingredients: 32, meals: 13, improvement: 12 },
    goalProgress: { calories: 95, nutrition: 88, safety: 76 },
    weeklyTrend: [78, 80, 75, 82, 85, 79, 83]
  };

  return (
    <div className="health-dashboard">
      {/* Header with Health Score */}
      <header className="dashboard-header">
        <div className="brand-header">
          <h1 className="app-title">
            <img src={ipiciaLogo} alt="IPICIA" className="app-icon" />
            IPICIA.COM
          </h1>
          <div className="brand-tagline">
            <p className="tagline-main">Scan it - every choice matters!</p>
            <p className="tagline-sub">Ingredient & Product Intelligence: Consumed, Ingested, or Applied</p>
          </div>
          <div className="page-title">
            <h2>{t('dashboard.title', currentLanguage)}</h2>
          </div>
        </div>
        <div className="header-content">
          <div className="health-score-section">
            <div className="score-display">
              <div className="score-circle" style={{ '--score-color': '#4CAF50' }}>
                <span className="score-value">{demoData.healthScore}</span>
              </div>
              <div className="score-info">
                <h2>{t('dashboard.healthScore', currentLanguage)}</h2>
                <div className="trend-indicator">
                  <span className="trend-icon">📈</span>
                  <span className="trend-text">{demoData.trendDirection}</span>
                </div>
              </div>
            </div>
          </div>
          <button className="refresh-btn">🔄</button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        {[
          { id: 'overview', label: t('dashboard.overview', currentLanguage), icon: '📊' },
          { id: 'nutrition', label: t('dashboard.nutrition', currentLanguage), icon: '🥗' },
          { id: 'safety', label: t('dashboard.safety', currentLanguage), icon: '🛡️' },
          { id: 'impact', label: t('dashboard.impact', currentLanguage), icon: '💡' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <section className="stats-grid">
              <div className="stat-card">
                <h3>{t('dashboard.totalScans', currentLanguage)}</h3>
                <div className="stat-value">{demoData.scanSummary.total}</div>
                <div className="stat-subtitle">{t('dashboard.thisMonth', currentLanguage)}</div>
              </div>
              <div className="stat-card">
                <h3>{t('dashboard.ingredientScans', currentLanguage)}</h3>
                <div className="stat-value">{demoData.scanSummary.ingredients}</div>
                <div className="stat-subtitle">{t('dashboard.productsAnalyzed', currentLanguage)}</div>
              </div>
              <div className="stat-card">
                <h3>{t('dashboard.mealAnalysis', currentLanguage)}</h3>
                <div className="stat-value">{demoData.scanSummary.meals}</div>
                <div className="stat-subtitle">{t('dashboard.foodsIdentified', currentLanguage)}</div>
              </div>
              <div className="stat-card">
                <h3>{t('dashboard.healthImprovement', currentLanguage)}</h3>
                <div className="stat-value">+{demoData.scanSummary.improvement}%</div>
                <div className="stat-subtitle">{t('dashboard.thisWeek', currentLanguage)}</div>
              </div>
            </section>

            <section className="goal-progress-section">
              <h3>{t('dashboard.goalProgress', currentLanguage)}</h3>
              <div className="progress-cards">
                <div className="progress-card">
                  <div className="progress-label">{t('dashboard.calorieGoals', currentLanguage)}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${demoData.goalProgress.calories}%`}}></div>
                  </div>
                  <div className="progress-value">{demoData.goalProgress.calories}%</div>
                </div>
                <div className="progress-card">
                  <div className="progress-label">{t('dashboard.nutritionQuality', currentLanguage)}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${demoData.goalProgress.nutrition}%`}}></div>
                  </div>
                  <div className="progress-value">{demoData.goalProgress.nutrition}%</div>
                </div>
                <div className="progress-card">
                  <div className="progress-label">{t('dashboard.safetyScore', currentLanguage)}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${demoData.goalProgress.safety}%`}}></div>
                  </div>
                  <div className="progress-value">{demoData.goalProgress.safety}%</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="nutrition-tab">
            <section className="nutrition-overview">
              <h3>{t('dashboard.dailyNutritionTracking', currentLanguage)}</h3>
              <div className="nutrition-cards">
                <div className="nutrition-card">
                  <h4>{t('dashboard.calories', currentLanguage)}</h4>
                  <div className="nutrition-value">2,070 <span>kcal</span></div>
                  <div className="nutrition-target">{t('dashboard.target', currentLanguage)}: 2,000 kcal</div>
                </div>
                <div className="nutrition-card">
                  <h4>{t('dashboard.macrosDistribution', currentLanguage)}</h4>
                  <div className="macro-chart">
                    <div className="macro-item">
                      <span className="macro-color" style={{background: '#FF6B35'}}></span>
                      {t('dashboard.carbs', currentLanguage)}: 47%
                    </div>
                    <div className="macro-item">
                      <span className="macro-color" style={{background: '#4ECDC4'}}></span>
                      {t('dashboard.protein', currentLanguage)}: 21%
                    </div>
                    <div className="macro-item">
                      <span className="macro-color" style={{background: '#45B7D1'}}></span>
                      {t('dashboard.fat', currentLanguage)}: 32%
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="safety-tab">
            <section className="concerning-ingredients">
              <h3>{t('dashboard.mostConcerningIngredients', currentLanguage)}</h3>
              <div className="ingredients-list">
                <div className="ingredient-item">
                  <div className="ingredient-name">Red Dye #40</div>
                  <div className="risk-badge high">{t('dashboard.highRisk', currentLanguage)}</div>
                  <div className="ingredient-count">{t('dashboard.foundInProducts', currentLanguage).replace('{count}', '8')}</div>
                </div>
                <div className="ingredient-item">
                  <div className="ingredient-name">High Fructose Corn Syrup</div>
                  <div className="risk-badge medium">{t('dashboard.mediumRisk', currentLanguage)}</div>
                  <div className="ingredient-count">{t('dashboard.foundInProducts', currentLanguage).replace('{count}', '12')}</div>
                </div>
                <div className="ingredient-item">
                  <div className="ingredient-name">Sodium Benzoate</div>
                  <div className="risk-badge medium">{t('dashboard.mediumRisk', currentLanguage)}</div>
                  <div className="ingredient-count">{t('dashboard.foundInProducts', currentLanguage).replace('{count}', '6')}</div>
                </div>
              </div>
            </section>

            <section className="improvements">
              <h3>{t('dashboard.improvementSuggestions', currentLanguage)}</h3>
              <div className="suggestions-list">
                <div className="suggestion-item">✅ {t('dashboard.reduceProcessedFoods', currentLanguage)}</div>
                <div className="suggestion-item">✅ {t('dashboard.chooseOrganic', currentLanguage)}</div>
                <div className="suggestion-item">✅ {t('dashboard.readLabels', currentLanguage)}</div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="health-impact-tab">
            <section className="risk-factors">
              <h3>{t('dashboard.healthImpactAnalysis', currentLanguage)}</h3>
              <div className="impact-cards">
                <div className="impact-card">
                  <h4>{t('dashboard.cardiovascularHealth', currentLanguage)}</h4>
                  <div className="impact-score">78 → 82</div>
                  <div className="impact-trend">{t('dashboard.improvingTrend', currentLanguage)}</div>
                </div>
                <div className="impact-card">
                  <h4>{t('dashboard.metabolicHealth', currentLanguage)}</h4>
                  <div className="impact-score">85 → 87</div>
                  <div className="impact-trend">{t('dashboard.stableImprovement', currentLanguage)}</div>
                </div>
              </div>
            </section>

            <section className="recommendations">
              <h3>{t('dashboard.personalizedRecommendations', currentLanguage)}</h3>
              <div className="recommendations-list">
                <div className="recommendation-item">
                  🥬 {t('dashboard.increaseVegetables', currentLanguage)}
                </div>
                <div className="recommendation-item">
                  🧂 {t('dashboard.reduceSodium', currentLanguage)}
                </div>
                <div className="recommendation-item">
                  🌾 {t('dashboard.addWholeGrains', currentLanguage)}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthDashboardSimple;