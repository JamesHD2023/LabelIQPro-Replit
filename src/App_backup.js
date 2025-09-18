import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import AppShell from './components/AppShell';
import LoadingScreen from './components/LoadingScreen';

// Screens
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import InsightsScreen from './screens/InsightsScreen';
import LearningScreen from './screens/LearningScreen';
import HealthDashboard from './screens/HealthDashboard';
import ExpertConsultationScreen from './screens/ExpertConsultationScreen';

// Services
import { initializeApp } from './services/AppInitializer';
import { offlineService } from './services/OfflineService';

// Utils
import { InstallPrompt } from './utils/InstallPrompt';

// Styles
import './styles/App.css';

function App() {
  const [isInitialized] = useState(true); // Force immediate initialization
  const [initError, setInitError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    initApp();
    setupOnlineHandlers();
    return cleanup;
  }, []);

  const initApp = async () => {
    // Skip all initialization completely for stability
    console.log('Initialization skipped for debugging');
  };

  const setupOnlineHandlers = () => {
    const handleOnline = () => {
      setIsOnline(true);
      offlineService.syncWhenOnline();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  const cleanup = () => {
    // Cleanup function
  };

  // Force app to show immediately - bypass loading screen
  // if (!isInitialized) {
  //   return <LoadingScreen />;
  // }

  return (
    <Router>
      <div className="app">
        <AppShell isOnline={isOnline}>
          {initError && (
            <div className="init-error">
              <div className="error-message">
                Initialization Error: {initError}
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/camera" element={<CameraScreen />} />
            <Route path="/expert" element={<ExpertConsultationScreen />} />
            <Route path="/learning" element={<LearningScreen />} />
            <Route path="/results/:scanId" element={<ResultsScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/dashboard" element={<HealthDashboard />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/insights" element={<InsightsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>

        <InstallPrompt />
      </div>
    </Router>
  );
}

export default App;