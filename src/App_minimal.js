import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple Navigation Component
const SimpleNav = () => (
  <nav style={{ 
    position: 'fixed', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    background: 'white', 
    display: 'flex', 
    justifyContent: 'space-around',
    padding: '10px',
    borderTop: '1px solid #ccc'
  }}>
    <button>🏠 Home</button>
    <button>📷 Scan</button>
    <button>🩺 Expert</button>
    <button>📋 History</button>
    <button>💊 Dashboard</button>
    <button>👤 Profile</button>
  </nav>
);

// Simple Page Component
const SimplePage = ({ title }) => (
  <div style={{ padding: '20px', paddingBottom: '80px' }}>
    <h1>LabelIQ.Pro</h1>
    <h2>{title}</h2>
    <p>Navigation labels should now be visible below.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<SimplePage title="Home Page" />} />
          <Route path="/camera" element={<SimplePage title="Camera Page" />} />
          <Route path="/expert" element={<SimplePage title="Expert Page" />} />
          <Route path="/history" element={<SimplePage title="History Page" />} />
          <Route path="/dashboard" element={<SimplePage title="Dashboard Page" />} />
          <Route path="/profile" element={<SimplePage title="Profile Page" />} />
        </Routes>
        <SimpleNav />
      </div>
    </Router>
  );
}

export default App;