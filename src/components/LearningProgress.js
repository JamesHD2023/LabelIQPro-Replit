import React from 'react';
import { useTranslation } from 'react-i18next';
import './LearningProgress.css';

const LearningProgress = ({ profile, onLevelClick }) => {
  const { t } = useTranslation();

  const levels = [
    {
      id: 'beginner',
      title: t('learning.levels.beginner.title'),
      description: t('learning.levels.beginner.description'),
      icon: '🌱',
      color: '#10b981',
      requiredScans: 0,
      requiredKnowledge: 0
    },
    {
      id: 'intermediate',
      title: t('learning.levels.intermediate.title'),
      description: t('learning.levels.intermediate.description'),
      icon: '🧪',
      color: '#3b82f6',
      requiredScans: 25,
      requiredKnowledge: 15
    },
    {
      id: 'expert',
      title: t('learning.levels.expert.title'),
      description: t('learning.levels.expert.description'),
      icon: '🔬',
      color: '#8b5cf6',
      requiredScans: 100,
      requiredKnowledge: 50
    }
  ];

  const currentLevel = levels.find(level => level.id === profile.currentLevel);
  const nextLevel = levels.find(level =>
    level.requiredScans > profile.totalScans || level.requiredKnowledge > profile.knowledgePoints
  );

  const getProgressToNextLevel = () => {
    if (!nextLevel) return { scans: 100, knowledge: 100 };

    const scanProgress = Math.min(100, (profile.totalScans / nextLevel.requiredScans) * 100);
    const knowledgeProgress = Math.min(100, (profile.knowledgePoints / nextLevel.requiredKnowledge) * 100);

    return { scans: scanProgress, knowledge: knowledgeProgress };
  };

  const progress = getProgressToNextLevel();

  return (
    <div className="learning-progress">
      <div className="current-level-card">
        <div className="level-header">
          <div
            className="level-icon"
            style={{ backgroundColor: currentLevel?.color }}
          >
            {currentLevel?.icon}
          </div>
          <div className="level-info">
            <h3 className="level-title">{currentLevel?.title}</h3>
            <p className="level-description">{currentLevel?.description}</p>
          </div>
        </div>

        <div className="progress-stats">
          <div className="stat-item">
            <div className="stat-number">{profile.totalScans}</div>
            <div className="stat-label">{t('learning.progress.scansCompleted')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{profile.knowledgePoints}</div>
            <div className="stat-label">{t('learning.progress.knowledgePoints')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{profile.streakDays}</div>
            <div className="stat-label">{t('learning.progress.dayStreak')}</div>
          </div>
        </div>
      </div>

      {nextLevel && (
        <div className="next-level-progress">
          <div className="progress-header">
            <h4>{t('learning.progress.nextLevel', { level: nextLevel.title })}</h4>
            <button
              className="level-details-button"
              onClick={() => onLevelClick && onLevelClick(nextLevel)}
            >
              {t('learning.progress.viewDetails')}
            </button>
          </div>

          <div className="progress-bars">
            <div className="progress-item">
              <div className="progress-label">
                <span>{t('learning.progress.scansNeeded')}</span>
                <span className="progress-fraction">
                  {profile.totalScans}/{nextLevel.requiredScans}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill scans"
                  style={{ width: `${progress.scans}%` }}
                ></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>{t('learning.progress.knowledgeNeeded')}</span>
                <span className="progress-fraction">
                  {profile.knowledgePoints}/{nextLevel.requiredKnowledge}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill knowledge"
                  style={{ width: `${progress.knowledge}%` }}
                ></div>
              </div>
            </div>
          </div>

          {progress.scans >= 100 && progress.knowledge >= 100 && (
            <div className="level-up-ready">
              <div className="celebration-icon">🎉</div>
              <div className="celebration-text">
                <h4>{t('learning.progress.readyToAdvance')}</h4>
                <p>{t('learning.progress.congratulations')}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!nextLevel && (
        <div className="max-level-achieved">
          <div className="achievement-icon">👑</div>
          <div className="achievement-content">
            <h4>{t('learning.progress.expertAchieved')}</h4>
            <p>{t('learning.progress.expertDescription')}</p>
          </div>
        </div>
      )}

      {profile.achievements && profile.achievements.length > 0 && (
        <div className="recent-achievements">
          <h4>{t('learning.progress.recentAchievements')}</h4>
          <div className="achievements-list">
            {profile.achievements.slice(-3).map((achievement, index) => (
              <div key={index} className="achievement-item">
                <div className="achievement-icon">
                  {achievement.type === 'level_up' && '🚀'}
                  {achievement.type === 'streak' && '🔥'}
                  {achievement.type === 'knowledge' && '🧠'}
                  {achievement.type === 'scan_milestone' && '📊'}
                </div>
                <div className="achievement-info">
                  <div className="achievement-title">{achievement.title}</div>
                  <div className="achievement-date">
                    {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningProgress;