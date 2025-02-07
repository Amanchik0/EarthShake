import React from 'react';
import { Container, Typography } from '@mui/material';

const AboutPage: React.FC = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        О нас
      </Typography>
      <Typography variant="body1">
        Здесь будет информация о вашем проекте.
      </Typography>
    </Container>
  );
};

export default AboutPage;
