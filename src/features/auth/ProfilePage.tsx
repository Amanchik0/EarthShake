import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useAuth } from './authContext';
import { useNavigate, Navigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Если пользователь не авторизован, перенаправляем его на страницу регистрации (или входа)
  if (!user) {
    return <Navigate to="/register" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Профиль
      </Typography>
      <Typography variant="body1" gutterBottom>
        Имя пользователя: {user.username}
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Выйти
      </Button>
    </Container>
  );
};

export default ProfilePage;
