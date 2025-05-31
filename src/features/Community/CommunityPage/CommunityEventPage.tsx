// pages/Community/CommunityEventsPage/CommunityEventsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../components/auth/AuthContext';
import EventCard from '../../../components/Community/EventCard';
import { Community, CommunityEvent } from '../../../types/community';
import styles from './CommunityEventsPage.module.css';

// Интерфейс для данных события из API
interface EventAPIResponse {
  id: string;
  eventType: 'REGULAR' | 'EMERGENCY';
  emergencyType?: string;
  title: string;
  description: string;
  content: string;
  author: string;
  city: string;
  location: {
    x: number;
    y: number;
    coordinates: [number, number];
    type: 'Point';
  };
  mediaUrl: string[];
  score?: number;
  dateTime: string;
  eventStatus?: string;
  tags: string[];
  usersIds: string[];
  metadata: {
    address?: string;
    scheduledDate?: string;
    createdAt: string;
    isCommunity?: string;
    communityId?: string;
    [key: string]: any;
  };
  comments: any[];
  archived: boolean;
}

const CommunityEventsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Состояние компонента
  const [community, setCommunity] = useState<Community | null>(null);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'REGULAR' | 'EMERGENCY'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'participants' | 'created'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Загрузка данных сообщества
  useEffect(() => {
    if (id) {
      loadCommunity(id);
    }
  }, [id]);

  // Загрузка событий при изменении сообщества
  useEffect(() => {
    if (community && community.listEvents) {
      loadEvents(community.listEvents);
    }
  }, [community?.listEvents]);

  const loadCommunity = async (communityId: string) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8090/api/community/${communityId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Сообщество не найдено');
        } else if (response.status === 403) {
          throw new Error('У вас нет доступа к этому сообществу');
        }
        throw new Error(`Ошибка загрузки сообщества: ${response.status}`);
      }

      const communityData: Community = await response.json();
      console.log('✅ Сообщество загружено:', communityData);
      setCommunity(communityData);

    } catch (error) {
      console.error('❌ Ошибка загрузки сообщества:', error);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async (eventIds: string[]) => {
    if (!eventIds || eventIds.length === 0) {
      setEvents([]);
      return;
    }

    setEventsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      console.log(`🔍 Загружаем ${eventIds.length} событий...`);

      const eventPromises = eventIds.map(async (eventId) => {
        try {
          const response = await fetch(`http://localhost:8090/api/events/${eventId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) {
            console.warn(`⚠️ Событие ${eventId} не найдено (${response.status})`);
            return null;
          }

          const eventData: EventAPIResponse = await response.json();

          // Преобразуем данные события в формат CommunityEvent
          const transformedEvent: CommunityEvent = {
            id: eventData.id,
            title: eventData.title,
            date: new Date(eventData.dateTime).toLocaleDateString('ru-RU', { 
              day: '2-digit', 
              month: 'short',
              year: 'numeric'
            }),
            time: new Date(eventData.dateTime).toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            participantsCount: eventData.usersIds?.length || 0,
            imageUrl: eventData.mediaUrl?.[0] || '/api/placeholder/300/200',
            description: eventData.description,
            author: eventData.author,
            city: eventData.city,
            tags: eventData.tags,
            eventType: eventData.eventType,
            location: eventData.metadata?.address || `${eventData.location.x.toFixed(4)}, ${eventData.location.y.toFixed(4)}`,
            // Дополнительные поля для фильтрации
            status: eventData.archived ? 'archived' : 'active',
            dateTime: eventData.dateTime,
            createdAt: eventData.metadata?.createdAt
          };

          return transformedEvent;
        } catch (error) {
          console.error(`❌ Ошибка загрузки события ${eventId}:`, error);
          return null;
        }
      });

      const loadedEvents = await Promise.all(eventPromises);
      const validEvents = loadedEvents.filter((event): event is CommunityEvent => event !== null);
      
      console.log(`✅ Загружено ${validEvents.length} из ${eventIds.length} событий`);
      setEvents(validEvents);

    } catch (error) {
      console.error('❌ Общая ошибка загрузки событий:', error);
      setError('Ошибка при загрузке событий');
    } finally {
      setEventsLoading(false);
    }
  };

  // Фильтрация и сортировка событий
  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = events.filter(event => {
      // Поиск по названию и описанию
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Фильтр по статусу
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && event.status === 'active') ||
        (statusFilter === 'archived' && event.status === 'archived');

      // Фильтр по типу
      const matchesType = typeFilter === 'all' || event.eventType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.dateTime || '').getTime() - new Date(b.dateTime || '').getTime();
          break;
        case 'participants':
          comparison = a.participantsCount - b.participantsCount;
          break;
        case 'created':
          comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [events, searchQuery, statusFilter, typeFilter, sortBy, sortOrder]);

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleCreateEvent = () => {
    navigate(`/events/create?communityId=${id}`);
  };

  const handleBack = () => {
    navigate(`/communities/${id}`);
  };

  // Статистика для фильтров
  const activeEventsCount = events.filter(e => e.status === 'active').length;
  const archivedEventsCount = events.filter(e => e.status === 'archived').length;
  const regularEventsCount = events.filter(e => e.eventType === 'REGULAR').length;
  const emergencyEventsCount = events.filter(e => e.eventType === 'EMERGENCY').length;

  // Проверка ID
  if (!id) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>ID сообщества не найден</p>
          <button onClick={() => navigate('/communities')}>К списку сообществ</button>
        </div>
      </div>
    );
  }

  // Состояние загрузки
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка сообщества...</p>
        </div>
      </div>
    );
  }

  // Ошибка загрузки
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button onClick={() => setError('')}>Закрыть</button>
            <button onClick={() => loadCommunity(id)}>Попробовать еще раз</button>
            <button onClick={handleBack}>Назад</button>
          </div>
        </div>
      </div>
    );
  }

  // Сообщество не найдено
  if (!community) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Сообщество не найдено</h2>
          <p>Запрашиваемое сообщество не существует или было удалено</p>
          <button onClick={() => navigate('/communities')}>К списку сообществ</button>
        </div>
      </div>
    );
  }

  const canCreateEvents = user?.username === community.author;

  return (
    <div className={styles.container}>
      {/* Хедер страницы */}
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Назад
          </button>

          <div className={styles.communityInfo}>
            <img 
              src={community.imageUrls[0] || '/api/placeholder/50/50'} 
              alt={community.name}
              className={styles.communityAvatar}
            />
            <div>
              <h1 className={styles.pageTitle}>
                События сообщества
              </h1>
              <Link to={`/communities/${id}`} className={styles.communityName}>
                {community.name}
              </Link>
            </div>
          </div>

          {canCreateEvents && (
            <button className={styles.createButton} onClick={handleCreateEvent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Создать событие
            </button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {/* Панель фильтров и поиска */}
        <div className={styles.filtersPanel}>
          {/* Поиск */}
          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Поиск событий..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className={styles.clearSearch}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Фильтры */}
          <div className={styles.filters}>
            {/* Статус */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Статус:</label>
              <div className={styles.filterOptions}>
                <button 
                  className={`${styles.filterOption} ${statusFilter === 'all' ? styles.active : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  Все ({events.length})
                </button>
                <button 
                  className={`${styles.filterOption} ${statusFilter === 'active' ? styles.active : ''}`}
                  onClick={() => setStatusFilter('active')}
                >
                  Активные ({activeEventsCount})
                </button>
                <button 
                  className={`${styles.filterOption} ${statusFilter === 'archived' ? styles.active : ''}`}
                  onClick={() => setStatusFilter('archived')}
                >
                  Архивированные ({archivedEventsCount})
                </button>
              </div>
            </div>

            {/* Тип */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Тип:</label>
              <div className={styles.filterOptions}>
                <button 
                  className={`${styles.filterOption} ${typeFilter === 'all' ? styles.active : ''}`}
                  onClick={() => setTypeFilter('all')}
                >
                  Все ({events.length})
                </button>
                <button 
                  className={`${styles.filterOption} ${typeFilter === 'REGULAR' ? styles.active : ''}`}
                  onClick={() => setTypeFilter('REGULAR')}
                >
                  Обычные ({regularEventsCount})
                </button>
                <button 
                  className={`${styles.filterOption} ${typeFilter === 'EMERGENCY' ? styles.active : ''}`}
                  onClick={() => setTypeFilter('EMERGENCY')}
                >
                  Экстренные ({emergencyEventsCount})
                </button>
              </div>
            </div>
          </div>

          {/* Сортировка */}
          <div className={styles.sortContainer}>
            <label className={styles.filterLabel}>Сортировка:</label>
            <div className={styles.sortControls}>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className={styles.sortSelect}
              >
                <option value="date">По дате</option>
                <option value="participants">По участникам</option>
                <option value="created">По созданию</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={styles.sortOrderButton}
                title={sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {sortOrder === 'asc' ? (
                    <>
                      <polyline points="17 11 12 6 7 11"></polyline>
                      <polyline points="17 18 12 13 7 18"></polyline>
                    </>
                  ) : (
                    <>
                      <polyline points="7 13 12 18 17 13"></polyline>
                      <polyline points="7 6 12 11 17 6"></polyline>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Результаты */}
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>
              Найдено {filteredAndSortedEvents.length} из {events.length} событий
            </p>
          </div>

          {/* Состояние загрузки событий */}
          {eventsLoading && (
            <div className={styles.eventsLoading}>
              <div className={styles.spinner}></div>
              <p>Загрузка событий...</p>
            </div>
          )}

          {/* События */}
          {!eventsLoading && (
            <>
              {filteredAndSortedEvents.length > 0 ? (
                <div className={styles.eventsGrid}>
                  {filteredAndSortedEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onClick={handleEventClick}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.noEvents}>
                  <div className={styles.noEventsIcon}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <h3>События не найдены</h3>
                  <p>
                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'Попробуйте изменить параметры поиска или фильтры'
                      : 'В этом сообществе пока нет событий'
                    }
                  </p>
                  {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && canCreateEvents && (
                    <button 
                      onClick={handleCreateEvent}
                      className={styles.createFirstEventButton}
                    >
                      Создать первое событие
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityEventsPage;