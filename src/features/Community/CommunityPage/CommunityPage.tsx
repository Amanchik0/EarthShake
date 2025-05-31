import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommunityHeader from '../../../components/Community/CommunityHeader';
import StatisticsBar from '../../../components/Community/StatisticsBar';
import AdminCard from '../../../components/Community/AdminCard';
import EventCard from '../../../components/Community/EventCard';
import MemberItem from '../../../components/Community/MemberItem';
import CommunityCard from '../../../components/Community/CommunityCard';
import { 
  CommunityDetails, 
  Admin, 
  CommunityEvent, 
  Member 
} from '../../../types/community';
import { useCommunityApi } from '../../../hooks/useCommunityApi';
import styles from './CommunityPage.module.css';

const CommunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    loading,
    error,
    community,
    fetchCommunity,
    joinCommunity,
    leaveCommunity,
    subscribeToUpdates
  } = useCommunityApi();

  useEffect(() => {
    if (id) {
      fetchCommunity(id);
    }
  }, [id]); // Убираем fetchCommunity из зависимостей

  useEffect(() => {
    if (id) {
      subscribeToUpdates(true);
      
      return () => {
        subscribeToUpdates(false);
      };
    }
  }, [id]); // Убираем subscribeToUpdates из зависимостей

  const handleJoinCommunity = async () => {
    if (!community || !id) return;
    
    if (community.isMember) {
      await leaveCommunity(id);
    } else {
      await joinCommunity(id);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditCommunity = () => {
    if (community) {
      navigate(`/communities/${community.id}/edit`);
    }
  };

  const handleCreateEvent = () => {
    if (community) {
      // Передаем community ID в качестве автора события
      navigate(`/events/create?communityId=${community.id}&authorType=community`);
    }
  };

  const isOwner = () => {
    const currentUsername = localStorage.getItem('username');
    return community?.author === currentUsername;
  };

  const isMember = () => {
    return community?.isMember;
  };

  // Моковые данные для администраторов (пока нет API)
  const admins: Admin[] = [
    { 
      id: '1', 
      name: community?.author || 'Администратор', 
      role: 'Создатель', 
      avatarUrl: '/api/placeholder/50/50' 
    },
  ];

  // Моковые данные для событий (можно использовать community.listEvents)
  const events: CommunityEvent[] = community?.listEvents?.map((eventId, index) => ({
    id: eventId,
    title: `Событие ${index + 1}`,
    date: '23 Апр',
    time: '18:00',
    participantsCount: 0,
    imageUrl: '/api/placeholder/200/120'
  })) || [];

  // Моковые данные для участников (можно использовать community.users)
  const members: Member[] = community?.users?.map((userId, index) => ({
    id: userId,
    name: userId,
    avatarUrl: '/api/placeholder/40/40'
  })) || [];

  // Моковые данные для рекомендаций (пока нет API)
  const recommendedCommunities: CommunityDetails[] = [];

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

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка загрузки</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/communities')} className={styles.button}>
            Вернуться к списку сообществ
          </button>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Сообщество не найдено</h2>
          <button onClick={() => navigate('/communities')} className={styles.button}>
            Вернуться к списку сообществ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Назад
        </button>
        
        <div className={styles.headerActions}>
          {(isOwner() || isMember()) && (
            <button className={styles.createEventButton} onClick={handleCreateEvent}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <line x1="12" y1="14" x2="12" y2="18"></line>
                <line x1="10" y1="16" x2="14" y2="16"></line>
              </svg>
              Создать событие
            </button>
          )}
          
          {isOwner() && (
            <button className={styles.editButton} onClick={handleEditCommunity}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Редактировать
            </button>
          )}
        </div>
      </header>
      
      <main>
        <CommunityHeader 
          community={community} 
          onJoin={handleJoinCommunity}
          isJoining={loading}
        />
        
        <StatisticsBar 
          membersCount={community.membersCount}
          eventsCount={community.eventsCount}
          rating={community.rating}
          postsCount={community.postsCount}
        />
        
        {community.dopDescription && community.dopDescription.length > 0 && (
          <section className={styles.contentSection}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                  Дополнительная информация
                </h2>
              </div>
              <div className={styles.additionalContent}>
                {community.dopDescription.map((content, index) => (
                  <p key={index}>{content}</p>
                ))}
              </div>
            </div>
          </section>
        )}
        
        <section className={styles.contentSection}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Администраторы
              </h2>
            </div>
            
            <div className={styles.adminList}>
              {admins.map(admin => (
                <AdminCard key={admin.id} admin={admin} />
              ))}
            </div>
          </div>
        </section>
        
        <section className={styles.contentSection}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Ближайшие события
              </h2>
              {events.length > 0 && (
                <a href="#" className={styles.seeAll}>
                  Все события
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              )}
            </div>
            
            {events.length > 0 ? (
              <div className={styles.eventsGrid}>
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <p>Событий пока нет</p>
                {(isOwner() || isMember()) && (
                  <button className={styles.createFirstEventButton} onClick={handleCreateEvent}>
                    Создать первое событие
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
        
        {members.length > 0 && (
          <section className={styles.contentSection}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Участники
                </h2>
                <a href="#" className={styles.seeAll}>
                  Все участники
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              </div>
              
              <div className={styles.membersGrid}>
                {members.slice(0, 10).map(member => (
                  <MemberItem key={member.id} member={member} />
                ))}
              </div>
            </div>
          </section>
        )}
        
        {recommendedCommunities.length > 0 && (
          <section className={styles.contentSection}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                    <path d="M13 12h1"></path>
                  </svg>
                  Рекомендуемые сообщества
                </h2>
                <a href="#" className={styles.seeAll}>
                  Все рекомендации
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              </div>
              
              <div className={styles.recommendationGrid}>
                {recommendedCommunities.map(community => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            </div>
          </section>
        )}
        </main>
      </div>
    );
  };

export default CommunityPage;