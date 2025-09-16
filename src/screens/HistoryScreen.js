import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { offlineService } from '../services/OfflineService';
import SafetyBadge from '../components/SafetyBadge';
import './HistoryScreen.css';

const HistoryScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [scanHistory, setScanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const history = await offlineService.getScanResults(50, 0);
      setScanHistory(history);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError(t('history.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = scanHistory.filter(scan => {
    if (filter === 'all') return true;
    return scan.category === filter;
  });

  const handleScanClick = (scan) => {
    navigate(`/results/${scan.id}`, {
      state: { scanResult: scan }
    });
  };

  const handleDelete = async (scanId, e) => {
    e.stopPropagation();
    if (window.confirm(t('history.confirmDelete'))) {
      try {
        await offlineService.deleteScanResult(scanId);
        setScanHistory(prev => prev.filter(scan => scan.id !== scanId));
      } catch (err) {
        console.error('Failed to delete scan:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="history-screen loading">
        <div className="loading-spinner large"></div>
        <p>{t('history.loading')}</p>
      </div>
    );
  }

  return (
    <div className="history-screen">
      <div className="history-header">
        <h1>{t('history.title')}</h1>
        <div className="filter-buttons">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('history.filters.all')}
          </button>
          <button
            className={`filter-button ${filter === 'food' ? 'active' : ''}`}
            onClick={() => setFilter('food')}
          >
            {t('history.filters.food')}
          </button>
          <button
            className={`filter-button ${filter === 'cosmetic' ? 'active' : ''}`}
            onClick={() => setFilter('cosmetic')}
          >
            {t('history.filters.cosmetic')}
          </button>
          <button
            className={`filter-button ${filter === 'household' ? 'active' : ''}`}
            onClick={() => setFilter('household')}
          >
            {t('history.filters.household')}
          </button>
        </div>
      </div>

      <div className="history-content">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={loadHistory}>{t('history.retry')}</button>
          </div>
        )}

        {filteredHistory.length === 0 && !error ? (
          <div className="empty-history">
            <div className="empty-icon">📋</div>
            <h2>{t('history.empty.title')}</h2>
            <p>{t('history.empty.description')}</p>
            <button
              className="primary-button"
              onClick={() => navigate('/camera')}
            >
              {t('history.empty.startScanning')}
            </button>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map((scan) => (
              <div
                key={scan.id}
                className="history-item"
                onClick={() => handleScanClick(scan)}
              >
                <div className="scan-info">
                  <div className="scan-header">
                    <span className={`category-badge ${scan.category}`}>
                      {t(`categories.${scan.category}`)}
                    </span>
                    <span className="scan-date">
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="scan-details">
                    <p className="ingredient-count">
                      {scan.ingredients?.length || 0} {t('history.ingredients')}
                    </p>
                    {scan.rawText && (
                      <p className="scan-preview">
                        {scan.rawText.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>

                <div className="scan-actions">
                  <SafetyBadge
                    score={scan.overallScore?.score || 50}
                    size="small"
                  />
                  <button
                    className="delete-button"
                    onClick={(e) => handleDelete(scan.id, e)}
                    aria-label={t('history.delete')}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;