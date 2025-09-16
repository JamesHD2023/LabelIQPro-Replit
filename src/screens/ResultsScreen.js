import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { offlineService } from '../services/OfflineService';
import { scoringService } from '../services/ScoringService';
import { learningJourneyService } from '../services/LearningJourneyService';
import { dailyCalorieTracker } from '../services/DailyCalorieTracker';
import SafetyBadge from '../components/SafetyBadge';
import IngredientChip from '../components/IngredientChip';
import SocialShareButton, { CompactShareButton } from '../components/SocialShareButton';
import './ResultsScreen.css';

const ResultsScreen = () => {
  const { scanId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [scanResult, setScanResult] = useState(null);
  const [overallScore, setOverallScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [calorieTrackingResult, setCalorieTrackingResult] = useState(null);

  // Determine scan type helpers
  const isMealAnalysis = () => scanResult?.type === 'meal_analysis';
  const isIngredientScan = () => scanResult?.type === 'ingredient_analysis';

  useEffect(() => {
    loadScanResult();
  }, [scanId]);

  const loadScanResult = async () => {
    try {
      setIsLoading(true);

      // Get scan result from location state or database
      let result = location.state?.scanResult;
      if (!result) {
        result = await offlineService.getScanResult(scanId);
      }

      if (!result) {
        setError(t('results.errors.notFound'));
        return;
      }

      setScanResult(result);

      // Calculate appropriate score based on scan type
      if (isMealAnalysis()) {
        setOverallScore({
          score: result.healthAssessment?.overallHealthScore || 75,
          description: result.healthAssessment?.summary || 'Analyzing meal health impact...',
          warnings: result.healthAssessment?.warnings || []
        });
      } else {
        const score = await scoringService.calculateOverallScore(
          result.ingredients,
          result.category
        );
        setOverallScore(score);
      }

      // Save to database if new scan
      if (location.state?.scanResult) {
        await offlineService.saveScanResult(result);

        // Update learning progress
        await learningJourneyService.updateLearningProgress({
          type: 'scan_completed',
          category: result.category,
          ingredientCount: result.ingredients?.length || 0,
          overallScore: overallScore?.score || 50
        });
      }

    } catch (err) {
      console.error('Failed to load scan result:', err);
      setError(t('results.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngredientClick = useCallback((ingredient) => {
    setSelectedIngredient(ingredient);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="results-screen loading">
        <div className="loading-content">
          <div className="loading-spinner large"></div>
          <h2>Analyzing your scan...</h2>
          <p>Processing ingredients and calculating health scores</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="results-screen error">
        <div className="error-content">
          <span className="error-icon">⚠️</span>
          <h2>Unable to load results</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={() => navigate('/')}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // MEAL ANALYSIS LAYOUT
  if (isMealAnalysis()) {
    return (
      <div className="results-screen meal-analysis">
        {/* Header */}
        <header className="results-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span>
          </button>
          <div className="header-content">
            <h1>🍽️ Meal Analysis</h1>
            <p>AI-powered nutrition breakdown</p>
          </div>
          <CompactShareButton scanResult={scanResult} />
        </header>

        <main className="results-main">
          {/* Health Score Hero Section */}
          <section className="hero-score-section">
            <div className="score-container">
              <SafetyBadge
                score={overallScore?.score || 0}
                size="hero"
                showLabel={false}
              />
              <div className="score-info">
                <h2>Health Score</h2>
                <div className="score-number">{overallScore?.score || 0}/100</div>
                <p className="score-meaning">
                  {overallScore?.score >= 80 ? '🌟 Excellent choice!' :
                   overallScore?.score >= 60 ? '👍 Good meal' :
                   overallScore?.score >= 40 ? '⚠️ Could be better' :
                   '❌ Consider healthier options'}
                </p>
              </div>
            </div>
            {overallScore?.description && (
              <div className="score-description">
                <p>{overallScore.description}</p>
              </div>
            )}
          </section>

          {/* Quick Facts */}
          <section className="quick-facts">
            <h3>Meal Overview</h3>
            <div className="facts-grid">
              <div className="fact-item">
                <span className="fact-icon">🔥</span>
                <span className="fact-label">Calories</span>
                <span className="fact-value">
                  {scanResult.nutritionAnalysis?.totals?.calories
                    ? `${Math.round(scanResult.nutritionAnalysis.totals.calories)}`
                    : 'Calculating...'}
                </span>
              </div>
              <div className="fact-item">
                <span className="fact-icon">🍽️</span>
                <span className="fact-label">Components</span>
                <span className="fact-value">{scanResult.mealAnalysis?.components?.length || 0}</span>
              </div>
              <div className="fact-item">
                <span className="fact-icon">💪</span>
                <span className="fact-label">Protein</span>
                <span className="fact-value">
                  {scanResult.nutritionAnalysis?.totals?.protein
                    ? `${Math.round(scanResult.nutritionAnalysis.totals.protein)}g`
                    : 'N/A'}
                </span>
              </div>
              <div className="fact-item">
                <span className="fact-icon">📅</span>
                <span className="fact-label">Analyzed</span>
                <span className="fact-value">{new Date(scanResult.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </section>

          {/* Food Components */}
          {scanResult.mealAnalysis?.components && (
            <section className="components-section">
              <h3>Identified Foods</h3>
              <div className="components-grid">
                {scanResult.mealAnalysis.components.map((component, index) => (
                  <div key={index} className="component-card">
                    <div className="component-icon">
                      {component.category === 'protein' ? '🥩' :
                       component.category === 'vegetable' ? '🥬' :
                       component.category === 'grain' ? '🌾' :
                       component.category === 'fruit' ? '🍎' :
                       component.category === 'dairy' ? '🥛' : '🍽️'}
                    </div>
                    <div className="component-info">
                      <h4>{component.name}</h4>
                      <span className="component-category">{component.category}</span>
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: `${(component.confidence || 0.8) * 100}%` }}
                        />
                      </div>
                      <span className="confidence-text">
                        {Math.round((component.confidence || 0.8) * 100)}% confident
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Nutrition Breakdown */}
          {scanResult.nutritionAnalysis?.totals && (
            <section className="nutrition-section">
              <h3>Nutrition Breakdown</h3>
              <div className="nutrition-macros">
                <div className="macro-item">
                  <div className="macro-circle protein">
                    <span className="macro-value">{Math.round(scanResult.nutritionAnalysis.totals.protein || 0)}</span>
                    <span className="macro-unit">g</span>
                  </div>
                  <span className="macro-label">Protein</span>
                </div>
                <div className="macro-item">
                  <div className="macro-circle carbs">
                    <span className="macro-value">{Math.round(scanResult.nutritionAnalysis.totals.carbohydrates || 0)}</span>
                    <span className="macro-unit">g</span>
                  </div>
                  <span className="macro-label">Carbs</span>
                </div>
                <div className="macro-item">
                  <div className="macro-circle fat">
                    <span className="macro-value">{Math.round(scanResult.nutritionAnalysis.totals.fat || 0)}</span>
                    <span className="macro-unit">g</span>
                  </div>
                  <span className="macro-label">Fat</span>
                </div>
              </div>
            </section>
          )}

          {/* Health Warnings */}
          {overallScore?.warnings && overallScore.warnings.length > 0 && (
            <section className="warnings-section">
              <h3>⚠️ Health Considerations</h3>
              <div className="warnings-list">
                {overallScore.warnings.map((warning, index) => (
                  <div key={index} className="warning-item">
                    <span className="warning-icon">⚠️</span>
                    <span className="warning-text">{warning}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Share Section */}
          <section className="share-section">
            <SocialShareButton scanResult={scanResult} size="large" />
            <p className="share-description">
              Share your healthy meal analysis with friends and inspire others to make better food choices!
            </p>
          </section>
        </main>
      </div>
    );
  }

  // INGREDIENT SCAN LAYOUT
  return (
    <div className="results-screen ingredient-scan">
      {/* Header */}
      <header className="results-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span className="back-icon">←</span>
        </button>
        <div className="header-content">
          <h1>🔍 Ingredient Analysis</h1>
          <p>{scanResult.category === 'food' ? 'Food ingredients reviewed' :
              scanResult.category === 'cosmetic' ? 'Beauty product analyzed' :
              'Product ingredients scanned'}</p>
        </div>
        <CompactShareButton scanResult={scanResult} />
      </header>

      <main className="results-main">
        {/* Safety Score Hero Section */}
        <section className="hero-score-section">
          <div className="score-container">
            <SafetyBadge
              score={overallScore?.score || 0}
              size="hero"
              showLabel={false}
            />
            <div className="score-info">
              <h2>Safety Score</h2>
              <div className="score-number">{overallScore?.score || 0}/100</div>
              <p className="score-meaning">
                {overallScore?.score >= 80 ? '🌟 Very safe ingredients' :
                 overallScore?.score >= 60 ? '✅ Generally safe' :
                 overallScore?.score >= 40 ? '⚠️ Some concerns' :
                 '❌ Multiple safety concerns'}
              </p>
            </div>
          </div>
          {overallScore?.description && (
            <div className="score-description">
              <p>{overallScore.description}</p>
            </div>
          )}
        </section>

        {/* Quick Facts */}
        <section className="quick-facts">
          <h3>Scan Summary</h3>
          <div className="facts-grid">
            <div className="fact-item">
              <span className="fact-icon">📋</span>
              <span className="fact-label">Category</span>
              <span className="fact-value">
                {scanResult.category === 'food' ? 'Food Product' :
                 scanResult.category === 'cosmetic' ? 'Beauty Product' :
                 scanResult.category === 'household' ? 'Household Item' : 'Product'}
              </span>
            </div>
            <div className="fact-item">
              <span className="fact-icon">🧪</span>
              <span className="fact-label">Ingredients</span>
              <span className="fact-value">{scanResult.ingredients?.length || 0}</span>
            </div>
            <div className="fact-item">
              <span className="fact-icon">✅</span>
              <span className="fact-label">Safe</span>
              <span className="fact-value">
                {scanResult.ingredients?.filter(i => i.healthProfile?.isHealthy).length || 0}
              </span>
            </div>
            <div className="fact-item">
              <span className="fact-icon">⚠️</span>
              <span className="fact-label">Concerns</span>
              <span className="fact-value">
                {scanResult.ingredients?.filter(i => i.healthProfile?.concerns?.length > 0).length || 0}
              </span>
            </div>
          </div>
        </section>

        {/* Ingredients Grid */}
        <section className="ingredients-section">
          <h3>Ingredient Breakdown</h3>
          {scanResult.ingredients && scanResult.ingredients.length > 0 ? (
            <div className="ingredients-grid">
              {scanResult.ingredients.map((ingredient, index) => (
                <IngredientChip
                  key={ingredient.id || index}
                  ingredient={ingredient}
                  onClick={() => handleIngredientClick(ingredient)}
                  showScore={true}
                />
              ))}
            </div>
          ) : (
            <div className="no-ingredients">
              <span className="no-ingredients-icon">🤷</span>
              <h4>No ingredients detected</h4>
              <p>Try taking a clearer photo of the ingredient list or product label.</p>
            </div>
          )}
        </section>

        {/* Safety Warnings */}
        {overallScore?.warnings && overallScore.warnings.length > 0 && (
          <section className="warnings-section">
            <h3>⚠️ Safety Considerations</h3>
            <div className="warnings-list">
              {overallScore.warnings.map((warning, index) => (
                <div key={index} className="warning-item">
                  <span className="warning-icon">⚠️</span>
                  <span className="warning-text">{warning}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Share Section */}
        <section className="share-section">
          <SocialShareButton scanResult={scanResult} size="large" />
          <p className="share-description">
            Share your ingredient analysis and help others make safer product choices!
          </p>
        </section>

        {/* Raw Text (Collapsible) */}
        {scanResult.rawText && (
          <section className="raw-text-section">
            <details>
              <summary>View Original Text</summary>
              <div className="raw-text">
                <pre>{scanResult.rawText}</pre>
              </div>
            </details>
          </section>
        )}
      </main>

      {/* Ingredient Detail Modal */}
      {selectedIngredient && (
        <div className="ingredient-modal-overlay" onClick={() => setSelectedIngredient(null)}>
          <div className="ingredient-modal" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <div className="modal-title">
                <h3>
                  {selectedIngredient.name}
                  {selectedIngredient.isAdditive && selectedIngredient.additiveInfo && (
                    <span className="additive-badge-modal">
                      {selectedIngredient.additiveInfo.eNumber}
                    </span>
                  )}
                </h3>
                {selectedIngredient.isAdditive && selectedIngredient.additiveInfo && (
                  <p className="additive-category">
                    {selectedIngredient.additiveInfo.category} • {selectedIngredient.additiveInfo.function}
                  </p>
                )}
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedIngredient(null)}
              >
                ✕
              </button>
            </header>
            <div className="modal-content">
              <div className="ingredient-safety">
                <SafetyBadge
                  score={selectedIngredient.additiveInfo?.safetyScore || selectedIngredient.healthProfile?.safetyScore || 50}
                  size="large"
                  showLabel={true}
                />
              </div>

              {/* Additive-specific information */}
              {selectedIngredient.isAdditive && selectedIngredient.additiveInfo && (
                <>
                  <div className="additive-details">
                    <h4>Additive Information</h4>

                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">E-Number:</span>
                        <span className="detail-value">{selectedIngredient.additiveInfo.eNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">{selectedIngredient.additiveInfo.category}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Function:</span>
                        <span className="detail-value">{selectedIngredient.additiveInfo.function}</span>
                      </div>
                      {selectedIngredient.additiveInfo.sources && selectedIngredient.additiveInfo.sources.length > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">Sources:</span>
                          <span className="detail-value">{selectedIngredient.additiveInfo.sources.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Regulatory Status */}
                    <div className="regulatory-section">
                      <h5>Regulatory Status</h5>
                      <div className="regulatory-grid">
                        <div className={`regulatory-item ${selectedIngredient.additiveInfo.regulatoryStatus.eu.approved ? 'approved' : 'banned'}`}>
                          <span className="flag">🇪🇺</span>
                          <div className="regulatory-info">
                            <span className="status">
                              {selectedIngredient.additiveInfo.regulatoryStatus.eu.approved ? 'Approved' : 'Banned'}
                            </span>
                            <span className="restrictions">
                              {selectedIngredient.additiveInfo.regulatoryStatus.eu.restrictions}
                            </span>
                          </div>
                        </div>
                        <div className={`regulatory-item ${selectedIngredient.additiveInfo.regulatoryStatus.us.approved ? 'approved' : 'banned'}`}>
                          <span className="flag">🇺🇸</span>
                          <div className="regulatory-info">
                            <span className="status">
                              {selectedIngredient.additiveInfo.regulatoryStatus.us.approved ? 'Approved' : 'Banned/Restricted'}
                            </span>
                            <span className="restrictions">
                              {selectedIngredient.additiveInfo.regulatoryStatus.us.restrictions}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Health Concerns */}
                    {selectedIngredient.additiveInfo.healthConcerns && selectedIngredient.additiveInfo.healthConcerns.length > 0 && (
                      <div className="health-concerns-section">
                        <h5>Health Concerns</h5>
                        <ul className="concerns-list">
                          {selectedIngredient.additiveInfo.healthConcerns.map((concern, index) => (
                            <li key={index}>{concern}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Controversies */}
                    {selectedIngredient.additiveInfo.controversies && selectedIngredient.additiveInfo.controversies.length > 0 && (
                      <div className="controversies-section">
                        <h5>Ongoing Controversies</h5>
                        <ul className="controversies-list">
                          {selectedIngredient.additiveInfo.controversies.map((controversy, index) => (
                            <li key={index}>{controversy}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Allergen Information */}
                    {selectedIngredient.additiveInfo.allergenInfo && (
                      <div className="allergen-section">
                        <h5>⚠️ Allergen Information</h5>
                        <p className="allergen-warning">{selectedIngredient.additiveInfo.allergenInfo}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Standard ingredient information */}
              {selectedIngredient.healthProfile?.description && (
                <div className="ingredient-description-section">
                  <h4>Description</h4>
                  <p className="ingredient-description">
                    {selectedIngredient.healthProfile.description}
                  </p>
                </div>
              )}

              {/* Standard concerns (for non-additives or additional concerns) */}
              {selectedIngredient.healthProfile?.concerns && selectedIngredient.healthProfile.concerns.length > 0 && (
                <div className="ingredient-concerns">
                  <h4>Additional Concerns:</h4>
                  <ul>
                    {selectedIngredient.healthProfile.concerns.map((concern, index) => (
                      <li key={index}>{concern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Regulatory warnings */}
              {selectedIngredient.healthProfile?.regulatoryWarnings && selectedIngredient.healthProfile.regulatoryWarnings.length > 0 && (
                <div className="regulatory-warnings">
                  <h4>Regulatory Notes:</h4>
                  <ul>
                    {selectedIngredient.healthProfile.regulatoryWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsScreen;