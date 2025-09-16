import React from 'react';
import { useTranslation } from 'react-i18next';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo">
          <div className="logo-icon">🔍</div>
          <h1>LabelIQ</h1>
        </div>

        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>

        <p className="loading-text">
          {t('loading.initializing')}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;