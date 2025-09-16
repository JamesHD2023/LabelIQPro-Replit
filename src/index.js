import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { register as registerSW } from './utils/serviceWorkerRegistration';
import reportWebVitals from './utils/reportWebVitals';

// Initialize i18n
import './utils/i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA functionality
registerSW();

// Web vitals reporting
reportWebVitals(console.log);