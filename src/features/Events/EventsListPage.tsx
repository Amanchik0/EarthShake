import React, { useState } from 'react';
import EventCard from '../../components/EventList/EventCard';
import FilterDropdown from '../../components/EventList/FilterDropdown';
import ViewToggle from '../../components/EventList/ViewToggle';
import MapView from '../../components/EventList/MapView';
import { Event, FilterConfig } from '../../types/types';
import './EventsListPage.css'

const EventsListPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'split' | 'map'>('list');
  const [isFullMap, setIsFullMap] = useState(false);
console.log('====================================');
console.log();
console.log('====================================');
  const filterConfigs: FilterConfig[] = [
    {
      label: 'Категория',
      options: [
        { value: '', label: 'Все категории' },
        { value: '1', label: 'Концерты' },
        { value: '2', label: 'Фестивали' },
        { value: '3', label: 'Выставки' },
        { value: '4', label: 'Спорт' },
      ],
    },
    {
      label: 'Дата',
      options: [
        { value: '', label: 'Все даты' },
        { value: 'today', label: 'Сегодня' },
        { value: 'week', label: 'На этой неделе' },
        { value: 'month', label: 'В этом месяце' },
      ],
    },
    {
      label: 'Локация',
      options: [
        { value: '', label: 'Все локации' },
        { value: 'center', label: 'Центр' },
        { value: 'north', label: 'Север' },
        { value: 'south', label: 'Юг' },
      ],
    },
  ];

  const [filters, setFilters] = useState<Record<string, string>>({
    category: '',
    date: '',
    location: '',
  });

  const events: Event[] = [
    {
      id: '1',
      title: 'Концерт группы "Звезды"',
      date: '25 апреля, 19:00',
      location: 'Концертный зал "Гармония"',
      price: 'от 1500 руб.',
      rating: 4,
      reviewsCount: 42,
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
      type: '1',
      tag:'regular', 
       author: {
            name: 'Иван Иванов',
            role: 'Организатор',
            avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk='
          }

    },
    {
      id: '2',
      title: 'Выставка современного искусства',
      date: '20-30 апреля',
      location: 'Галерея "Модерн"',
      price: '800 руб.',
      rating: 5,
      reviewsCount: 78,
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
      type: '3',
      tag:'regular', 
       author: {
            name: 'Иван Иванов',
            role: 'Организатор',
            avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk='
          }
    },
    {
      id: '3',
      title: 'Футбольный матч',
      date: '27 апреля, 16:00',
      location: 'Стадион "Победа"',
      price: 'от 1000 руб.',
      rating: 3,
      reviewsCount: 126,
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
      type: '4',
      tag:'regular', 
       author: {
            name: 'Иван Иванов',
            role: 'Организатор',
            avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk='
          }
    },
    {
      id: '4',
      title: 'Мастер-класс по кулинарии',
      date: '22 апреля, 12:00',
      location: 'Кулинарная студия "Вкусно"',
      price: '2500 руб.',
      rating: 4,
      reviewsCount: 31,
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
      type: '2',
      tag:'regular', 
       author: {
            name: 'Иван Иванов',
            role: 'Организатор',
            avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk='
          }
    },
  ];

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const toggleFullMap = () => {
    setIsFullMap(!isFullMap);
    if (!isFullMap) {
      setViewMode('map');
    } else {
      setViewMode('split');
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filters.category && event.type !== filters.category) return false;
    // Здесь можно добавить дополнительную фильтрацию по дате и локации
    return true;
  });

  return (
    <div className="container">
      <div className="header">
        <h1>События</h1>
      </div>
      
      <div className="filter-section">
        <div className="filters">
          {filterConfigs.map((filter) => (
            <FilterDropdown
              key={filter.label}
              label={filter.label}
              options={filter.options}
              value={filters[filter.label.toLowerCase()] || ''}
              onChange={(value) => handleFilterChange(filter.label.toLowerCase(), value)}
            />
          ))}
        </div>
      </div>
      
      <ViewToggle currentMode={viewMode} onChange={setViewMode} />
      
      <div className={`content-wrapper ${viewMode === 'split' ? 'split-view' : ''} ${viewMode === 'map' ? 'full-map-view' : ''}`}>
        <div className="list-view">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        {(viewMode === 'split' || viewMode === 'map') && (
          <MapView isFullMap={isFullMap} onToggleFullMap={toggleFullMap} />
        )}
      </div>
    </div>
  );
};

export default EventsListPage;