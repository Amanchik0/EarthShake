/*
я это вообще с чат гпт взял можно полностью снести или хз че делать так как тут все криво но пусть стоит потом переделаем 
потом можно передлеать в норм круд для событий с админом и тд тп

*/

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid
} from '@mui/material';
import { Event } from '../types/Event';
// Импортируем данные из JSON
import eventsData from '../../../data/events.json';

const EventCRUD: React.FC = () => {
  // Инициализируем события из JSON
  const [events, setEvents] = useState<Event[]>(eventsData.events);

  // Состояние для формы (используем Partial для удобства)
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    category: '',
    date: '',
    description: '',
    coordinates: { lat: 0, lng: 0 },
    magnitude: undefined,
    radius: undefined
  });
  // Если editingId != null, значит редактируем событие с этим id
  const [editingId, setEditingId] = useState<string | null>(null);

  // Обработчик изменения поля формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          lat: name === 'lat' ? parseFloat(value) : (prev.coordinates?.lat ?? 0),
          lng: name === 'lng' ? parseFloat(value) : (prev.coordinates?.lng ?? 0)
        }
      }));
    } else if (name === 'magnitude' || name === 'radius') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Обработка отправки формы (добавление или обновление)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Обновление события
      setEvents(prev =>
        prev.map(event =>
          event.id === editingId ? { ...event, ...formData, id: editingId } as Event : event
        )
      );
      setEditingId(null);
    } else {
      // Создание нового события
      const newEvent: Event = {
        id: Date.now().toString(),
        title: formData.title || '',
        category: formData.category || '',
        date: formData.date || '',
        description: formData.description || '',
        coordinates: formData.coordinates || { lat: 0, lng: 0 },
        magnitude: formData.magnitude,
        radius: formData.radius
      };
      setEvents(prev => [...prev, newEvent]);
    }
    // Сброс формы
    setFormData({
      title: '',
      category: '',
      date: '',
      description: '',
      coordinates: { lat: 0, lng: 0 },
      magnitude: undefined,
      radius: undefined
    });
  };

  // Обработка редактирования события: заполнение формы данными события
  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData(event);
  };

  // Обработка удаления события
  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Events
      </Typography>
      <Paper style={{ padding: 16, marginBottom: 16 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="datetime-local"
                value={formData.date || ''}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Latitude"
                name="lat"
                type="number"
                value={formData.coordinates?.lat || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Longitude"
                name="lng"
                type="number"
                value={formData.coordinates?.lng || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label={formData.category === 'Earthquake' ? 'Magnitude' : 'Radius (m)'}
                name={formData.category === 'Earthquake' ? 'magnitude' : 'radius'}
                type="number"
                value={formData.category === 'Earthquake' ? formData.magnitude || '' : formData.radius || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                {editingId ? 'Update Event' : 'Add Event'}
              </Button>
              {editingId && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      title: '',
                      category: '',
                      date: '',
                      description: '',
                      coordinates: { lat: 0, lng: 0 },
                      magnitude: undefined,
                      radius: undefined
                    });
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper style={{ padding: 16 }}>
        <Typography variant="h5" gutterBottom>
          Events List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Coordinates</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                <TableCell>
                  {event.coordinates.lat.toFixed(4)}, {event.coordinates.lng.toFixed(4)}
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(event)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(event.id)}
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default EventCRUD;
