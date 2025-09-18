import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { socialSharingService } from '../services/SocialSharingService';
import './SocialShareButton.css';

const SocialShareButton = ({ scanResult, className = '', size = 'medium' }) => {
  const { t, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState('public');
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState(null);

  const platforms = socialSharingService.getAvailablePlatforms();
  const privacyLevels = socialSharingService.privacyLevels;

  const handleShare = async (platform) => {
    setIsSharing(true);
    setShareResult(null);

    try {
      const result = await socialSharingService.share(platform, scanResult, {
        privacyLevel,
        includeImage: true
      });

      setShareResult(result);

      // Auto-close on success
      if (result.success) {
        setTimeout(() => {
          setIsOpen(false);
          setShareResult(null);
        }, 2000);
      }
    } catch (error) {
      setShareResult({ success: false, error: error.message });
    } finally {
      setIsSharing(false);
    }
  };

  const getSharePreview = () => {
    return socialSharingService.generateShareContent(scanResult, privacyLevel);
  };

  const renderPrivacySelector = () => (
    <div className="privacy-selector">
      <h4>{t('sharing.privacyLevel', currentLanguage)}</h4>
      <div className="privacy-options">
        {Object.entries(privacyLevels).map(([level, config]) => (
          <label key={level} className="privacy-option">
            <input
              type="radio"
              name="privacy"
              value={level}
              checked={privacyLevel === level}
              onChange={(e) => setPrivacyLevel(e.target.value)}
            />
            <div className="privacy-option-content">
              <span className="privacy-name">{t(`sharing.privacy.${level}`, currentLanguage)}</span>
              <span className="privacy-description">{t(`sharing.privacy.${level}Desc`, currentLanguage)}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const renderSharePreview = () => {
    const preview = getSharePreview();

    return (
      <div className="share-preview">
        <h4>{t('sharing.sharePreview', currentLanguage)}</h4>
        <div className="preview-content">
          <div className="preview-header">
            <span className="preview-emoji">{preview.emoji}</span>
            <span className="preview-title">{preview.title}</span>
          </div>
          <p className="preview-description">{preview.description}</p>
          <div className="preview-hashtags">
            {preview.hashtags.map(tag => (
              <span key={tag} className="preview-hashtag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPlatforms = () => (
    <div className="platform-grid">
      {platforms.map(platform => (
        <button
          key={platform.id}
          className="platform-button"
          style={{ '--platform-color': platform.color }}
          onClick={() => handleShare(platform.id)}
          disabled={isSharing}
        >
          <span className="platform-icon">{platform.icon}</span>
          <span className="platform-name">{platform.name}</span>
        </button>
      ))}
    </div>
  );

  const renderShareResult = () => {
    if (!shareResult) return null;

    return (
      <div className={`share-result ${shareResult.success ? 'success' : 'error'}`}>
        {shareResult.success ? (
          <div className="result-success">
            <span className="result-icon">✅</span>
            <span>{t('sharing.success', currentLanguage)}</span>
          </div>
        ) : (
          <div className="result-error">
            <span className="result-icon">❌</span>
            <span>{t('sharing.failed', currentLanguage)}: {shareResult.error}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`social-share-button ${className}`}>
      <button
        className={`share-trigger ${size}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('sharing.button', currentLanguage)}
      >
        <span className="share-icon">📤</span>
        <span className="share-text">{t('sharing.button', currentLanguage)}</span>
      </button>

      {isOpen && (
        <div className="share-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>{t('sharing.title', currentLanguage)}</h3>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label={t('sharing.close', currentLanguage)}
              >
                ✕
              </button>
            </div>

            <div className="share-modal-content">
              {renderPrivacySelector()}
              {renderSharePreview()}

              <div className="platforms-section">
                <h4>{t('sharing.choosePlatform', currentLanguage)}</h4>
                {renderPlatforms()}
              </div>

              {renderShareResult()}

              {isSharing && (
                <div className="sharing-overlay">
                  <div className="sharing-spinner">⏳</div>
                  <span>{t('sharing.preparing', currentLanguage)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Compact version for toolbar/header use
export const CompactShareButton = ({ scanResult, onShare }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleQuickShare = async () => {
    setIsSharing(true);

    try {
      // Try native share first, fallback to clipboard
      let result;
      if (navigator.share) {
        result = await socialSharingService.share('native', scanResult);
      } else {
        result = await socialSharingService.share('clipboard', scanResult);
      }

      if (onShare) {
        onShare(result);
      }
    } catch (error) {
      console.error('Quick share failed:', error);
      if (onShare) {
        onShare({ success: false, error: error.message });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      className="compact-share-button"
      onClick={handleQuickShare}
      disabled={isSharing}
      aria-label="Share"
    >
      {isSharing ? '⏳' : '📤'}
    </button>
  );
};

export default SocialShareButton;