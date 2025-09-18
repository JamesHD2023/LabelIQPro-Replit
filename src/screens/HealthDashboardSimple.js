import React, { useState } from 'react';
import './HealthDashboard.css';

/**
 * Simplified HealthDashboard - Shows intended functionality without complex service dependencies
 */
const HealthDashboardSimple = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Demo data to show what dashboard should display
  const demoData = {
    healthScore: 82,
    trendDirection: 'improving',
    scanSummary: { total: 45, ingredients: 32, meals: 13, improvement: 12 },
    goalProgress: { calories: 95, nutrition: 88, safety: 76 },
    weeklyTrend: [78, 80, 75, 82, 85, 79, 83]
  };

  return (
    <div className="health-dashboard">
      {/* Header with Health Score */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="health-score-section">
            <div className="score-display">
              <div className="score-circle" style={{ '--score-color': '#4CAF50' }}>
                <span className="score-value">{demoData.healthScore}</span>
              </div>
              <div className="score-info">
                <h2>Health Score</h2>
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
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
          { id: 'safety', label: 'Safety', icon: '🛡️' },
          { id: 'impact', label: 'Impact', icon: '💡' }
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
                <h3>Total Scans</h3>
                <div className="stat-value">{demoData.scanSummary.total}</div>
                <div className="stat-subtitle">This month</div>
              </div>
              <div className="stat-card">
                <h3>Ingredient Scans</h3>
                <div className="stat-value">{demoData.scanSummary.ingredients}</div>
                <div className="stat-subtitle">Products analyzed</div>
              </div>
              <div className="stat-card">
                <h3>Meal Analysis</h3>
                <div className="stat-value">{demoData.scanSummary.meals}</div>
                <div className="stat-subtitle">Foods identified</div>
              </div>
              <div className="stat-card">
                <h3>Health Improvement</h3>
                <div className="stat-value">+{demoData.scanSummary.improvement}%</div>
                <div className="stat-subtitle">This week</div>
              </div>
            </section>

            <section className="goal-progress-section">
              <h3>Goal Progress</h3>
              <div className="progress-cards">
                <div className="progress-card">
                  <div className="progress-label">Calorie Goals</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${demoData.goalProgress.calories}%`}}></div>
                  </div>
                  <div className="progress-value">{demoData.goalProgress.calories}%</div>
                </div>
                <div className="progress-card">
                  <div className="progress-label">Nutrition Quality</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${demoData.goalProgress.nutrition}%`}}></div>
                  </div>
                  <div className="progress-value">{demoData.goalProgress.nutrition}%</div>
                </div>
                <div className="progress-card">
                  <div className="progress-label">Safety Score</div>
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
              <h3>Daily Nutrition Tracking</h3>
              <div className="nutrition-cards">
                <div className="nutrition-card">
                  <h4>Calories</h4>
                  <div className="nutrition-value">2,070 <span>kcal</span></div>
                  <div className="nutrition-target">Target: 2,000 kcal</div>
                </div>
                <div className="nutrition-card">
                  <h4>Macros Distribution</h4>
                  <div className="macro-chart">
                    <div className="macro-item">
                      <span className="macro-color" style={{background: '#FF6B35'}}></span>
                      Carbs: 47%
                    </div>
                    <div className="macro-item">
                      <span className="macro-color" style={{background: '#4ECDC4'}}></span>
                      Protein: 21%
                    </div>
                    <div className="macro-item">
                      <span className="macro-color" style={{background: '#45B7D1'}}></span>
                      Fat: 32%
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
              <h3>Most Concerning Ingredients</h3>
              <div className="ingredients-list">
                <div className="ingredient-item">
                  <div className="ingredient-name">Red Dye #40</div>
                  <div className="risk-badge high">High Risk</div>
                  <div className="ingredient-count">Found in 8 products</div>
                </div>
                <div className="ingredient-item">
                  <div className="ingredient-name">High Fructose Corn Syrup</div>
                  <div className="risk-badge medium">Medium Risk</div>
                  <div className="ingredient-count">Found in 12 products</div>
                </div>
                <div className="ingredient-item">
                  <div className="ingredient-name">Sodium Benzoate</div>
                  <div className="risk-badge medium">Medium Risk</div>
                  <div className="ingredient-count">Found in 6 products</div>
                </div>
              </div>
            </section>

            <section className="improvements">
              <h3>Improvement Suggestions</h3>
              <div className="suggestions-list">
                <div className="suggestion-item">✅ Reduce processed foods consumption</div>
                <div className="suggestion-item">✅ Choose organic alternatives when possible</div>
                <div className="suggestion-item">✅ Read ingredient labels more carefully</div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="health-impact-tab">
            <section className="risk-factors">
              <h3>Health Impact Analysis</h3>
              <div className="impact-cards">
                <div className="impact-card">
                  <h4>Cardiovascular Health</h4>
                  <div className="impact-score">78 → 82</div>
                  <div className="impact-trend">Improving trend</div>
                </div>
                <div className="impact-card">
                  <h4>Metabolic Health</h4>
                  <div className="impact-score">85 → 87</div>
                  <div className="impact-trend">Stable improvement</div>
                </div>
              </div>
            </section>

            <section className="recommendations">
              <h3>Personalized Recommendations</h3>
              <div className="recommendations-list">
                <div className="recommendation-item">
                  🥬 Increase vegetables in your daily meals
                </div>
                <div className="recommendation-item">
                  🧂 Reduce sodium intake by 20%
                </div>
                <div className="recommendation-item">
                  🌾 Add more whole grains to your diet
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