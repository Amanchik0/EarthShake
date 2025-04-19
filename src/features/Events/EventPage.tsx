import React from 'react';
import EventHeader from '../../components/Event/EventHeader';
import EventMain from '../../components/Event/EventMain';
import CommentSection from '../../components/Event/CommentSection';
import Recommendations from '../../components/Event/Recommendations';
import { Event, Comment, RecommendedEvent } from '../../types/types';
import './EventPage.css'
const EventPage: React.FC = () => {
console.log('====================================');
console.log();
console.log('====================================');

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
    imageUrl: '/api/placeholder/800/400',
    tag: 'regular',
    author: {
      name: 'Иван Иванов',
      role: 'Организатор',
      avatarUrl: '/api/placeholder/40/40'
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
      imageUrl: '/api/placeholder/300/150'
    },
    {
      id: '2',
      title: 'Название события 2',
      date: '25 апреля 2025',
      type: 'Тип события',
      imageUrl: '/api/placeholder/300/150'
    },
    {
      id: '3',
      title: 'Название события 3',
      date: '26 апреля 2025',
      type: 'Тип события',
      imageUrl: '/api/placeholder/300/150'
    },
    {
      id: '4',
      title: 'Название события 4',
      date: '27 апреля 2025',
      type: 'Тип события',
      imageUrl: '/api/placeholder/300/150'
    }
  ];

  const handleBack = () => {
    // todo 
    // Логика возврата назад 
    console.log('Нажата кнопка "Назад"');
  };

  return (
    <div className="container">
      <EventHeader onBack={handleBack} tag={eventData.tag} />
      
      <main>
        <EventMain event={eventData} />
        <CommentSection comments={comments} />
        <Recommendations events={recommendedEvents} />
      </main>
    </div>
  );
};

export default EventPage;