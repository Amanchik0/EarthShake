import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, CircularProgress } from '@mui/material';

interface DataItem {
  id: number;
  name: string;
  // можно добавить дополнительные поля, например: цену и тд тп => потом передадим на бэк чет такое 
  description?: string;
  date?: string;
  location?: string;
}

const EventDetails: React.FC = () => {
  // Получаем параметр id из URL, например: /items/1 но я бы тут прям по другому сделал быЮ но и так сойдет 
  const { id } = useParams<{ id: string }>();

  // Состояние для элемента и состояния загрузки
  const [item, setItem] = useState<DataItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 
    // пото фетч добавим как апи будет 
    const initialData: DataItem[] = [
      { id: 1, name: 'Объект 1', description: 'Описание объекта 1', date: '2025-05-10', location: 'Москва' },
      { id: 2, name: 'Объект 2', description: 'Описание объекта 2', date: '2025-06-15', location: 'Санкт-Петербург' },
      { id: 3, name: 'Объект 3', description: 'Описание объекта 3', date: '2025-07-20', location: 'Казань' },
    ];


  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!item) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" color="error">
          Объект не найден
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {item.name}
        </Typography>
        {item.date && item.location && (
          <Typography variant="subtitle1" gutterBottom>
            {item.date} — {item.location}
          </Typography>
        )}
        {item.description && (
          <Typography variant="body1">
            {item.description}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default EventDetails;
