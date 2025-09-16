import React from 'react';
import { useTranslation } from 'react-i18next';
import './StatusBar.css';

const StatusBar = ({ isOnline }) => {
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div className="status-bar offline">
      <div className="status-content">
        <span className="status-icon">⚠️</span>
        <span className="status-text">{t('status.offline')}</span>
      </div>
    </div>
  );
};

export default StatusBar;