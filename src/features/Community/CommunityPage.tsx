import React from 'react';
import CommunityHeader from '../../components/Community/CommunityHeader/CommunityHeader';
import StatisticsBar from '../../components/Community/StatisticsBar/StatisticsBar';
import AdminCard from '../../components/Community/AdminCard/AdminCard';
import EventCard from '../../components/Community/EventCard/EventCard';
import MemberItem from '../../components/Community/MemberItem/MemberItem';
import CommunityCard from '../../components/Community/CommunityCard/CommunityCard';
import { 
  Community, 
  Admin, 
  CommunityEvent, 
  Member 
} from '../../types/types';
import styles from './CommunityPage.module.css';

const CommunityPage: React.FC = () => {
  // Данные сообщества
  const communityData: Community = {
    id: '1',
    name: 'Название сообщества',
    location: 'Москва',
    createdAt: '15 января 2025',
    description: [
      'Здесь размещается описание сообщества. Оно может включать в себя информацию о целях и задачах сообщества, его истории, правилах участия и других важных аспектах. Описание может быть довольно подробным и содержать несколько абзацев текста.',
      'Второй абзац с дополнительной информацией о сообществе и его деятельности.'
    ],
    avatarUrl: '/api/placeholder/150/150',
    membersCount: 1243,
    eventsCount: 56,
    rating: 4.8,
    postsCount: 132,
    isMember: false
  };

  // Администраторы
  const admins: Admin[] = [
    { id: '1', name: 'Алексей Иванов', role: 'Создатель', avatarUrl: '/api/placeholder/50/50' },
    { id: '2', name: 'Елена Петрова', role: 'Модератор', avatarUrl: '/api/placeholder/50/50' },
    { id: '3', name: 'Дмитрий Смирнов', role: 'Администратор', avatarUrl: '/api/placeholder/50/50' }
  ];

  // События
  const events: CommunityEvent[] = [
    { id: '1', title: 'Название первого события', date: '23 Апр', time: '18:00', participantsCount: 123, imageUrl: '/api/placeholder/300/160' },
    { id: '2', title: 'Название второго события', date: '25 Апр', time: '19:30', participantsCount: 78, imageUrl: '/api/placeholder/300/160' },
    { id: '3', title: 'Название третьего события', date: '30 Апр', time: '12:00', participantsCount: 215, imageUrl: '/api/placeholder/300/160' }
  ];

  // Участники
  const members: Member[] = [
    { id: '1', name: 'Иван', avatarUrl: '/api/placeholder/60/60' },
    { id: '2', name: 'Мария', avatarUrl: '/api/placeholder/60/60' },
    { id: '3', name: 'Александр', avatarUrl: '/api/placeholder/60/60' },
    { id: '4', name: 'Екатерина', avatarUrl: '/api/placeholder/60/60' },
    { id: '5', name: 'Сергей', avatarUrl: '/api/placeholder/60/60' },
    { id: '6', name: 'Анна', avatarUrl: '/api/placeholder/60/60' },
    { id: '7', name: 'Дмитрий', avatarUrl: '/api/placeholder/60/60' },
    { id: '8', name: 'Ольга', avatarUrl: '/api/placeholder/60/60' },
    { id: '9', name: 'Андрей', avatarUrl: '/api/placeholder/60/60' },
    { id: '10', name: 'Юлия', avatarUrl: '/api/placeholder/60/60' }
  ];

  // Рекомендуемые сообщества
  const recommendedCommunities: Community[] = [
    { 
      id: '1', 
      name: 'Название сообщества 1', 
      location: 'Москва', 
      createdAt: '', 
      description: [], 
      avatarUrl: '/api/placeholder/70/70', 
      coverUrl: '/api/placeholder/300/100',
      membersCount: 765, 
      eventsCount: 0, 
      rating: 0, 
      postsCount: 0, 
      isMember: false 
    },
    { 
      id: '2', 
      name: 'Название сообщества 2', 
      location: 'Санкт-Петербург', 
      createdAt: '', 
      description: [], 
      avatarUrl: '/api/placeholder/70/70', 
      coverUrl: '/api/placeholder/300/100',
      membersCount: 1243, 
      eventsCount: 0, 
      rating: 0, 
      postsCount: 0, 
      isMember: false 
    },
    { 
      id: '3', 
      name: 'Название сообщества 3', 
      location: 'Казань', 
      createdAt: '', 
      description: [], 
      avatarUrl: '/api/placeholder/70/70', 
      coverUrl: '/api/placeholder/300/100',
      membersCount: 432, 
      eventsCount: 0, 
      rating: 0, 
      postsCount: 0, 
      isMember: false 
    }
  ];

  const handleJoinCommunity = () => {
    console.log('Join community');
    // Здесь будет логика вступления в сообщество
  };

  const handleBack = () => {
    console.log('Go back');
    // Здесь будет логика возврата назад
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Назад
        </button>
      </header>
      
      <main>
        <CommunityHeader 
          community={communityData} 
          onJoin={handleJoinCommunity} 
          onBack={handleBack} 
        />
        
        <StatisticsBar 
          membersCount={communityData.membersCount}
          eventsCount={communityData.eventsCount}
          rating={communityData.rating}
          postsCount={communityData.postsCount}
        />
        
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
        
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Ближайшие события</h2>
            <a href="#" className={styles.seeAll}>
              Все события
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
          
          <div className={styles.eventsGrid}>
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
        
        <section className={styles.membersSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Участники</h2>
            <a href="#" className={styles.seeAll}>
              Все участники
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
          
          <div className={styles.membersGrid}>
            {members.map(member => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </section>
        
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
          
          <div className={styles.recommendationGrid}>
            {recommendedCommunities.map(community => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CommunityPage;