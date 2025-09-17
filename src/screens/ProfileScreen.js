import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { offlineService } from '../services/OfflineService';
import { dailyCalorieTracker } from '../services/DailyCalorieTracker';
import { supportedLanguages } from '../utils/i18n';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
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
        language: i18n.language || 'en',
        notifications: true
      };

      const finalProfile = userProfile || defaultProfile;
      setProfile(finalProfile);

      // Set language if it differs from current
      if (finalProfile.language && finalProfile.language !== i18n.language) {
        await i18n.changeLanguage(finalProfile.language);
      }
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

  const changeLanguage = async (languageCode) => {
    try {
      // Change language in i18n
      await i18n.changeLanguage(languageCode);

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
    if (window.confirm(t('profile.clearData.confirm'))) {
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
        <p>{t('profile.loading')}</p>
      </div>
    );
  }

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <h1>{t('profile.title')}</h1>
      </div>

      <div className="profile-content">
        {/* Personal Information */}
        <section className="profile-section">
          <h2>{t('profile.personalInfo.title')}</h2>

          <div className="setting-group">
            <label className="setting-label">
              {t('profile.language')}
            </label>
            <select
              value={profile.language || 'en'}
              onChange={(e) => changeLanguage(e.target.value)}
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
                {t('profile.personalInfo.notifications')}
              </span>
            </label>
          </div>
        </section>

        {/* Biometric Information for Calorie Tracking */}
        <section className="profile-section">
          <h2>Biometric Information</h2>
          <p className="section-description">
            Required for accurate daily calorie calculations and personalized recommendations.
          </p>

          <div className="setting-group">
            <label className="setting-label">Units</label>
            <select
              value={profile.units || 'metric'}
              onChange={(e) => saveProfile({ ...profile, units: e.target.value })}
              className="setting-select"
            >
              <option value="metric">Metric (kg, cm)</option>
              <option value="imperial">Imperial (lbs, inches)</option>
            </select>
          </div>

          <div className="biometric-row">
            <div className="setting-group">
              <label className="setting-label">Age</label>
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
              <label className="setting-label">Gender</label>
              <select
                value={profile.gender || ''}
                onChange={(e) => saveProfile({ ...profile, gender: e.target.value })}
                className="setting-select"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="biometric-row">
            <div className="setting-group">
              <label className="setting-label">
                Weight ({profile.units === 'metric' ? 'kg' : 'lbs'})
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
                Height ({profile.units === 'metric' ? 'cm' : 'inches'})
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
            <label className="setting-label">Activity Level</label>
            <select
              value={profile.activityLevel || 'moderate'}
              onChange={(e) => saveProfile({ ...profile, activityLevel: e.target.value })}
              className="setting-select"
            >
              <option value="sedentary">Sedentary (Little/no exercise)</option>
              <option value="light">Light (Light exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (Moderate exercise 3-5 days/week)</option>
              <option value="active">Active (Heavy exercise 6-7 days/week)</option>
              <option value="very_active">Very Active (Very heavy exercise, physical job)</option>
            </select>
          </div>

          <div className="setting-group">
            <label className="setting-label">Health Goal</label>
            <select
              value={profile.goal || 'maintain'}
              onChange={(e) => saveProfile({ ...profile, goal: e.target.value })}
              className="setting-select"
            >
              <option value="lose_weight">Lose Weight (500 cal deficit)</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain_weight">Gain Weight (500 cal surplus)</option>
            </select>
          </div>

          {profile.age && profile.weight && profile.height && profile.gender && (
            <CalorieEstimatePreview profile={profile} />
          )}
        </section>

        {/* Allergies & Sensitivities */}
        <section className="profile-section">
          <h2>{t('profile.allergies.title')}</h2>
          <p className="section-description">
            {t('profile.allergies.description')}
          </p>

          <div className="tag-list">
            {profile.allergies?.map((allergy, index) => (
              <div key={index} className="tag">
                <span>{allergy.name}</span>
                <button
                  onClick={() => removeAllergy(index)}
                  className="tag-remove"
                  aria-label={t('profile.allergies.remove')}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="quick-allergies">
            <h3>{t('profile.allergies.common')}</h3>
            <div className="allergy-buttons">
              {['Nuts', 'Dairy', 'Eggs', 'Gluten', 'Soy', 'Shellfish'].map((allergen) => (
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
          <h2>{t('profile.privacy.title')}</h2>

          {storageInfo && (
            <div className="storage-info">
              <h3>{t('profile.privacy.storage')}</h3>
              <div className="storage-details">
                <div className="storage-item">
                  <span>{t('profile.privacy.used')}</span>
                  <span>{formatBytes(storageInfo.usage)}</span>
                </div>
                <div className="storage-item">
                  <span>{t('profile.privacy.quota')}</span>
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
            {t('profile.privacy.clearAllData')}
          </button>
          <p className="warning-text">
            {t('profile.privacy.clearWarning')}
          </p>
        </section>

        {/* App Info */}
        <section className="profile-section">
          <h2>{t('profile.about.title')}</h2>
          <div className="app-info">
            <div className="info-item">
              <span>{t('profile.about.version')}</span>
              <span>1.0.0</span>
            </div>
            <div className="info-item">
              <span>{t('profile.about.built')}</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </section>
      </div>

      {isSaving && (
        <div className="saving-indicator">
          <div className="loading-spinner"></div>
          <span>{t('profile.saving')}</span>
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
const CalorieEstimatePreview = ({ profile }) => {
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
      <h3>Estimated Daily Calorie Need</h3>
      <div className="calorie-breakdown">
        <div className="calorie-item">
          <span className="calorie-label">BMR (Base Metabolic Rate):</span>
          <span className="calorie-value">{calorieEstimate.bmr} calories</span>
        </div>
        <div className="calorie-item">
          <span className="calorie-label">TDEE (Total Daily Energy):</span>
          <span className="calorie-value">{calorieEstimate.tdee} calories</span>
        </div>
        <div className="calorie-item main">
          <span className="calorie-label">Daily Target ({profile.goal.replace('_', ' ')}):</span>
          <span className="calorie-value main">{calorieEstimate.dailyNeed} calories</span>
        </div>
      </div>

      {profile.goal !== 'maintain' && (
        <div className="goal-note">
          <span className="goal-icon">
            {profile.goal === 'lose_weight' ? '📉' : '📈'}
          </span>
          <span>
            {profile.goal === 'lose_weight'
              ? '500 calorie deficit for 1 lb/week weight loss'
              : '500 calorie surplus for 1 lb/week weight gain'
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;