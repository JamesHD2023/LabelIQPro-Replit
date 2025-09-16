import React from 'react';
import { useTranslation } from 'react-i18next';
import './IngredientChip.css';

const IngredientChip = ({
  ingredient,
  onClick,
  showScore = false,
  showCategory = false,
  size = 'medium',
  variant = 'default'
}) => {
  const { t } = useTranslation();

  const getSafetyClass = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    if (score >= 20) return 'poor';
    return 'danger';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#84cc16';
    if (score >= 40) return '#f59e0b';
    if (score >= 20) return '#f97316';
    return '#ef4444';
  };

  // Use additive safety score if available, otherwise use standard safety score
  const safetyScore = ingredient.additiveInfo?.safetyScore || ingredient.healthProfile?.safetyScore || ingredient.safetyScore || 50;
  const safetyClass = getSafetyClass(safetyScore);
  const isClickable = typeof onClick === 'function';
  const isAdditive = ingredient.isAdditive && ingredient.additiveInfo;

  const handleClick = (e) => {
    if (isClickable) {
      e.preventDefault();
      onClick(ingredient);
    }
  };

  const handleKeyPress = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(ingredient);
    }
  };

  return (
    <div
      className={`ingredient-chip ${size} ${variant} ${safetyClass} ${isClickable ? 'clickable' : ''} ${!ingredient.isKnown ? 'unknown' : ''}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={isClickable ? 0 : -1}
      role={isClickable ? 'button' : 'presentation'}
      aria-label={isClickable ? t('ingredients.clickForDetails', { name: ingredient.name }) : ingredient.name}
    >
      <div className="chip-content">
        <div className="ingredient-info">
          <span className="ingredient-name">
            {ingredient.name}
            {isAdditive && (
              <span className="additive-badge" title={`E-Number: ${ingredient.additiveInfo.eNumber}`}>
                {ingredient.additiveInfo.eNumber}
              </span>
            )}
          </span>

          {showCategory && (
            <span className="ingredient-category">
              {isAdditive ?
                t(`additive.categories.${ingredient.additiveInfo.category}`, ingredient.additiveInfo.category) :
                ingredient.category ? t(`categories.${ingredient.category}`) : ''
              }
            </span>
          )}

          {isAdditive && (
            <div className="additive-info">
              <span className="additive-function" title={ingredient.additiveInfo.function}>
                {ingredient.additiveInfo.function}
              </span>

              {/* Regulatory status indicators */}
              <div className="regulatory-indicators">
                {!ingredient.additiveInfo.regulatoryStatus.eu.approved && (
                  <span className="regulatory-warning eu" title="Banned in EU">🇪🇺❌</span>
                )}
                {!ingredient.additiveInfo.regulatoryStatus.us.approved && (
                  <span className="regulatory-warning us" title="Banned/Restricted in US">🇺🇸❌</span>
                )}
                {ingredient.additiveInfo.controversies && ingredient.additiveInfo.controversies.length > 0 && (
                  <span className="controversy-indicator" title="Controversial additive">❓</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="chip-indicators">
          {!ingredient.isKnown && !isAdditive && (
            <span className="unknown-indicator" title={t('ingredients.unknown')}>
              ?
            </span>
          )}

          {showScore && (
            <div className="score-indicator">
              <div
                className="score-dot"
                style={{ backgroundColor: getScoreColor(safetyScore) }}
                title={t('ingredients.safetyScore', { score: safetyScore })}
              />
              <span className="score-text">
                {Math.round(safetyScore)}
              </span>
            </div>
          )}

          {ingredient.hazardLevel && ingredient.hazardLevel !== 'safe' && (
            <span
              className={`hazard-indicator ${ingredient.hazardLevel}`}
              title={t(`hazardLevels.${ingredient.hazardLevel}`)}
            >
              {ingredient.hazardLevel === 'high' && '⚠️'}
              {ingredient.hazardLevel === 'medium' && '⚡'}
              {ingredient.hazardLevel === 'low' && '📋'}
            </span>
          )}

          {/* Special indicators for additives */}
          {isAdditive && (
            <>
              {ingredient.additiveInfo.safetyScore < 30 && (
                <span className="danger-indicator" title="High safety concerns">
                  🚫
                </span>
              )}
              {ingredient.additiveInfo.allergenInfo && (
                <span className="allergen-indicator" title={ingredient.additiveInfo.allergenInfo}>
                  🔴
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {isClickable && (
        <div className="chip-arrow">
          <span>→</span>
        </div>
      )}
    </div>
  );
};

export default IngredientChip;