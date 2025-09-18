import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Home',
      id: 'home'
    },
    {
      path: '/camera',
      icon: '📷',
      label: 'Scan',
      id: 'camera'
    },
    {
      path: '/expert',
      icon: '🩺',
      label: 'Expert',
      id: 'expert'
    },
    {
      path: '/history',
      icon: '📋',
      label: 'History',
      id: 'history'
    },
    {
      path: '/dashboard',
      icon: '💊',
      label: 'Dashboard',
      id: 'dashboard'
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Profile',
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