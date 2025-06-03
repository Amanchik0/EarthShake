import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/auth/AuthContext';
import { useCommunityDetail } from '../../../hooks/useCommunityDetail';
import CommunityHeader from '../../../components/Community/CommunityHeader';
import StatisticsBar from '../../../components/Community/StatisticsBar';
import AdminCard from '../../../components/Community/AdminCard';
import EventCard from '../../../components/Community/EventCard';
import MemberItem from '../../../components/Community/MemberItem';
import CommunityCard from '../../../components/Community/CommunityCard';
import { 
  Admin, 
  CommunityEvent, 
  Member,
  CommunityDetails,
  Community,
  toCommunityDetails
} from '../../../types/community';
import styles from './CommunityPage.module.css';

interface UserProfile {
  id: string;
  username: string;
  imageUrl?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  city?: string;
  interests?: string[];
  registrationDate?: string;
  lastActivity?: string;
}

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

// Интерфейс для ответа API со списком сообществ
interface CommunityAPIResponse {
  content: Community[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

const CommunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    loading, 
    error, 
    community, 
    loadCommunity, 
    joinCommunity, 
    leaveCommunity, 
    updateCommunity,
    clearError 
  } = useCommunityDetail(user?.username);

  // Состояние для дополнительных данных
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [recommendedCommunities, setRecommendedCommunities] = useState<CommunityDetails[]>([]);
  const [showJoinConfirmation, setShowJoinConfirmation] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string>('');
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string>('');
  const [membersLoading, setMembersLoading] = useState(false);

  // Загрузка данных сообщества
  useEffect(() => {
    if (id) {
      loadCommunity(id);
    }
  }, [id, loadCommunity]);

  // Функция загрузки профилей пользователей
const loadUserProfiles = async (usernames: string[]) => {
  if (!usernames || usernames.length === 0) {
    setUserProfiles(new Map());
    return;
  }

  setMembersLoading(true);

  try {
    const token = localStorage.getItem('accessToken');
    const profilesMap = new Map<string, UserProfile>();

    // Загружаем профили пользователей параллельно
    const profilePromises = usernames.map(async (username) => {
      try {
        const response = await fetch(`http://localhost:8090/api/users/get-by-username/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.warn(` Профиль ${username} не найден (${response.status})`);
          return {
            id: username,
            username: username,
            imageUrl: '/api/placeholder/50/50'  // fallback изображение
          };
        }

        const profile: UserProfile = await response.json();
        // Здесь profile.imageUrl будет содержать реальный URL фото пользователя
        return profile;
      } catch (error) {
        // В случае ошибки возвращаем базовый профиль
        return {
          id: username,
          username: username,
          imageUrl: '/api/placeholder/50/50'
        };
      }
    });

    const profiles = await Promise.all(profilePromises);
    
    profiles.forEach(profile => {
      if (profile) {
        profilesMap.set(profile.username, profile);
      }
    });

    setUserProfiles(profilesMap);
  } catch (error) {
    console.error('Общая ошибка загрузки профилей:', error);
  } finally {
    setMembersLoading(false);
  }
};

  // Функция загрузки событий
  const loadCommunityEvents = async (eventIds: string[]) => {
    if (!eventIds || eventIds.length === 0) {
      setEvents([]);
      return;
    }

    setEventsLoading(true);
    setEventsError('');

    try {
      const token = localStorage.getItem('accessToken');
      const eventPromises = eventIds.map(async (eventId) => {
        try {
          console.log(` Загружаем событие: ${eventId}`);
          
          const response = await fetch(`http://localhost:8090/api/events/${eventId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) {
            console.warn(` Событие ${eventId} не найдено (${response.status})`);
            return null;
          }

          const eventData: EventAPIResponse = await response.json();
          console.log(` Событие ${eventId} загружено:`, eventData);

          // Преобразуем данные события в формат CommunityEvent
          const transformedEvent: CommunityEvent = {
            id: eventData.id,
            title: eventData.title,
            date: new Date(eventData.dateTime).toLocaleDateString('ru-RU', { 
              day: '2-digit', 
              month: 'short' 
            }),
            time: new Date(eventData.dateTime).toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            participantsCount: eventData.usersIds?.length || 0,
            imageUrl: eventData.mediaUrl?.[0] || '/api/placeholder/200/120',
            description: eventData.description,
            author: eventData.author,
            city: eventData.city,
            tags: eventData.tags,
            eventType: eventData.eventType,
            location: eventData.metadata?.address || `${eventData.location.x.toFixed(4)}, ${eventData.location.y.toFixed(4)}`
          };

          return transformedEvent;
        } catch (error) {
          console.error(`Ошибка загрузки события ${eventId}:`, error);
          return null;
        }
      });

      const loadedEvents = await Promise.all(eventPromises);
      
      // Фильтруем успешно загруженные события
      const validEvents = loadedEvents.filter((event): event is CommunityEvent => event !== null);
      
      console.log(` Загружено ${validEvents.length} из ${eventIds.length} событий`);
      setEvents(validEvents);

      if (validEvents.length === 0 && eventIds.length > 0) {
        setEventsError('Не удалось загрузить события сообщества');
      }

    } catch (error) {
      console.error('Общая ошибка загрузки событий:', error);
      setEventsError('Ошибка при загрузке событий');
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  // Функция загрузки случайных сообществ
  const loadRandomCommunities = async () => {
    if (!id) return;

    setRecommendationsLoading(true);
    setRecommendationsError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8090/api/community/get-all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки сообществ: ${response.status}`);
      }

      const data: CommunityAPIResponse = await response.json();
      console.log(' Загружены все сообщества:', data);

      // Фильтруем текущее сообщество из списка
      const otherCommunities = data.content.filter(comm => comm.id !== id);
      
      // Если сообществ меньше или равно 3, берем все
      let selectedCommunities: Community[];
      if (otherCommunities.length <= 3) {
        selectedCommunities = otherCommunities;
      } else {
        // Выбираем 3 случайных сообщества
        selectedCommunities = [];
        const availableIndices = [...Array(otherCommunities.length).keys()];
        
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * availableIndices.length);
          const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
          selectedCommunities.push(otherCommunities[selectedIndex]);
        }
      }

      // Преобразуем в CommunityDetails
      const communityDetails = selectedCommunities.map(comm => 
        toCommunityDetails(comm, user?.username)
      );

      console.log(` Выбрано ${communityDetails.length} случайных сообществ:`, communityDetails);
      setRecommendedCommunities(communityDetails);

    } catch (error) {
      console.error('Ошибка загрузки рекомендуемых сообществ:', error);
      setRecommendationsError('Не удалось загрузить рекомендуемые сообщества');
      setRecommendedCommunities([]);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Загрузка событий при изменении сообщества
  useEffect(() => {
    if (community && community.listEvents) {
      console.log(' Загружаем события сообщества:', community.listEvents);
      loadCommunityEvents(community.listEvents);
    } else {
      setEvents([]);
    }
  }, [community?.listEvents]);

  // Загрузка профилей пользователей при изменении сообщества
  useEffect(() => {
    if (community && community.users) {
      console.log('Загружаем профили пользователей:', community.users);
      loadUserProfiles(community.users);
    } else {
      setUserProfiles(new Map());
    }
  }, [community?.users]);

  // Загрузка случайных сообществ при изменении ID
  useEffect(() => {
    if (id) {
      loadRandomCommunities();
    }
  }, [id, user?.username]);

  // Обновление списков администраторов и участников при загрузке профилей
  useEffect(() => {
    if (community && userProfiles.size > 0) {
      // Администраторы - автор сообщества
      const authorProfile = userProfiles.get(community.author);
      const adminsList: Admin[] = [{
        id: community.author,
        name: community.author,
        role: 'Создатель',
        avatarUrl: authorProfile?.imageUrl || '/api/placeholder/50/50'
      }];

      // Можно добавить других админов если они есть в данных
      setAdmins(adminsList);

      // Участники - первые 10 пользователей с загруженными профилями
      const membersList: Member[] = community.users
        .slice(0, 10)
        .map(username => {
          const profile = userProfiles.get(username);
          return {
            id: profile?.id || username,
            name: username,
            avatarUrl: profile?.imageUrl || '/api/placeholder/50/50'
          };
        });

      setMembers(membersList);
    }
  }, [community, userProfiles]);

  const handleJoinCommunity = async () => {
    if (!community || !user) {
      alert('Необходимо войти в систему');
      return;
    }

    // Подтверждение для выхода из сообщества
    if (community.isMember) {
      const confirmed = window.confirm(`Вы уверены, что хотите покинуть сообщество "${community.name}"?`);
      if (!confirmed) return;
    }

    try {
      let success = false;
      
      if (community.isMember) {
        // Покинуть сообщество
        success = await leaveCommunity(community.id);
        if (success) {
          setShowJoinConfirmation(true);
          setTimeout(() => setShowJoinConfirmation(false), 3000);
        }
      } else {
        // Вступить в сообщество
        success = await joinCommunity(community.id);
        if (success) {
          setShowJoinConfirmation(true);
          setTimeout(() => setShowJoinConfirmation(false), 3000);
        }
      }
    } catch (error) {
      console.error('Ошибка при вступлении/выходе:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleCreateEvent = () => {
    navigate(`/events/create?communityId=${id}`);
  };

  const handleShowAllMembers = () => {
    navigate(`/communities/${id}/members`);
  };
  const handleShowAllEvents = () => {
    navigate(`/communities/${id}/events`);
  };
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
  if (loading && !community) {
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
            <button onClick={() => clearError()}>Закрыть</button>
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

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Назад
        </button>
      </header>
      
      <main>
        <CommunityHeader 
          community={community} 
          onJoin={handleJoinCommunity}
          loading={loading}
        />
        
        <StatisticsBar 
          membersCount={community.numberMembers}
          eventsCount={community.eventsCount}
          rating={community.rating}
          postsCount={community.postsCount}
        />
        
        {/* Администраторы */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Администраторы</h2>
          </div>
          
          <div className={styles.adminList}>
            {admins.map(admin => (
              <AdminCard key={admin.id} admin={admin} />
            ))}
          </div>
        </section>
        
        {/* События */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>События ({community.eventsCount})</h2>
            <div className={styles.sectionActions}>
      <button onClick={handleShowAllEvents} className={styles.seeAll}>
                Все события
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          
          {eventsLoading && (
            <div className={styles.eventsLoading}>
              <div className={styles.spinner}></div>
              <p>Загрузка событий...</p>
            </div>
          )}
          
          {eventsError && (
            <div className={styles.eventsError}>
              <p>{eventsError}</p>
              <button onClick={() => loadCommunityEvents(community.listEvents)}>
                Попробовать снова
              </button>
            </div>
          )}
          
          {!eventsLoading && !eventsError && (
            <div className={styles.eventsGrid}>
              {events.length > 0 ? (
                events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => handleEventClick(event.id)}
                  />
                ))
              ) : (
                <div className={styles.noEvents}>
                  <p>В этом сообществе пока нет событий</p>
                  {community.isMember && (
                    <button 
                      onClick={handleCreateEvent}
                      className={styles.createFirstEventButton}
                    >
                      Создать первое событие
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
        
        {/* Участники */}
        <section className={styles.membersSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Участники ({community.numberMembers})</h2>
            <button onClick={handleShowAllMembers} className={styles.seeAll}>
              Все участники
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          {membersLoading && (
            <div className={styles.membersLoading}>
              <div className={styles.spinner}></div>
              <p>Загрузка участников...</p>
            </div>
          )}
          
          <div className={styles.membersGrid}>
            {members.length > 0 ? (
              members.map(member => (
                <MemberItem key={member.id} member={member} />
              ))
            ) : !membersLoading && (
              <p className={styles.noData}>Участники скоро появятся</p>
            )}
          </div>
        </section>
        
        {/* Рекомендации */}
        <section className={styles.recommendations}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Рекомендуемые сообщества</h2>
            <a href="#" className={styles.seeAll}>
              Все рекомендации
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
          
          {recommendationsLoading && (
            <div className={styles.recommendationsLoading}>
              <div className={styles.spinner}></div>
              <p>Загрузка рекомендаций...</p>
            </div>
          )}
          
          {recommendationsError && (
            <div className={styles.recommendationsError}>
              <p>{recommendationsError}</p>
              <button onClick={loadRandomCommunities}>
                Попробовать снова
              </button>
            </div>
          )}
          
          {!recommendationsLoading && !recommendationsError && (
            <div className={styles.recommendationGrid}>
              {recommendedCommunities.length > 0 ? (
                recommendedCommunities.map(community => (
                  <CommunityCard key={community.id} community={community} />
                ))
              ) : (
                <p className={styles.noData}>Рекомендации скоро появятся</p>
              )}
            </div>
          )}
        </section>
      </main>
      
      {/* Уведомление об успешном действии */}
      {showJoinConfirmation && (
        <div className={styles.successNotification}>
          {community.isMember ? 
            `Вы успешно вступили в сообщество "${community.name}"!` : 
            `Вы покинули сообщество "${community.name}"`
          }
        </div>
      )}
    </div>
  );
};

export default CommunityPage;