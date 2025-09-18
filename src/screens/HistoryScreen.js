import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Translation system removed for stability
import { offlineService } from '../services/OfflineService';
import SafetyBadge from '../components/SafetyBadge';
import './HistoryScreen.css';

const HistoryScreen = () => {
  const navigate = useNavigate();
  // Translation system removed for stability

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
      setError('Failed to load scan history. Please try again.');
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
    if (window.confirm('Are you sure you want to delete this scan?')) {
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
        <p>Loading your scan history...</p>
      </div>
    );
  }

  return (
    <div className="history-screen">
      <div className="history-header">
        <h1>Scan History</h1>
        <div className="filter-buttons">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-button ${filter === 'food' ? 'active' : ''}`}
            onClick={() => setFilter('food')}
          >
            Food
          </button>
          <button
            className={`filter-button ${filter === 'cosmetic' ? 'active' : ''}`}
            onClick={() => setFilter('cosmetic')}
          >
            Cosmetic
          </button>
          <button
            className={`filter-button ${filter === 'household' ? 'active' : ''}`}
            onClick={() => setFilter('household')}
          >
            Household
          </button>
        </div>
      </div>

      <div className="history-content">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={loadHistory}>Retry</button>
          </div>
        )}

        {filteredHistory.length === 0 && !error ? (
          <div className="empty-history">
            <div className="empty-icon">📋</div>
            <h2>No Scans Yet</h2>
            <p>Start scanning products to see your history here</p>
            <button
              className="primary-button"
              onClick={() => navigate('/camera')}
            >
              Start Scanning
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
                      {scan.category || 'Food'}
                    </span>
                    <span className="scan-date">
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="scan-details">
                    <p className="ingredient-count">
                      {scan.ingredients?.length || 0} ingredients
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
                    aria-label="Delete scan"
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