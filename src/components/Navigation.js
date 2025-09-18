import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: t('navigation.home', { defaultValue: 'Home' }),
      id: 'home'
    },
    {
      path: '/camera',
      icon: '📷',
      label: t('navigation.scan', { defaultValue: 'Scan' }),
      id: 'camera'
    },
    {
      path: '/expert',
      icon: '🩺',
      label: t('navigation.expert', { defaultValue: 'Expert' }),
      id: 'expert'
    },
    {
      path: '/history',
      icon: '📋',
      label: t('navigation.history', { defaultValue: 'History' }),
      id: 'history'
    },
    {
      path: '/dashboard',
      icon: '💊',
      label: t('navigation.dashboard', { defaultValue: 'Dashboard' }),
      id: 'dashboard'
    },
    {
      path: '/profile',
      icon: '👤',
      label: t('navigation.profile', { defaultValue: 'Profile' }),
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