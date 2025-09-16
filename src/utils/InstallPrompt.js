import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './InstallPrompt.css';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt fired');
      e.preventDefault();
      setDeferredPrompt(e);

      // Show install prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);

      // Track installation
      if (window.gtag) {
        window.gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'PWA Installation'
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User response to install prompt:', outcome);

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
      // Don't show again for a while
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <div className="prompt-icon">📱</div>
        <div className="prompt-content">
          <h3>{t('install.title')}</h3>
          <p>{t('install.description')}</p>
          <div className="prompt-features">
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>{t('install.features.offline')}</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📷</span>
              <span>{t('install.features.camera')}</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔔</span>
              <span>{t('install.features.notifications')}</span>
            </div>
          </div>
        </div>
        <div className="prompt-actions">
          <button className="dismiss-button" onClick={handleDismiss}>
            {t('install.dismiss')}
          </button>
          <button className="install-button" onClick={handleInstallClick}>
            {t('install.install')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook to manually trigger install prompt
export const useInstallPrompt = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setCanInstall(false);

    return outcome === 'accepted';
  };

  return { canInstall, promptInstall };
};