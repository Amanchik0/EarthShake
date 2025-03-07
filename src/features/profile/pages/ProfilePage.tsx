import React from 'react';
import { Container, Typography, Avatar, Box, Grid, Fab, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../auth/authContext';
import { Navigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  function stringToColor(string: string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: { bgcolor: stringToColor(name), width: 64, height: 64 },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1]?.[0] || ''}`,
    };
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <Container maxWidth="" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width:'100%' }}>
      {/* Верхняя панель с именем и кнопкой редактирования */}
      <Box sx={{ position: 'relative', bgcolor: '#2F5597', p: 2, borderRadius: 2, color: 'white', width: '100%' }}>
        <Typography variant="h6" sx={{ bgcolor: 'white', color: 'black', p: 0.5, borderRadius: 1, display: 'inline-block' }}>{'name'}
          {/* user.name */}
        </Typography>
        <Fab size="small" color="secondary" sx={{ position: 'absolute', top: 8, right: 8 }}>
          <EditIcon />
        </Fab>
      </Box>
      
      {/* Блок с аватаром и информацией */}
      <Box sx={{ mt: -3, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
        <Avatar {...stringAvatar(user.username)} sx={{ width: 56, height: 56, mr: 2 }} />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', bgcolor: 'primary.light', p: 0.5, borderRadius: 1, display: 'inline-block' }}>{user.username}</Typography>
          <Typography variant="body2" sx={{ bgcolor: 'grey.300', p: 0.5, borderRadius: 1, display: 'inline-block', ml: 1 }}>description</Typography>
        </Box>
      </Box>
      
      {/* Кнопка выхода */}
      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>
        Выйти
      </Button>
    </Container>
  );
};

export default ProfilePage;
