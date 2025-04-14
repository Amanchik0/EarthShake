// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './features/main/components/Header';
import Footer from './features/main/components/Footer';

import HomePage from './pages/HomePage';
import GuidelinesPage from './pages/GuidelinesPage';
import LatestEventsPage from './pages/NewsPage';
import NewsDescriptionPage from './pages/NewsDescriptionPage';
import EmergencyDescriptionPage from './pages/EmergencyDescriptionPage';
import KazakhstanMap from './pages/EmergencyMapPage';
import ProfilePage from './pages/ProflePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ backgroundColor: '#fff9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/news" element={<LatestEventsPage />} />
            <Route path="/news/:id" element={<NewsDescriptionPage />} />
            <Route path="/emergency-map" element={<KazakhstanMap />} />
            <Route path="/emergency/:id" element={<EmergencyDescriptionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
