import React from 'react';
import EventHeader from '../../components/Event/EventHeader';
import EventMain from '../../components/Event/EventMain';
import CommentSection from '../../components/Event/CommentSection';
import Recommendations from '../../components/Event/Recomemdations/Recommendations';
import { Event, Comment, RecommendedEvent } from '../../types/types';
import styles from './EventPage.module.css';

const EventPage: React.FC = () => {
  const eventData: Event = {
    id: '1',
    title: 'Название события',
    date: '23 апреля 2025, 18:00',
    type: 'Тип события',
    description: [
      'Здесь размещается подробное описание события. Оно может содержать информацию о том, что будет происходить, кто организатор, для кого предназначено мероприятие и другие важные детали. Описание может быть довольно обширным и включать несколько параграфов текста.',
      'Второй абзац описания события с дополнительной информацией и деталями, которые могут заинтересовать посетителей.'
    ],
    location: 'г. Москва, ул. Примерная, д. 123',
    rating: 4,
    reviewsCount: 28,
    imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    tag: 'regular',
    author: {
      name: 'Иван Иванов',
      role: 'Организатор',
      avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk='
    }
  };

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
    // todo 
    // Логика возврата назад 
    console.log('Нажата кнопка "Назад"');
  };

  return (
    <div className={styles.container}>
      <EventHeader onBack={handleBack} tag={eventData.tag} styles={styles} />
      
      <main>
        <EventMain event={eventData} styles={styles} />
        <CommentSection comments={comments} styles={styles} />
        <Recommendations events={recommendedEvents} styles={styles} />
      </main>
    </div>
  );
};

export default EventPage;