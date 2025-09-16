import React from 'react';
import { useTranslation } from 'react-i18next';
import './SafetyBadge.css';

const SafetyBadge = ({ score, size = 'medium', showLabel = false, className = '' }) => {
  const { t } = useTranslation();

  const getSafetyLevel = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    if (score >= 20) return 'poor';
    return 'danger';
  };

  const getSafetyColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#84cc16'; // Light green
    if (score >= 40) return '#f59e0b'; // Yellow
    if (score >= 20) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const safetyLevel = getSafetyLevel(score);
  const safetyColor = getSafetyColor(score);

  // Calculate circle progress
  const circumference = 2 * Math.PI * 40; // radius = 40
  const progress = (score / 100) * circumference;

  return (
    <div className={`safety-badge ${size} ${safetyLevel} ${className}`}>
      <div className="badge-circle">
        <svg width="100" height="100" className="progress-ring">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={safetyColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={safetyColor} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transform="rotate(-90 50 50)"
            className="progress-circle"
          />
        </svg>

        <div className="score-content">
          <span className="score-number">{Math.round(score)}</span>
          <span className="score-max">/100</span>
        </div>
      </div>

      {showLabel && (
        <div className="badge-label">
          <span className="safety-text">
            {t(`safetyLevels.${safetyLevel}`)}
          </span>
        </div>
      )}
    </div>
  );
};

export default SafetyBadge;