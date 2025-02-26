// src/App.tsx
import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

// Пример импорта страниц/компонентов
import HomePage from './pages/HomePage';
import LoginPage from './features/auth/pages/LoginPage';
import RegistrationPage from './features/auth/pages/RegistrationPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import { AuthProvider } from './features/auth/authContext';
import EventsMap from './features/events/components/EventsMap';
import EventCRUD from './features/events/components/EventCRUD';
import AddEvent from './features/home/components/AddEvent';
import EventsPage from './pages/EventPage';
import NewsPage from './features/news/pages/NewsPage';
import MainPage from './features/home/pages/MainPage';

const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">
              Главная
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              Профиль
            </Button>
            <Button color="inherit" component={Link} to="/events">
              Катаклизмы
            </Button>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/main" element={<MainPage/>} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events" element={<EventsMap />} />
          <Route path="/events/crud" element={<EventCRUD />} />
          <Route path="/organ/crud" element={<AddEvent />} />
          <Route path="/events/det" element={<NewsPage />} />
        </Routes>
      </Router>
      
    </AuthProvider>
  );
};

export default App;
