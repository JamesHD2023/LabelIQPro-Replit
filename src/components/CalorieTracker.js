import React, { useState, useEffect } from 'react';
import { dailyCalorieTracker } from '../services/DailyCalorieTracker';
import './CalorieTracker.css';

const CalorieTracker = ({ onScanRequest }) => {
  const [dailyTotal, setDailyTotal] = useState(null);
  const [calorieNeed, setCalorieNeed] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('today'); // today, history, insights

  useEffect(() => {
    loadDailyData();
  }, []);

  const loadDailyData = async () => {
    try {
      setIsLoading(true);
      const [total, need, warningData] = await Promise.all([
        dailyCalorieTracker.getDailyTotal(),
        dailyCalorieTracker.calculateDailyNeed(),
        dailyCalorieTracker.checkDailyWarnings()
      ]);

      setDailyTotal(total);
      setCalorieNeed(need);
      setWarnings(warningData.warnings || []);
    } catch (error) {
      console.error('Failed to load daily calorie data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanMeal = () => {
    if (onScanRequest) {
      onScanRequest('calorie_tracking');
    }
  };

  const getProgressColor = () => {
    if (!dailyTotal || !calorieNeed) return '#E0E0E0';

    const percentage = (dailyTotal.totalCalories / calorieNeed.dailyNeed) * 100;

    if (percentage < 60) return '#FF5722'; // Red for too low
    if (percentage < 90) return '#FF9800'; // Orange for below target
    if (percentage <= 110) return '#4CAF50'; // Green for on target
    if (percentage <= 130) return '#FF9800'; // Orange for over target
    return '#FF5722'; // Red for significantly over
  };

  const getProgressPercentage = () => {
    if (!dailyTotal || !calorieNeed) return 0;
    return Math.min((dailyTotal.totalCalories / calorieNeed.dailyNeed) * 100, 100);
  };

  const renderTodayView = () => (
    <div className="calorie-tracker-today">
      {/* Daily Progress Circle */}
      <div className="calorie-progress-container">
        <div className="calorie-progress-circle">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#E0E0E0"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={getProgressColor()}
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 80}`}
              strokeDashoffset={`${2 * Math.PI * 80 * (1 - getProgressPercentage() / 100)}`}
              transform="rotate(-90 100 100)"
              className="progress-arc"
            />
          </svg>
          <div className="progress-text">
            <div className="current-calories">
              {dailyTotal ? dailyTotal.totalCalories.toLocaleString() : '0'}
            </div>
            <div className="calorie-label">calories</div>
            <div className="target-calories">
              of {calorieNeed ? calorieNeed.dailyNeed.toLocaleString() : '2000'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="calorie-quick-stats">
        <div className="stat-item">
          <span className="stat-value">
            {calorieNeed ? Math.max(0, calorieNeed.dailyNeed - (dailyTotal?.totalCalories || 0)).toLocaleString() : '2000'}
          </span>
          <span className="stat-label">Remaining</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{dailyTotal ? dailyTotal.entryCount : 0}</span>
          <span className="stat-label">Meals</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {dailyTotal && calorieNeed ? Math.round((dailyTotal.totalCalories / calorieNeed.dailyNeed) * 100) : 0}%
          </span>
          <span className="stat-label">of Goal</span>
        </div>
      </div>

      {/* Meal Breakdown */}
      {dailyTotal && dailyTotal.meals && (
        <div className="meals-breakdown">
          <h3>Today's Meals</h3>
          <div className="meal-items">
            {Object.entries(dailyTotal.meals).map(([mealType, mealData]) => (
              mealData.calories > 0 && (
                <div key={mealType} className="meal-item">
                  <div className="meal-info">
                    <span className="meal-name">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
                    <span className="meal-count">{mealData.entries.length} items</span>
                  </div>
                  <div className="meal-calories">{Math.round(mealData.calories)} cal</div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Warnings and Recommendations */}
      {warnings.length > 0 && (
        <div className="calorie-warnings">
          {warnings.map((warning, index) => (
            <div key={index} className={`warning-item ${warning.level}`}>
              <div className="warning-icon">
                {warning.type === 'warning' ? '⚠️' : warning.type === 'info' ? 'ℹ️' : '💡'}
              </div>
              <div className="warning-content">
                <div className="warning-message">{warning.message}</div>
                {warning.recommendation && (
                  <div className="warning-recommendation">{warning.recommendation}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scan Button */}
      <button className="scan-meal-btn" onClick={handleScanMeal}>
        <span className="scan-icon">📸</span>
        <span>Scan Meal</span>
      </button>
    </div>
  );

  const renderHistoryView = () => {
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
      const loadHistory = async () => {
        try {
          const historyData = await dailyCalorieTracker.getCalorieHistory(7);
          setHistory(historyData);
        } catch (error) {
          console.error('Failed to load history:', error);
        } finally {
          setHistoryLoading(false);
        }
      };

      if (view === 'history') {
        loadHistory();
      }
    }, [view]);

    if (historyLoading) {
      return <div className="loading">Loading history...</div>;
    }

    return (
      <div className="calorie-history">
        <h3>7-Day History</h3>
        <div className="history-chart">
          {history.map((day, index) => (
            <div key={day.date} className="history-day">
              <div className="day-label">{day.displayDate.split('/')[1]}/{day.displayDate.split('/')[2]}</div>
              <div className="day-bar-container">
                <div
                  className="day-bar"
                  style={{
                    height: `${Math.min((day.totalCalories / day.targetCalories) * 100, 150)}%`,
                    backgroundColor: day.totalCalories > day.targetCalories ? '#FF9800' : '#4CAF50'
                  }}
                />
                <div className="target-line" />
              </div>
              <div className="day-calories">{day.totalCalories}</div>
            </div>
          ))}
        </div>
        <div className="history-legend">
          <div className="legend-item">
            <div className="legend-color green" />
            <span>Within target</span>
          </div>
          <div className="legend-item">
            <div className="legend-color orange" />
            <span>Over target</span>
          </div>
        </div>
      </div>
    );
  };

  const renderInsightsView = () => {
    const [insights, setInsights] = useState(null);
    const [weeklySummary, setWeeklySummary] = useState(null);
    const [insightsLoading, setInsightsLoading] = useState(true);

    useEffect(() => {
      const loadInsights = async () => {
        try {
          const [insightData, summaryData] = await Promise.all([
            dailyCalorieTracker.getMealTimingInsights(),
            dailyCalorieTracker.getWeeklySummary()
          ]);
          setInsights(insightData);
          setWeeklySummary(summaryData);
        } catch (error) {
          console.error('Failed to load insights:', error);
        } finally {
          setInsightsLoading(false);
        }
      };

      if (view === 'insights') {
        loadInsights();
      }
    }, [view]);

    if (insightsLoading) {
      return <div className="loading">Loading insights...</div>;
    }

    return (
      <div className="calorie-insights">
        <h3>Weekly Insights</h3>

        {weeklySummary && (
          <div className="weekly-summary">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-value">{weeklySummary.weekAverage}</span>
                <span className="stat-label">Daily Average</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">{weeklySummary.daysTracked}/7</span>
                <span className="stat-label">Days Tracked</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">
                  {weeklySummary.trends.trend === 'stable' ? '→' :
                   weeklySummary.trends.trend === 'increasing' ? '↗' : '↘'}
                </span>
                <span className="stat-label">Trend</span>
              </div>
            </div>
          </div>
        )}

        {insights && (
          <div className="meal-insights">
            <h4>Meal Distribution</h4>
            <div className="meal-distribution">
              {Object.entries(insights.averageCaloriesByMeal).map(([meal, calories]) => (
                calories > 0 && (
                  <div key={meal} className="meal-dist-item">
                    <span className="meal-name">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                    <div className="meal-bar">
                      <div
                        className="meal-bar-fill"
                        style={{ width: `${(calories / 800) * 100}%` }}
                      />
                    </div>
                    <span className="meal-calories">{Math.round(calories)} cal</span>
                  </div>
                )
              ))}
            </div>

            {insights.recommendations.length > 0 && (
              <div className="insights-recommendations">
                <h4>Recommendations</h4>
                {insights.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation">
                    <span className="rec-icon">💡</span>
                    <span className="rec-text">{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="calorie-tracker loading">
        <div className="loading-spinner">⏳</div>
        <div>Loading calorie data...</div>
      </div>
    );
  }

  return (
    <div className="calorie-tracker">
      <div className="tracker-header">
        <h2>Daily Calorie Tracker</h2>
        <div className="view-selector">
          <button
            className={view === 'today' ? 'active' : ''}
            onClick={() => setView('today')}
          >
            Today
          </button>
          <button
            className={view === 'history' ? 'active' : ''}
            onClick={() => setView('history')}
          >
            History
          </button>
          <button
            className={view === 'insights' ? 'active' : ''}
            onClick={() => setView('insights')}
          >
            Insights
          </button>
        </div>
      </div>

      <div className="tracker-content">
        {view === 'today' && renderTodayView()}
        {view === 'history' && renderHistoryView()}
        {view === 'insights' && renderInsightsView()}
      </div>
    </div>
  );
};

export default CalorieTracker;