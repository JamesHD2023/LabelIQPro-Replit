import React, { useEffect, useState } from 'react';
import { arService } from '../services/ARService';
import './AROverlay.css';

const AROverlay = ({ isActive, mode, onDetection }) => {
  const [trackedObjects, setTrackedObjects] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);

  useEffect(() => {
    if (isActive) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isActive, mode]);

  const startTracking = () => {
    setIsScanning(true);

    // Simulate AR detection updates
    const interval = setInterval(() => {
      if (arService.isActive()) {
        const objects = arService.getTrackedObjects();
        setTrackedObjects(objects);
        setDetectionCount(objects.length);

        if (onDetection && objects.length > 0) {
          onDetection(objects);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  };

  const stopTracking = () => {
    setIsScanning(false);
    setTrackedObjects([]);
    setDetectionCount(0);
  };

  const getARModeInfo = () => {
    return {
      menu: {
        title: 'Menu Scanning',
        description: 'Point at menu items to see health scores',
        icon: '📋',
        color: '#FF9800'
      },
      plate: {
        title: 'Plate Analysis',
        description: 'Scan your plate for nutrition breakdown',
        icon: '🍽️',
        color: '#4CAF50'
      }
    }[mode] || {};
  };

  if (!isActive) return null;

  const modeInfo = getARModeInfo();

  return (
    <div className="ar-overlay">
      {/* AR Mode Indicator */}
      <div className={`ar-mode-indicator ${mode}-mode`}>
        <span className="mode-icon">{modeInfo.icon}</span>
        <span className="mode-text">{modeInfo.title}</span>
        {detectionCount > 0 && (
          <span className="detection-count">{detectionCount}</span>
        )}
      </div>

      {/* AR Instructions */}
      <div className="ar-instructions">
        <div className="instruction-content">
          <p>{modeInfo.description}</p>
          {isScanning && (
            <div className="scanning-indicator">
              <div className="scanning-pulse"></div>
              <span>Scanning...</span>
            </div>
          )}
        </div>
      </div>

      {/* Detection Feedback */}
      {trackedObjects.length > 0 && (
        <div className="detection-feedback">
          <div className="feedback-content">
            <span className="feedback-icon">✨</span>
            <span className="feedback-text">
              {mode === 'menu'
                ? `${trackedObjects.length} menu items detected`
                : `${trackedObjects.length} food items analyzed`
              }
            </span>
          </div>
        </div>
      )}

      {/* AR Tutorial Overlay */}
      {isScanning && trackedObjects.length === 0 && (
        <div className="ar-tutorial">
          <div className="tutorial-content">
            <div className="tutorial-animation">
              <div className="scanning-frame">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
                <div className="scan-line"></div>
              </div>
            </div>
            <div className="tutorial-text">
              <h3>
                {mode === 'menu'
                  ? 'Point camera at menu items'
                  : 'Point camera at your plate'
                }
              </h3>
              <p>
                {mode === 'menu'
                  ? 'Hold steady on menu text for health scores'
                  : 'Ensure good lighting and clear view of food'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="ar-quick-actions">
        <button
          className="quick-action-btn help"
          onClick={() => alert('AR Help: Point your camera at the target and hold steady for analysis')}
        >
          <span>?</span>
        </button>
        <button
          className="quick-action-btn recalibrate"
          onClick={() => {
            arService.stopARScanning();
            setTimeout(() => arService.startARScanning(mode), 100);
          }}
        >
          <span>🎯</span>
        </button>
      </div>
    </div>
  );
};

export default AROverlay;