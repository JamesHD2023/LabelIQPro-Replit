import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { learningJourneyService } from '../services/LearningJourneyService';
import LearningCard from '../components/LearningCard';
import LearningProgress from '../components/LearningProgress';
import './LearningScreen.css';

const LearningScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [profile, setProfile] = useState(null);
  const [dailyCard, setDailyCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    try {
      setIsLoading(true);
      const [userProfile, todayCard] = await Promise.all([
        learningJourneyService.getUserLearningProfile(),
        learningJourneyService.getDailyLearningCard()
      ]);

      setProfile(userProfile);
      setDailyCard(todayCard);
    } catch (error) {
      console.error('Failed to load learning data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardComplete = async (card) => {
    // Update profile after card completion
    const updatedProfile = await learningJourneyService.getUserLearningProfile();
    setProfile(updatedProfile);

    // Show celebration for achievements
    if (updatedProfile.achievements.length > profile.achievements.length) {
      // New achievement unlocked!
      const newAchievement = updatedProfile.achievements[updatedProfile.achievements.length - 1];
      showAchievementToast(newAchievement);
    }
  };

  const showAchievementToast = (achievement) => {
    // Create a temporary achievement notification
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="toast-icon">🎉</div>
      <div class="toast-content">
        <div class="toast-title">Achievement Unlocked!</div>
        <div class="toast-text">${achievement.title}</div>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 4000);
  };

  const handleLevelClick = (level) => {
    // Show level details modal or navigate to level info
    console.log('Show level details:', level);
  };

  const getMotivationalMessage = () => {
    if (!profile) return '';

    const { currentLevel, streakDays, knowledgePoints } = profile;

    if (streakDays >= 7) {
      return t('learning.motivation.streak', { days: streakDays });
    }

    if (knowledgePoints >= 50) {
      return t('learning.motivation.knowledgeExpert');
    }

    if (currentLevel === 'expert') {
      return t('learning.motivation.expertLevel');
    }

    return t('learning.motivation.keepLearning');
  };

  if (isLoading) {
    return (
      <div className="learning-screen loading">
        <div className="loading-spinner large"></div>
        <p>{t('learning.loading')}</p>
      </div>
    );
  }

  return (
    <div className="learning-screen">
      <div className="learning-header">
        <div className="header-content">
          <h1>{t('learning.title')}</h1>
          <p className="motivational-message">{getMotivationalMessage()}</p>
        </div>
        <button
          className="close-button"
          onClick={() => navigate(-1)}
          aria-label={t('common.close')}
        >
          ✕
        </button>
      </div>

      <div className="learning-tabs">
        <button
          className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          <span className="tab-icon">📅</span>
          {t('learning.tabs.today')}
        </button>
        <button
          className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <span className="tab-icon">📊</span>
          {t('learning.tabs.progress')}
        </button>
        <button
          className={`tab-button ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <span className="tab-icon">📚</span>
          {t('learning.tabs.library')}
        </button>
      </div>

      <div className="learning-content">
        {activeTab === 'today' && (
          <div className="today-tab">
            {dailyCard && (
              <div className="daily-learning-section">
                <div className="section-header">
                  <h2>{t('learning.dailyCard.title')}</h2>
                  <p>{t('learning.dailyCard.subtitle')}</p>
                </div>
                <LearningCard
                  card={dailyCard}
                  onComplete={handleCardComplete}
                />
              </div>
            )}

            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <div className="stat-number">{profile.streakDays}</div>
                  <div className="stat-label">{t('learning.stats.dayStreak')}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🧠</div>
                <div className="stat-content">
                  <div className="stat-number">{profile.knowledgePoints}</div>
                  <div className="stat-label">{t('learning.stats.points')}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📱</div>
                <div className="stat-content">
                  <div className="stat-number">{profile.totalScans}</div>
                  <div className="stat-label">{t('learning.stats.scans')}</div>
                </div>
              </div>
            </div>

            <div className="learning-tips-section">
              <h3>{t('learning.tips.title')}</h3>
              <div className="tips-grid">
                <div className="tip-item">
                  <div className="tip-icon">🎯</div>
                  <div className="tip-content">
                    <h4>{t('learning.tips.scanDaily.title')}</h4>
                    <p>{t('learning.tips.scanDaily.description')}</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">📖</div>
                  <div className="tip-content">
                    <h4>{t('learning.tips.readCards.title')}</h4>
                    <p>{t('learning.tips.readCards.description')}</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">🔍</div>
                  <div className="tip-content">
                    <h4>{t('learning.tips.research.title')}</h4>
                    <p>{t('learning.tips.research.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="progress-tab">
            <LearningProgress
              profile={profile}
              onLevelClick={handleLevelClick}
            />
          </div>
        )}

        {activeTab === 'library' && (
          <div className="library-tab">
            <div className="library-header">
              <h2>{t('learning.library.title')}</h2>
              <p>{t('learning.library.subtitle')}</p>
            </div>

            <div className="library-categories">
              <div className="category-card">
                <div className="category-icon">🧪</div>
                <div className="category-content">
                  <h3>{t('learning.library.categories.ingredients.title')}</h3>
                  <p>{t('learning.library.categories.ingredients.description')}</p>
                  <div className="category-count">
                    {profile.completedTopics.filter(topic => topic.includes('ingredient')).length} {t('learning.library.completed')}
                  </div>
                </div>
              </div>

              <div className="category-card">
                <div className="category-icon">⚗️</div>
                <div className="category-content">
                  <h3>{t('learning.library.categories.safety.title')}</h3>
                  <p>{t('learning.library.categories.safety.description')}</p>
                  <div className="category-count">
                    {profile.completedTopics.filter(topic => topic.includes('safety')).length} {t('learning.library.completed')}
                  </div>
                </div>
              </div>

              <div className="category-card">
                <div className="category-icon">🔬</div>
                <div className="category-content">
                  <h3>{t('learning.library.categories.research.title')}</h3>
                  <p>{t('learning.library.categories.research.description')}</p>
                  <div className="category-count">
                    {profile.completedTopics.filter(topic => topic.includes('research')).length} {t('learning.library.completed')}
                  </div>
                </div>
              </div>
            </div>

            <div className="coming-soon">
              <div className="coming-soon-icon">🚧</div>
              <h3>{t('learning.library.comingSoon.title')}</h3>
              <p>{t('learning.library.comingSoon.description')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningScreen;