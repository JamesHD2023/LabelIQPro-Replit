import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';
import CalorieTracker from '../components/CalorieTracker';
import './HomeScreen.css';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('food');

  const scanOptions = [
    {
      id: 'food',
      title: t('home.scanOptions.food.title', currentLanguage),
      subtitle: t('home.scanOptions.food.subtitle', currentLanguage),
      icon: '🍎',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'cosmetic',
      title: t('home.scanOptions.cosmetic.title', currentLanguage),
      subtitle: t('home.scanOptions.cosmetic.subtitle', currentLanguage),
      icon: '💄',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'household',
      title: t('home.scanOptions.household.title', currentLanguage),
      subtitle: t('home.scanOptions.household.subtitle', currentLanguage),
      icon: '🧽',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  const selectedOption = scanOptions.find(option => option.id === selectedCategory);

  const handleScan = () => {
    navigate(`/camera?category=${selectedCategory}`);
  };

  const handleCalorieTrackerScan = (trackingMode) => {
    // Navigate to camera with food category and prepared-meal mode for calorie tracking
    navigate(`/camera?category=food&mode=prepared-meal&tracking=${trackingMode}`);
  };

  return (
    <div className="home-screen">
      <div
        className="hero-section"
        style={{ background: selectedOption?.gradient }}
      >
        <div className="hero-content">
          <h1 className="app-title">
            <span className="app-icon">🔍</span>
            <span className="app-name-label">Label</span>
            <span className="app-name-iq">IQ.Pro</span>
          </h1>
          <p className="app-subtitle">
            {t('home.subtitle', currentLanguage)}
          </p>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>{t('home.selectCategory', currentLanguage)}</h2>
          <p>{t('home.selectCategorySubtitle', currentLanguage)}</p>
        </div>

        <div className="scan-options">
          {scanOptions.map((option) => (
            <button
              key={option.id}
              className={`scan-option ${selectedCategory === option.id ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(option.id)}
            >
              <div className="option-icon">{option.icon}</div>
              <div className="option-content">
                <h3>{option.title}</h3>
                <p>{option.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        <button
          className="scan-button primary-button"
          onClick={handleScan}
        >
          <span className="button-icon">📷</span>
          {t('home.startScan', currentLanguage)}
        </button>

        <div className="quick-actions">
          <button
            className="quick-action"
            onClick={() => navigate('/history')}
          >
            <span className="action-icon">📋</span>
            {t('home.quickActions.history', currentLanguage)}
          </button>
          <button
            className="quick-action"
            onClick={() => navigate('/insights')}
          >
            <span className="action-icon">📊</span>
            {t('home.quickActions.insights', currentLanguage)}
          </button>
        </div>

        {/* Daily Calorie Tracker */}
        <CalorieTracker onScanRequest={handleCalorieTrackerScan} />
      </div>
    </div>
  );
};

export default HomeScreen;