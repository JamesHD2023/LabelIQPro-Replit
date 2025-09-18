import React, { useState, useEffect } from 'react';
import { offlineService } from '../services/OfflineService';
import { dailyCalorieTracker } from '../services/DailyCalorieTracker';
import { supportedLanguages, t } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    loadProfile();
    loadStorageInfo();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await offlineService.getUserProfile();
      const defaultProfile = {
        // Personal/Biometric Data
        age: '',
        weight: '',
        height: '',
        gender: '',
        activityLevel: 'moderate',
        goal: 'maintain',
        units: 'metric', // metric or imperial

        // Health Preferences
        allergies: [],
        sensitivities: [],
        dietaryPreferences: [],

        // App Settings
        language: 'en',
        notifications: true
      };

      const finalProfile = userProfile || defaultProfile;
      setProfile(finalProfile);

      // Language switching disabled for stability
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const estimate = await offlineService.getStorageEstimate();
      if (estimate) {
        setStorageInfo(estimate);
      }
    } catch (error) {
      console.error('Failed to get storage info:', error);
    }
  };

  const saveProfile = async (updatedProfile) => {
    try {
      setIsSaving(true);
      await offlineService.saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addAllergy = (allergy) => {
    const updatedProfile = {
      ...profile,
      allergies: [...(profile.allergies || []), allergy]
    };
    saveProfile(updatedProfile);
  };

  const removeAllergy = (index) => {
    const updatedProfile = {
      ...profile,
      allergies: profile.allergies.filter((_, i) => i !== index)
    };
    saveProfile(updatedProfile);
  };

  const handleLanguageChange = async (languageCode) => {
    try {
      // Update language in context
      changeLanguage(languageCode);

      // Save to profile
      const updatedProfile = {
        ...profile,
        language: languageCode
      };
      saveProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const toggleNotifications = async () => {
    const updatedProfile = {
      ...profile,
      notifications: !profile.notifications
    };
    saveProfile(updatedProfile);

    // Request notification permission if enabling
    if (!profile.notifications && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
    }
  };

  const clearAllData = async () => {
    if (window.confirm(t('profile.clearDataConfirm', currentLanguage))) {
      try {
        await offlineService.clearStorage();
        window.location.reload();
      } catch (error) {
        console.error('Failed to clear data:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="profile-screen loading">
        <div className="loading-spinner large"></div>
        <p>{t('profile.loadingProfile', currentLanguage)}</p>
      </div>
    );
  }

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <h1>{t('profile.title', currentLanguage)}</h1>
      </div>

      <div className="profile-content">
        {/* Personal Information */}
        <section className="profile-section">
          <h2>{t('profile.personalInfo', currentLanguage)}</h2>

          <div className="setting-group">
            <label className="setting-label">
{t('profile.language', currentLanguage)}
            </label>
            <select
              value={profile.language || currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="setting-select"
            >
              {Object.entries(supportedLanguages).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={profile.notifications || false}
                onChange={toggleNotifications}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
{t('profile.pushNotifications', currentLanguage)}
              </span>
            </label>
          </div>
        </section>

        {/* Biometric Information for Calorie Tracking */}
        <section className="profile-section">
          <h2>{t('profile.biometricInfo', currentLanguage)}</h2>
          <p className="section-description">
            {t('profile.biometricDescription', currentLanguage)}
          </p>

          <div className="setting-group">
            <label className="setting-label">{t('profile.units', currentLanguage)}</label>
            <select
              value={profile.units || 'metric'}
              onChange={(e) => saveProfile({ ...profile, units: e.target.value })}
              className="setting-select"
            >
              <option value="metric">{t('profile.metric', currentLanguage)}</option>
              <option value="imperial">{t('profile.imperial', currentLanguage)}</option>
            </select>
          </div>

          <div className="biometric-row">
            <div className="setting-group">
              <label className="setting-label">{t('profile.age', currentLanguage)}</label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => saveProfile({ ...profile, age: e.target.value })}
                className="setting-input"
                placeholder="25"
                min="13"
                max="120"
              />
            </div>

            <div className="setting-group">
              <label className="setting-label">{t('profile.gender', currentLanguage)}</label>
              <select
                value={profile.gender || ''}
                onChange={(e) => saveProfile({ ...profile, gender: e.target.value })}
                className="setting-select"
              >
                <option value="">{t('profile.selectGender', currentLanguage)}</option>
                <option value="male">{t('profile.male', currentLanguage)}</option>
                <option value="female">{t('profile.female', currentLanguage)}</option>
              </select>
            </div>
          </div>

          <div className="biometric-row">
            <div className="setting-group">
              <label className="setting-label">
{t('profile.weight', currentLanguage)} ({profile.units === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={profile.weight || ''}
                onChange={(e) => saveProfile({ ...profile, weight: e.target.value })}
                className="setting-input"
                placeholder={profile.units === 'metric' ? '70' : '154'}
                min="30"
                max={profile.units === 'metric' ? '300' : '660'}
                step="0.1"
              />
            </div>

            <div className="setting-group">
              <label className="setting-label">
{t('profile.height', currentLanguage)} ({profile.units === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={profile.height || ''}
                onChange={(e) => saveProfile({ ...profile, height: e.target.value })}
                className="setting-input"
                placeholder={profile.units === 'metric' ? '175' : '69'}
                min={profile.units === 'metric' ? '100' : '40'}
                max={profile.units === 'metric' ? '250' : '98'}
              />
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">{t('profile.activityLevel', currentLanguage)}</label>
            <select
              value={profile.activityLevel || 'moderate'}
              onChange={(e) => saveProfile({ ...profile, activityLevel: e.target.value })}
              className="setting-select"
            >
              <option value="sedentary">{t('profile.sedentary', currentLanguage)}</option>
              <option value="light">{t('profile.light', currentLanguage)}</option>
              <option value="moderate">{t('profile.moderate', currentLanguage)}</option>
              <option value="active">{t('profile.active', currentLanguage)}</option>
              <option value="very_active">{t('profile.veryActive', currentLanguage)}</option>
            </select>
          </div>

          <div className="setting-group">
            <label className="setting-label">{t('profile.healthGoal', currentLanguage)}</label>
            <select
              value={profile.goal || 'maintain'}
              onChange={(e) => saveProfile({ ...profile, goal: e.target.value })}
              className="setting-select"
            >
              <option value="lose_weight">{t('profile.loseWeight', currentLanguage)}</option>
              <option value="maintain">{t('profile.maintainWeight', currentLanguage)}</option>
              <option value="gain_weight">{t('profile.gainWeight', currentLanguage)}</option>
            </select>
          </div>

          {profile.age && profile.weight && profile.height && profile.gender && (
            <CalorieEstimatePreview profile={profile} currentLanguage={currentLanguage} />
          )}
        </section>

        {/* Allergies & Sensitivities */}
        <section className="profile-section">
          <h2>{t('profile.allergiesTitle', currentLanguage)}</h2>
          <p className="section-description">
            {t('profile.allergiesDescription', currentLanguage)}
          </p>

          <div className="tag-list">
            {profile.allergies?.map((allergy, index) => (
              <div key={index} className="tag">
                <span>{allergy.name}</span>
                <button
                  onClick={() => removeAllergy(index)}
                  className="tag-remove"
                  aria-label={t('profile.removeAllergy', currentLanguage)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="quick-allergies">
            <h3>{t('profile.commonAllergies', currentLanguage)}</h3>
            <div className="allergy-buttons">
              {[
                t('profile.nuts', currentLanguage), 
                t('profile.dairy', currentLanguage), 
                t('profile.eggs', currentLanguage), 
                t('profile.gluten', currentLanguage), 
                t('profile.soy', currentLanguage), 
                t('profile.shellfish', currentLanguage),
                t('profile.nickel', currentLanguage),
                t('profile.fragrances', currentLanguage),
                t('profile.latex', currentLanguage),
                t('profile.preservatives', currentLanguage),
                t('profile.lanolin', currentLanguage),
                t('profile.cosmetics', currentLanguage)
              ].map((allergen, index) => (
                <button
                  key={allergen}
                  className="allergy-button"
                  onClick={() => addAllergy({ name: allergen, severity: 'high' })}
                  disabled={profile.allergies?.some(a => a.name === allergen)}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy & Data */}
        <section className="profile-section">
          <h2>{t('profile.privacyTitle', currentLanguage)}</h2>

          {storageInfo && (
            <div className="storage-info">
              <h3>{t('profile.storageUsage', currentLanguage)}</h3>
              <div className="storage-details">
                <div className="storage-item">
                  <span>{t('profile.used', currentLanguage)}</span>
                  <span>{formatBytes(storageInfo.usage)}</span>
                </div>
                <div className="storage-item">
                  <span>{t('profile.available', currentLanguage)}</span>
                  <span>{formatBytes(storageInfo.quota)}</span>
                </div>
              </div>
              <div className="storage-bar">
                <div
                  className="storage-used"
                  style={{
                    width: `${(storageInfo.usage / storageInfo.quota) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          )}

          <button
            className="danger-button"
            onClick={clearAllData}
          >
{t('profile.clearAllData', currentLanguage)}
          </button>
          <p className="warning-text">
{t('profile.clearDataWarning', currentLanguage)}
          </p>
        </section>

        {/* App Info */}
        <section className="profile-section">
          <h2>{t('profile.aboutTitle', currentLanguage)}</h2>
          <div className="app-info">
            <div className="info-item">
              <span>{t('profile.version', currentLanguage)}</span>
              <span>1.0.0</span>
            </div>
            <div className="info-item">
              <span>{t('profile.builtWith', currentLanguage)}</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </section>
      </div>

      {isSaving && (
        <div className="saving-indicator">
          <div className="loading-spinner"></div>
          <span>{t('profile.saving', currentLanguage)}</span>
        </div>
      )}
    </div>
  );
};

// Helper function to format bytes
function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Calorie Estimate Preview Component  
const CalorieEstimatePreview = ({ profile, currentLanguage }) => {
  const [calorieEstimate, setCalorieEstimate] = useState(null);

  useEffect(() => {
    const calculateEstimate = async () => {
      try {
        // Convert imperial to metric if needed
        let weight = parseFloat(profile.weight);
        let height = parseFloat(profile.height);

        if (profile.units === 'imperial') {
          weight = weight * 0.453592; // lbs to kg
          height = height * 2.54; // inches to cm
        }

        // BMR calculation using Mifflin-St Jeor equation
        const age = parseInt(profile.age);
        const gender = profile.gender;

        let bmr;
        if (gender === 'male') {
          bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
          bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        // Activity multipliers
        const activityMultipliers = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          very_active: 1.9
        };

        const tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.55);

        // Goal adjustments
        const goalAdjustments = {
          lose_weight: -500,
          maintain: 0,
          gain_weight: 500
        };

        const dailyNeed = tdee + (goalAdjustments[profile.goal] || 0);

        setCalorieEstimate({
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
          dailyNeed: Math.round(dailyNeed),
          goal: profile.goal
        });

      } catch (error) {
        console.error('Failed to calculate calorie estimate:', error);
        setCalorieEstimate(null);
      }
    };

    if (profile.age && profile.weight && profile.height && profile.gender) {
      calculateEstimate();
    }
  }, [profile]);

  if (!calorieEstimate) return null;

  return (
    <div className="calorie-preview">
      <h3>{t('profile.estimatedDailyCalories', currentLanguage)}</h3>
      <div className="calorie-breakdown">
        <div className="calorie-item">
          <span className="calorie-label">{t('profile.bmr', currentLanguage)}:</span>
          <span className="calorie-value">{calorieEstimate.bmr} {t('profile.calories', currentLanguage)}</span>
        </div>
        <div className="calorie-item">
          <span className="calorie-label">{t('profile.tdee', currentLanguage)}:</span>
          <span className="calorie-value">{calorieEstimate.tdee} {t('profile.calories', currentLanguage)}</span>
        </div>
        <div className="calorie-item main">
          <span className="calorie-label">{t('profile.dailyTarget', currentLanguage)} ({profile.goal.replace('_', ' ')}):</span>
          <span className="calorie-value main">{calorieEstimate.dailyNeed} {t('profile.calories', currentLanguage)}</span>
        </div>
      </div>

      {profile.goal !== 'maintain' && (
        <div className="goal-note">
          <span className="goal-icon">
            {profile.goal === 'lose_weight' ? '📉' : '📈'}
          </span>
          <span>
            {profile.goal === 'lose_weight'
              ? t('profile.weightLossNote', currentLanguage)
              : t('profile.weightGainNote', currentLanguage)
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;