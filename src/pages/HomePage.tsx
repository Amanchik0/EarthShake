// src/pages/HomePage.tsx

import React, { FC } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage: FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            Compo пожаловать!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Здесь вы можете ознакомиться с последними событиями, добавить новые события
            или просмотреть новости.
          </Typography>
          <Button
            component={Link}
            to="/events"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Перейти к событиям
          </Button>
        </Box>

        <Grid container spacing={4} alignItems="center" mb={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  События
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam sint sequi culpa voluptatum consequatur odio officia necessitatibus aliquam autem provident natus optio ea, eos mollitia, labore eius voluptas dolores, nam inventore illo deleniti ipsa. Modi ipsam corrupti inventore officiis quis.
                </Typography>
                <Button
                  component={Link}
                  to="/events"
                  variant="outlined"
                  color="primary"
                >
                  Открыть
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://media.istockphoto.com/id/479607780/photo/good-news-concept-metal-letterpress-type.jpg?s=612x612&w=0&k=20&c=VFHXJBlQ_kemQzgeqR5TBsp9mLc5Kg0JE357N3Jt2As="
              alt="События"
              sx={{ width: '100%', borderRadius: 2 }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} alignItems="center" mb={4}>
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box
              component="img"
              src="https://media.istockphoto.com/id/479607780/photo/good-news-concept-metal-letterpress-type.jpg?s=612x612&w=0&k=20&c=VFHXJBlQ_kemQzgeqR5TBsp9mLc5Kg0JE357N3Jt2As="
              alt="Новости"
              sx={{ width: '100%', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Новости
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur vero doloribus impedit facere officiis assumenda mollitia corporis? Totam harum veniam deserunt voluptatem nam reprehenderit, delectus voluptate, blanditiis sequi odit temporibus nostrum eos, aut aliquid asperiores ut?
                </Typography>
                <Button
                  component={Link}
                  to="/events/det"
                  variant="outlined"
                  color="primary"
                >
                  Открыть
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Добавить событие
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae molestiae ut facilis eligendi excepturi. Minus maxime omnis sapiente repellat exercitationem, neque tempora eius earum ex incidunt odio, consequatur praesentium odit.                </Typography>
                <Button
                  component={Link}
                  to="/organ/crud"
                  variant="outlined"
                  color="primary"
                >
                  Добавить
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://media.istockphoto.com/id/479607780/photo/good-news-concept-metal-letterpress-type.jpg?s=612x612&w=0&k=20&c=VFHXJBlQ_kemQzgeqR5TBsp9mLc5Kg0JE357N3Jt2As="
              alt="Добавить событие"
              sx={{ width: '100%', borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
