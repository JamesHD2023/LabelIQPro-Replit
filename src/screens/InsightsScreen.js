import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';
import { offlineService } from '../services/OfflineService';
import SafetyBadge from '../components/SafetyBadge';
import ipiciaLogo from '../assets/ipicia-logo-yellow.png';
import './InsightsScreen.css';

const InsightsScreen = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    loadInsights();
  }, [timeRange]);

  const loadInsights = async () => {
    try {
      setIsLoading(true);

      // Get scan history for the selected time range
      const allScans = await offlineService.getScanResults(100, 0);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));

      const recentScans = allScans.filter(scan =>
        new Date(scan.timestamp) >= cutoffDate
      );

      // Calculate insights
      const calculatedInsights = calculateInsights(recentScans);
      setInsights(calculatedInsights);

    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateInsights = (scans) => {
    if (scans.length === 0) {
      return {
        totalScans: 0,
        averageScore: 0,
        categoryBreakdown: {},
        topConcerns: [],
        improvementTrend: 0,
        recommendations: []
      };
    }

    // Basic stats
    const totalScans = scans.length;
    const scores = scans.map(scan => scan.overallScore?.score || 50);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Category breakdown
    const categoryBreakdown = scans.reduce((acc, scan) => {
      acc[scan.category] = (acc[scan.category] || 0) + 1;
      return acc;
    }, {});

    // Top concerns (most common problematic ingredients)
    const allIngredients = scans.flatMap(scan => scan.ingredients || []);
    const problemIngredients = allIngredients.filter(ing =>
      ing.safetyScore < 60 || ing.hazardLevel === 'high'
    );

    const concernCounts = problemIngredients.reduce((acc, ing) => {
      acc[ing.name] = (acc[ing.name] || 0) + 1;
      return acc;
    }, {});

    const topConcerns = Object.entries(concernCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Trend calculation (compare first half vs second half)
    const midPoint = Math.floor(scans.length / 2);
    const firstHalf = scans.slice(0, midPoint);
    const secondHalf = scans.slice(midPoint);

    const firstHalfAvg = firstHalf.length > 0
      ? firstHalf.reduce((sum, scan) => sum + (scan.overallScore?.score || 50), 0) / firstHalf.length
      : 0;
    const secondHalfAvg = secondHalf.length > 0
      ? secondHalf.reduce((sum, scan) => sum + (scan.overallScore?.score || 50), 0) / secondHalf.length
      : 0;

    const improvementTrend = secondHalfAvg - firstHalfAvg;

    // Generate recommendations
    const recommendations = generateRecommendations(averageScore, topConcerns, categoryBreakdown);

    return {
      totalScans,
      averageScore,
      categoryBreakdown,
      topConcerns,
      improvementTrend,
      recommendations
    };
  };

  const generateRecommendations = (averageScore, topConcerns, categoryBreakdown) => {
    const recommendations = [];

    if (averageScore < 60) {
      recommendations.push({
        type: 'warning',
        title: t('insights.recommendations.lowScore.title', currentLanguage),
        description: t('insights.recommendations.lowScore.description', currentLanguage)
      });
    }

    if (topConcerns.length > 0) {
      recommendations.push({
        type: 'info',
        title: t('insights.recommendations.concerns.title', currentLanguage),
        description: t('insights.recommendations.concerns.description', currentLanguage)
      });
    }

    if (categoryBreakdown.food > (categoryBreakdown.cosmetic || 0) + (categoryBreakdown.household || 0)) {
      recommendations.push({
        type: 'tip',
        title: t('insights.recommendations.foodFocus.title', currentLanguage),
        description: t('insights.recommendations.foodFocus.description', currentLanguage)
      });
    }

    return recommendations;
  };

  if (isLoading) {
    return (
      <div className="insights-screen loading">
        <div className="loading-spinner large"></div>
        <p>{t('insights.loading', currentLanguage)}</p>
      </div>
    );
  }

  return (
    <div className="insights-screen">
      <div className="insights-header">
        <h1 className="app-title">
          <img src={ipiciaLogo} alt="IPICIA" className="app-icon" />
          IPICIA.COM
        </h1>
        <div className="brand-tagline">
          <p className="tagline-main">Scan it - every choice matters!</p>
          <p className="tagline-sub">Ingredient & Product Intelligence: Consumed, Ingested, or Applied</p>
        </div>
        <div className="page-title">
          <h2>{t('insights.title', currentLanguage)}</h2>
        </div>
        <div className="time-range-selector">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7">{t('insights.timeRange.week', currentLanguage)}</option>
            <option value="30">{t('insights.timeRange.month', currentLanguage)}</option>
            <option value="90">{t('insights.timeRange.quarter', currentLanguage)}</option>
          </select>
        </div>
      </div>

      <div className="insights-content">
        {insights.totalScans === 0 ? (
          <div className="no-insights">
            <div className="no-insights-icon">📊</div>
            <h2>{t('insights.noData.title', currentLanguage)}</h2>
            <p>{t('insights.noData.description', currentLanguage)}</p>
            <button
              className="primary-button"
              onClick={() => navigate('/camera')}
            >
              {t('insights.noData.startScanning', currentLanguage)}
            </button>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="insights-overview">
              <div className="insight-card">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <h3>{insights.totalScans}</h3>
                  <p>{t('insights.overview.totalScans', currentLanguage)}</p>
                </div>
              </div>

              <div className="insight-card">
                <div className="card-content">
                  <SafetyBadge
                    score={insights.averageScore}
                    size="medium"
                    showLabel={true}
                  />
                  <p>{t('insights.overview.averageScore', currentLanguage)}</p>
                </div>
              </div>

              <div className="insight-card">
                <div className="card-icon">
                  {insights.improvementTrend > 0 ? '📈' : insights.improvementTrend < 0 ? '📉' : '➡️'}
                </div>
                <div className="card-content">
                  <h3>
                    {insights.improvementTrend > 0 ? '+' : ''}
                    {insights.improvementTrend.toFixed(1)}
                  </h3>
                  <p>{t('insights.overview.trend', currentLanguage)}</p>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <section className="insights-section">
              <h2>{t('insights.categories.title', currentLanguage)}</h2>
              <div className="category-chart">
                {Object.entries(insights.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="category-bar">
                    <div className="category-info">
                      <span className="category-name">
                        {t(`categories.${category}`, currentLanguage)}
                      </span>
                      <span className="category-count">{count}</span>
                    </div>
                    <div className="category-progress">
                      <div
                        className={`progress-fill ${category}`}
                        style={{
                          width: `${(count / insights.totalScans) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Concerns */}
            {insights.topConcerns.length > 0 && (
              <section className="insights-section">
                <h2>{t('insights.concerns.title', currentLanguage)}</h2>
                <div className="concerns-list">
                  {insights.topConcerns.map((concern, index) => (
                    <div key={concern.name} className="concern-item">
                      <div className="concern-rank">#{index + 1}</div>
                      <div className="concern-info">
                        <h3>{concern.name}</h3>
                        <p>{t('insights.concerns.found', currentLanguage).replace('{{count}}', concern.count)}</p>
                      </div>
                      <div className="concern-badge">⚠️</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommendations */}
            {insights.recommendations.length > 0 && (
              <section className="insights-section">
                <h2>{t('insights.recommendations.title', currentLanguage)}</h2>
                <div className="recommendations-list">
                  {insights.recommendations.map((rec, index) => (
                    <div key={index} className={`recommendation-item ${rec.type}`}>
                      <div className="recommendation-icon">
                        {rec.type === 'warning' && '⚠️'}
                        {rec.type === 'info' && 'ℹ️'}
                        {rec.type === 'tip' && '💡'}
                      </div>
                      <div className="recommendation-content">
                        <h3>{rec.title}</h3>
                        <p>{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InsightsScreen;