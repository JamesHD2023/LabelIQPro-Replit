import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { learningJourneyService } from '../services/LearningJourneyService';
import './LearningCard.css';

const LearningCard = ({ card, onComplete, onDismiss }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = async () => {
    setIsCompleted(true);
    await learningJourneyService.updateLearningProgress({
      type: 'daily_card_read',
      cardId: card.id
    });
    if (onComplete) onComplete(card);
  };

  const getCardIcon = (type) => {
    const icons = {
      'basic_skill': '📚',
      'safety_awareness': '⚠️',
      'practical_advice': '💡',
      'science_education': '🧪',
      'safety_science': '🔬',
      'advanced_knowledge': '🎓'
    };
    return icons[type] || '📖';
  };

  const getCardColor = (type) => {
    const colors = {
      'basic_skill': 'var(--success-color)',
      'safety_awareness': 'var(--warning-color)',
      'practical_advice': 'var(--info-color)',
      'science_education': 'var(--primary-color)',
      'safety_science': '#8b5cf6',
      'advanced_knowledge': '#f59e0b'
    };
    return colors[type] || 'var(--gray-500)';
  };

  return (
    <div className={`learning-card ${isCompleted ? 'completed' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="card-icon" style={{ color: getCardColor(card.type) }}>
          {getCardIcon(card.type)}
        </div>
        <div className="card-title-section">
          <h3 className="card-title">{card.title}</h3>
          <div className="card-meta">
            <span className="card-type">{t(`learning.types.${card.type}`)}</span>
            <span className="card-time">{card.estimatedTime}</span>
          </div>
        </div>
        <button className="expand-button">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="card-content">
          <div className="card-main-content">
            <p className="content-text">{card.content}</p>

            {card.tip && (
              <div className="learning-tip">
                <div className="tip-header">
                  <span className="tip-icon">💡</span>
                  <span className="tip-label">{t('learning.tip')}</span>
                </div>
                <p className="tip-text">{card.tip}</p>
              </div>
            )}

            {card.actionable && (
              <div className="actionable-item">
                <div className="action-header">
                  <span className="action-icon">🎯</span>
                  <span className="action-label">{t('learning.tryThis')}</span>
                </div>
                <p className="action-text">{card.actionable}</p>
              </div>
            )}

            {card.keyPoints && (
              <div className="key-points">
                <h4>{t('learning.keyPoints')}</h4>
                <ul>
                  {card.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {card.examples && (
              <div className="examples-section">
                <h4>{t('learning.examples')}</h4>
                <div className="examples-grid">
                  {card.examples.map((example, index) => (
                    <div key={index} className="example-item">
                      <span className="example-emoji">{example.emoji}</span>
                      <span className="example-text">{example.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card-actions">
            {onDismiss && (
              <button
                className="dismiss-button"
                onClick={onDismiss}
              >
                {t('learning.dismiss')}
              </button>
            )}
            <button
              className={`complete-button ${isCompleted ? 'completed' : ''}`}
              onClick={handleComplete}
              disabled={isCompleted}
            >
              {isCompleted ? (
                <>
                  <span className="check-icon">✓</span>
                  {t('learning.completed')}
                </>
              ) : (
                t('learning.markComplete')
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningCard;