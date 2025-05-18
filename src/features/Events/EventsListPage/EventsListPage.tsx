import React, { useState } from 'react';
import EventCard from '../../../components/EventList/EventCard';
import FilterDropdown from '../../../components/EventList/FilterDropdown';
import ViewToggle from '../../../components/EventList/ViewToggle';
import MapView from '../../../components/EventList/MapView';
import styles from './EventsListPage.module.css';
import { parse, format, isToday, isThisWeek, isThisMonth, } from 'date-fns';
import { ru } from 'date-fns/locale';
import { EventDetails } from '../../../types/event';
import { Link } from 'react-router-dom';
// TODO исправить формат фильтра по дате, также еще какие то фильтры добавить 
export interface FilterConfig {
  readonly label: string;
  readonly options: FilterOption[];
}

export interface FilterOption {
  readonly value: string;
  readonly label: string;
}
export const events: EventDetails[] = [
  {
    id: "1",
    title: 'Парад',
    date: '19.05.2025, 10:00',
    description: 'Грандиозный парад в центре города.',
    imageUrl: 'https://example.com/parade.jpg',
    city: 'Алматы',
    type: '1',
    rating: 4,
    reviewsCount: 42,
    tag: 'emergency',
    author: {
      name: 'Иван Иванов',
      role: 'Организатор',
      avatarUrl: 'https://example.com/avatar1.jpg',
    },
    price: '0 тг',
    lat: 43.2567,
    lng: 76.9286,
  },
  {
    id: '2',
    title: 'Выставка современного искусства',
    date: '19.05.2025, 10:00',
    description: 'Уникальная выставка современных художников.',
    imageUrl: 'https://example.com/art.jpg',
    city: 'Музей (Север)',
    type: '3',
    rating: 5,
    reviewsCount: 78,
    tag: 'regular',
    author: {
      name: 'Иван Иванов',
      role: 'Организатор',
      avatarUrl: 'https://example.com/avatar2.jpg',
    },
    price: '800 тг',
    lat: 43.2389,
    lng: 76.8897,
  },
  {
    id: '3',
    title: 'Футбольный матч',
    date: '25.05.2025, 10:00',
    description: 'Матч между лучшими командами страны.',
    imageUrl: 'https://example.com/football.jpg',
    city: 'Стадион "Победа" (Юг)',
    type: '4',
    rating: 3,
    reviewsCount: 126,
    tag: 'regular',
          author: {
      name: 'Иван Иванов',
      role: 'Организатор',
      avatarUrl: 'https://example.com/avatar3.jpg',
    },
    price: 'от 1000 руб.',
    lat: 43.2000,
    lng: 76.8500,
  },
  {
    id: '4',
    title: 'Мастер-класс по кулинарии',
    date: '30.05.2025, 10:00',
    description: 'Научитесь готовить блюда высокой кухни.',
    imageUrl: 'https://example.com/cooking.jpg',
    city: 'Кулинарная студия "Вкусно" (Центр)',
    type: '2',
    rating: 4,
    reviewsCount: 31,
    tag: 'regular',
    author: {
      name: 'Иван Иванов',
      role: 'Организатор',
      avatarUrl: 'https://example.com/avatar4.jpg',
    },
    price: '2500 руб.',
    lat: 43.2500,
    lng: 76.9000,
  },
];
const EventsListPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'split' | 'map'>('list');
  const [isFullMap, setIsFullMap] = useState(false);

  const filterConfigs: FilterConfig[] = [
    {
      label: 'category',
      options: [
        { value: '', label: 'Все категории' },
        { value: '1', label: 'Концерты' },
        { value: '2', label: 'Фестивали' },
        { value: '3', label: 'Выставки' },
        { value: '4', label: 'Спорт' },
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
        { value: 'Astana', label: 'Астана' },
      ],
    },
  ];

  const [filters, setFilters] = useState<Record<string, string>>({
    category: '',
    date: '',
    location: '',
  });

 

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

  const parseEventDate = (dateString: string): Date => {
    return parse(dateString, 'dd.MM.yyyy, HH:mm', new Date());
  };

  const filteredEvents = events.filter(event => {
    // Фильтрация по категории
    if (filters.category && event.type !== filters.category) return false;
    
    // Фильтрация по локации
    if (filters.location) {
      const locationPart = event.city.split('(')[1]?.replace(')', '').trim();
      if (locationPart !== filters.city) return false;
    }
    
    // Фильтрация по дате
    if (filters.date) {
      const eventDate = parseEventDate(event.date);
      
      switch (filters.date) {
        case 'today':
          return isToday(eventDate);
        case 'week':
          return isThisWeek(eventDate, { weekStartsOn: 1 });
        case 'month':
          return isThisMonth(eventDate);
        default:
          return true;
      }
    }
    
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>События</h1>
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
                event={{
                  ...event,
                  date: format(parseEventDate(event.date), 'dd MMMM, EEEEEE', { locale: ru })
                }} 
              />
            ))
          ) : (
            <div className={styles.noResults}>Событий не найдено</div>
          )}
        </div>
        
        {(viewMode === 'split' || viewMode === 'map') && (
        <MapView 
        isFullMap={isFullMap} 
        onToggleFullMap={toggleFullMap} 
        events={filteredEvents.map(event => ({
          ...event,
          lat: event.lat || 0, // Убедимся, что координаты есть
          lng: event.lng || 0,
          tag: event.tag as 'regular' , // Приведение типа
          city: event.city || '', // Убедимся, что city всегда есть
        }))}
      />
        )}
      </div>
    </div>
  );
};

export default EventsListPage;