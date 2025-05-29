import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventHeader from '../../../components/Event/EventHeader';
import EventMain from '../../../components/Event/EventMain';
import EventInteractions from '../../../components/Event/EventInteractions';
import CommentSection from '../../../components/Event/CommentSection';
import Recommendations from '../../../components/Event/Recomemdations/Recommendations';
import { BackendEventData, RecommendedEvent } from '../../../types/event';
import styles from './EventPage.module.css';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<BackendEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedEvent[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError('ID события не указан');
        setLoading(false);
        return;
      }

      try {
        console.log(`Загружаем событие с ID: ${id}`);
        
        const response = await fetch(`http://localhost:8090/api/events/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Событие не найдено');
          }
          throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
        }
        
        const data: BackendEventData = await response.json();
        console.log('Получены данные события:', data);
        
        setEvent(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки события:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Функция для загрузки рекомендаций
  useEffect(() => {
    const loadRecommendations = async () => {
      // TODO: Реальный запрос к API для получения рекомендаций
      // const response = await fetch(`http://localhost:8090/api/events/recommendations/${id}`);
      // const data = await response.json();
      
      // Моковые данные пока что
      const mockRecommendations: RecommendedEvent[] = [
        {
          id: '1',
          title: 'Концерт в парке',
          date: '30 мая 2025',
          type: 'Музыка',
          imageUrl: '/api/placeholder/200/150'
        },
        {
          id: '2', 
          title: 'Спортивное мероприятие',
          date: '1 июня 2025',
          type: 'Спорт',
          imageUrl: '/api/placeholder/200/150'
        },
        {
          id: '3',
          title: 'Образовательный семинар',
          date: '3 июня 2025', 
          type: 'Образование',
          imageUrl: '/api/placeholder/200/150'
        }
      ];
      
      setRecommendations(mockRecommendations);
    };

    loadRecommendations();
  }, [id]);

  // Обработчик обновления события
  const handleEventUpdate = (updatedEvent: BackendEventData) => {
    setEvent(updatedEvent);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '50vh', 
          textAlign: 'center', 
          padding: '2rem' 
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid var(--primary-pink)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            marginBottom: '1rem' 
          }}></div>
          <p>Загрузка события...</p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error || !event) {
    return (
      <div className={styles.container}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '50vh', 
          textAlign: 'center', 
          padding: '2rem' 
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>😞 Ошибка</h2>
          <p style={{ color: 'var(--dark-gray)', marginBottom: '1.5rem' }}>
            {error || 'Событие не найдено'}
          </p>
          <button onClick={handleBack} className={styles.backButton}>
            ← Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <EventHeader 
        onBack={handleBack} 
        eventType={event.eventType}
        styles={styles}
      />
      
      <main>
        <EventMain event={event} styles={styles} />
        <EventInteractions 
          event={event} 
          styles={styles} 
          onEventUpdate={handleEventUpdate}
        />
        <CommentSection comments={event.comments} styles={styles} />
        <Recommendations events={recommendations} styles={styles} />
      </main>
    </div>
  );
};

export default EventPage;