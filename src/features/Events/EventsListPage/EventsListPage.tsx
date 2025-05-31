// features/Events/EventsListPage/EventsListPage.tsx
import React, { useState, useEffect } from 'react';
import EventCard from '../../../components/EventList/EventCard';
import FilterDropdown from '../../../components/EventList/FilterDropdown';
import ViewToggle from '../../../components/EventList/ViewToggle';
import MapView from '../../../components/EventList/MapView';
import styles from './EventsListPage.module.css';
import {CitySelect} from '../../../components/CitySelect/CitySelect'
import { EventDetails, BackendEventData, EventComment } from '../../../types/event';

export interface FilterConfig {
  readonly label: string;
  readonly options: FilterOption[];
}

export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

// Helper functions for date formatting
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  const monthNames = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  
  return `${day} ${monthNames[date.getMonth()]} ${year}, ${hours}:${minutes}`;
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isThisWeek = (date: Date): boolean => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
};

const isThisMonth = (date: Date): boolean => {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

const EventsListPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'split' | 'map'>('list');
  const [isFullMap, setIsFullMap] = useState(false);
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterConfigs: FilterConfig[] = [
    {
      label: 'category',
      options: [
        { value: '', label: 'Все категории' },
        { value: 'sport', label: 'Спорт' },
        { value: 'soccer', label: 'Футбол' },
        { value: 'музыка', label: 'Музыка' },
        { value: 'образование', label: 'Образование' },
        { value: 'развлечения', label: 'Развлечения' },
        { value: 'искусство', label: 'Искусство' },
      ],
    },
    {
      label: 'date',
      options: [
        { value: '', label: 'Все даты' },
        { value: 'today', label: 'Сегодня' },
        { value: 'week', label: 'На этой неделе' },
        { value: 'month', label: 'В этом месяце' },
      ],
    },
    {
      label: 'location',
      options: [
        { value: '', label: 'Все локации' },
        { value: 'Almaty', label: 'Алматы' },
        { value: 'Алматы', label: 'Алматы' },
        { value: 'Astana', label: 'Астана' },
      ],
    },
  ];

  const [filters, setFilters] = useState<Record<string, string>>({
    category: '',
    date: '',
    location: '',
  });

// В EventsListPage.tsx - обновленная функция transformEvent
const transformEvent = (backendEvent: BackendEventData): EventDetails => {
  const eventDate = new Date(backendEvent.dateTime);
  const formattedDate = formatDate(backendEvent.dateTime);
  
  // Получаем координаты
  let lng: number, lat: number;
  
  if (backendEvent.location.coordinates && Array.isArray(backendEvent.location.coordinates)) {
    lng = backendEvent.location.coordinates[0];
    lat = backendEvent.location.coordinates[1];
  } else {
    lng = backendEvent.location.x;
    lat = backendEvent.location.y;
  }

  // Получаем первое изображение из массива mediaUrl
  const imageUrl = Array.isArray(backendEvent.mediaUrl) && backendEvent.mediaUrl.length > 0 
    ? backendEvent.mediaUrl[0] 
    : '';

  // Вычисляем рейтинг из массива score
  let rating = 0;
  if (backendEvent.score && Array.isArray(backendEvent.score) && backendEvent.score.length > 0) {
    const average = backendEvent.score.reduce((sum, val) => sum + val, 0) / backendEvent.score.length;
    rating = Math.min(5, Math.max(1, average));
  }
  
  // Трансформируем комментарии из массива в объект для UI
  const transformedComments: Record<string, EventComment> = {};
  if (backendEvent.comments && Array.isArray(backendEvent.comments)) {
    backendEvent.comments.forEach((comment) => {
      transformedComments[comment.id] = {
        id: comment.id,
        author: comment.author,
        text: comment.text,
        date: comment.date,
        avatarUrl: comment.avatarUrl
      };
    });
  }
  
  return {
    id: backendEvent.id,
    title: backendEvent.title,
    date: formattedDate,
    description: backendEvent.description,
    imageUrl: imageUrl, // Первое изображение для UI
    city: backendEvent.city,
    type: backendEvent.tags?.[0] || 'general',
    rating: rating,
    reviewsCount: backendEvent.comments?.length || 0,
    usersIds: backendEvent.usersIds || [],
    tag: backendEvent.eventType === 'EMERGENCY' ? 'emergency' : 'regular',
    author: {
      name: backendEvent.author,
      role: 'Организатор',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendEvent.author)}&background=random`
    },
    price: '0 тг',
    lat: lat,
    lng: lng,
    score: Array.isArray(backendEvent.score) && backendEvent.score.length > 0 
      ? backendEvent.score.reduce((sum, val) => sum + val, 0) / backendEvent.score.length 
      : 0,
    dateTime: backendEvent.dateTime,
    content: backendEvent.content,
    location: {
      coordinates: [lng, lat]
    },
    comments: transformedComments,
    commentsCount: backendEvent.comments?.length || 0,
    metadata: backendEvent.metadata,
    tags: backendEvent.tags
  };
};

// Также нужно обновить fetchEvents функцию для обработки ошибок
const fetchEvents = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch('http://localhost:8090/api/events/get-all');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data); // Для отладки
    
    // Проверяем структуру ответа
    const eventsArray = data.content || data || [];
    
    if (!Array.isArray(eventsArray)) {
      console.error('Expected array but got:', typeof eventsArray, eventsArray);
      throw new Error('Неверный формат данных с сервера');
    }
    
    // Transform backend data to frontend format
    const transformedEvents = eventsArray.map((event, index) => {
      try {
        return transformEvent(event);
      } catch (transformError) {
        console.error(`Error transforming event at index ${index}:`, transformError, event);
        return null;
      }
    }).filter(Boolean); 
    
    setEvents(transformedEvents);
    
  } catch (err) {
    console.error('Error fetching events:', err);
    setError('Не удалось загрузить события');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const toggleFullMap = () => {
    setIsFullMap(!isFullMap);
    if (!isFullMap) {
      setViewMode('map');
    } else {
      setViewMode('split');
    }
  };

  // Apply filters
  const filteredEvents = events.filter(event => {
    // Category filter
    if (filters.category) {
      const hasCategory = event.type === filters.category || 
                         (event.tags && event.tags.includes(filters.category));
      if (!hasCategory) return false;
    }
    
    // Location filter
    if (filters.location && event.city !== filters.location) return false;
    
    // Date filter
    if (filters.date) {
      const eventDate = new Date(event.dateTime);
      
      switch (filters.date) {
        case 'today':
          if (!isToday(eventDate)) return false;
          break;
        case 'week':
          if (!isThisWeek(eventDate)) return false;
          break;
        case 'month':
          if (!isThisMonth(eventDate)) return false;
          break;
      }
    }
    
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка событий...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button 
            onClick={fetchEvents} 
            className={styles.retryButton}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>События</h1>
        <p className={styles.subtitle}>
          Найдено {filteredEvents.length} из {events.length} событий
        </p>
      </div>
      
      <div className={styles.filterSection}>
        <div className={styles.filters}>
          {filterConfigs.map((filter) => (
            <FilterDropdown
              key={filter.label}
              label={filter.label === 'category' ? 'Категория' : 
                    filter.label === 'date' ? 'Дата' : 'Локация'}
              options={filter.options}
              value={filters[filter.label] || ''}
              onChange={(value) => handleFilterChange(filter.label, value)}
            />
          ))}
        </div>
        
        {Object.values(filters).some(filter => filter !== '') && (
          <button 
            className={styles.clearFilters}
            onClick={() => setFilters({ category: '', date: '', location: '' })}
          >
            Очистить фильтры
          </button>
        )}
      </div>
      
      <ViewToggle currentMode={viewMode} onChange={setViewMode} />
      
      <div 
        className={`${styles.contentWrapper} 
          ${viewMode === 'split' ? styles.splitView : ''} 
          ${viewMode === 'map' ? styles.fullMapView : ''}`}
      >
        <div className={styles.listView}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
              />
            ))
          ) : (
            <div className={styles.noResults}>
              <h3>Событий не найдено</h3>
              <p>Попробуйте изменить параметры фильтра или очистить все фильтры</p>
            </div>
          )}
        </div>
        
        {(viewMode === 'split' || viewMode === 'map') && (
          <MapView 
            isFullMap={isFullMap} 
            onToggleFullMap={toggleFullMap} 
            events={filteredEvents.map(event => ({
              ...event,
              lat: event.lat || 0,
              lng: event.lng || 0,
              tag: event.tag as 'regular' | 'emergency',
              city: event.city || '',
            }))}
          />
        )}
      </div>
    </div>
  );
};

export default EventsListPage;