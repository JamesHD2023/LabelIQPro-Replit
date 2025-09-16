import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import StatusBar from './StatusBar';
import './AppShell.css';

const AppShell = ({ children, isOnline }) => {
  const location = useLocation();
  const isFullscreen = location.pathname === '/camera';

  return (
    <div className={`app-shell ${isFullscreen ? 'fullscreen' : ''}`}>
      <StatusBar isOnline={isOnline} />

      <main className="app-content">
        {children}
      </main>

      {!isFullscreen && <Navigation />}
    </div>
  );
};

export default AppShell;