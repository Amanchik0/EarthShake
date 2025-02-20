// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
import HomePage from './pages/HomePage'; // Главная страница (например, список объектов)
import LoginPage from './features/auth/LoginPage';
import RegistrationPage from './features/auth/RegistrationPage';
import ProfilePage from './features/auth/ProfilePage';
import { AuthProvider } from './features/auth/authContext';
import EventsMap from './features/events/EventsMap';
import EventCRUD from './features/events/EventCRUD';
import AddEvent from './features/home/components/AddEvent';

const App: React.FC = () => {
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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events" element={<EventsMap />} />
          <Route path="/events/crud" element={<EventCRUD />} />
          <Route path="/organ/crud" element={<AddEvent />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
