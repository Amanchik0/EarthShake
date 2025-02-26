import React from 'react';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { NewsItem } from '../model/news.types';

const dummyNews: NewsItem[] = [
  { id: 1, title: 'Новость 1', body: 'Содержание новости 1' },
  { id: 2, title: 'Новость 2', body: 'Содержание новости 2' },
  { id: 3, title: 'Новость 3', body: 'Содержание новости 3' },
];

const NewsPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Новости
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={2}>
        {dummyNews.map((news) => (
          <Card key={news.id}>
            <CardContent>
              <Typography variant="h6">{news.title}</Typography>
              <Typography variant="body2">{news.body}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      </Container>
  );
};

export default NewsPage;
