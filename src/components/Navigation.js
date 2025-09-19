import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguage();

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: t('navigation.home', currentLanguage),
      id: 'home'
    },
    {
      path: '/camera',
      icon: '📷',
      label: t('navigation.scan', currentLanguage),
      id: 'camera'
    },
    {
      path: '/expert',
      icon: '🩺',
      label: t('navigation.expert', currentLanguage),
      id: 'expert'
    },
    {
      path: '/history',
      icon: '📋',
      label: t('navigation.history', currentLanguage),
      id: 'history'
    },
    {
      path: '/dashboard',
      icon: '💊',
      label: t('navigation.dashboard', currentLanguage),
      id: 'dashboard'
    },
    {
      path: '/profile',
      icon: '👤',
      label: t('navigation.profile', currentLanguage),
      id: 'profile'
    }
  ];

  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;