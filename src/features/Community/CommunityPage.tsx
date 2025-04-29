import React from 'react';
import CommunityHeader from '../../components/Community/CommunityHeader';
import StatisticsBar from '../../components/Community/StatisticsBar';
import AdminCard from '../../components/Community/AdminCard';
import EventCard from '../../components/Community/EventCard';
import MemberItem from '../../components/Community/MemberItem';
import CommunityCard from '../../components/Community/CommunityCard';
import { 
  Community, 
  Admin, 
  CommunityEvent, 
  Member 
} from '../../types/types';
import styles from './CommunityPage.module.css';

const CommunityPage: React.FC = () => {
  // TODO апи доставать 
  // тут комьюнити 
  const communityData: Community = {
    id: '1',
    name: 'Название сообщества',
    location: 'Good persons',
    createdAt: '15 января 2025',
    description: [
      'Здесь размещается описание сообщества. Оно может включать в себя информацию о целях и задачах сообщества, его истории, правилах участия и других важных аспектах. Описание может быть довольно подробным и содержать несколько абзацев текста.',
      'Второй абзац с дополнительной информацией о сообществе и его деятельности.'
    ],
    avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=',
    membersCount: 1243,
    eventsCount: 56,
    rating: 4.8,
    postsCount: 132,
    isMember: false
  };

  // Администраторы
  const admins: Admin[] = [
    { id: '1', name: 'Дильназ Сагындык', role: 'Создатель', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '2', name: 'somebody', role: 'Модератор', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '3', name: 'кто то ', role: 'Администратор', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' }
  ];

  // События
  const events: CommunityEvent[] = [
    { id: '1', title: 'Название первого события', date: '23 Апр', time: '18:00', participantsCount: 123, imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1' },
    { id: '2', title: 'Название второго события', date: '25 Апр', time: '19:30', participantsCount: 78, imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1' },
    { id: '3', title: 'Название третьего события', date: '30 Апр', time: '12:00', participantsCount: 215, imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1' }
  ];

  // Участники
  const members: Member[] = [
    { id: '1', name: 'Иван', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '2', name: 'Мария', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '3', name: 'Александр', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '4', name: 'Екатерина', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '5', name: 'Сергей', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '6', name: 'Анна', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '7', name: 'Дмитрий', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '8', name: 'Ольга', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '9', name: 'Андрей', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=' },
    { id: '10', name: 'Юлия', avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk='} ];

  // Рекомендуемые сообщества
  const recommendedCommunities: Community[] = [
    { 
      id: '1', 
      name: 'Название сообщества 1', 
      location: 'Москва', 
      createdAt: '', 
      description: [], 
      avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=', 
      coverUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
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
      avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=', 
      coverUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
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
      avatarUrl: 'https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=', 
      coverUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
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