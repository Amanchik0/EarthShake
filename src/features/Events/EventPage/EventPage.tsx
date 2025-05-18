import React, { useEffect, useState } from 'react';
import EventHeader from '../../../components/Event/EventHeader';
import EventMain from '../../../components/Event/EventMain';
import CommentSection from '../../../components/Event/CommentSection';
import Recommendations from '../../../components/Event/Recomemdations/Recommendations';
import { Event, Comment, RecommendedEvent } from '../../../types/types';
import styles from './EventPage.module.css';
import {events} from '../EventsListPage/EventsListPage'
import { useNavigate, useParams } from 'react-router-dom';
import { EventDetails } from '../../../types/event';
// TODO кэширование данных, можеь быть lazy loading тоже для фоток , может анимации загрузки ??? , красиво данные добавить 
const EventPage: React.FC = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<EventDetails | null>(null);

 useEffect(() => { 
    const fetchData = async () => { 
      try { 
        const response = await fetch(`http://localhost:8090/api/events/${id}`);
          
        if (!response.ok) {
          throw new Error('Network response was not ok');
        } 
        const data = await response.json(); 
        
        // Формируем полный URL для изображения
        if (data.mediaUrl) {
          data.mediaUrl = `http://localhost:8090${data.mediaUrl}`;
        }
        
        setEvent(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      } 
    }
    fetchData();
  }, [id]);



  if (!event) {
    return <div>Событие не найдено</div>; 
  }

  const comments: Comment[] = [
    {
      id: '1',
      author: 'Алексей П.',
      avatarUrl: '/api/placeholder/40/40',
      date: '19 апреля 2025, 12:34',
      text: 'Отличное мероприятие! Обязательно посещу. Очень заинтересовало описание и программа.'
    },
    {
      id: '2',
      author: 'Елена С.',
      avatarUrl: '/api/placeholder/40/40',
      date: '18 апреля 2025, 23:15',
      text: 'А будет ли возможность задать вопросы организаторам непосредственно на мероприятии?'
    },
    {
      id: '3',
      author: 'Дмитрий К.',
      avatarUrl: '/api/placeholder/40/40',
      date: '17 апреля 2025, 16:20',
      text: 'Был на похожем мероприятии в прошлом месяце, очень понравилось. Рекомендую!'
    }
  ];

  const recommendedEvents: RecommendedEvent[] = [
    {
      id: '1',
      title: 'Название события 1',
      date: '24 апреля 2025',
      type: 'Тип события',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1'
    },
    {
      id: '2',
      title: 'Название события 2',
      date: '25 апреля 2025',
      type: 'Тип события',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1'
    },
    {
      id: '3',
      title: 'Название события 3',
      date: '26 апреля 2025',
      type: 'Тип события',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1'
    },
    {
      id: '4',
      title: 'Название события 4',
      date: '27 апреля 2025',
      type: 'Тип события',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1'
    }
  ];

  const handleBack = () => {
    
    navigate(-1);
    console.log('Нажата кнопка "Назад"');
  };

  return (
    <div className={styles.container}>
      <EventHeader onBack={handleBack} tag={event.tag} styles={styles} />
      
      <main>
        <EventMain event={event} styles={styles} />
        <CommentSection comments={comments} styles={styles} />
        <Recommendations events={recommendedEvents} styles={styles} />
      </main>
    </div>
  );
};

export default EventPage;