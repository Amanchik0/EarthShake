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
import './CommunityPage.css';

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
    avatarUrl: '/api/placeholder/150/150',
    membersCount: 1243,
    eventsCount: 56,
    rating: 4.8,
    postsCount: 132,
    isMember: false
  };

  // Администраторы
  const admins: Admin[] = [
    { id: '1', name: 'Дильназ Сагындык', role: 'Создатель', avatarUrl: '/api/placeholder/50/50' },
    { id: '2', name: 'somebody', role: 'Модератор', avatarUrl: '/api/placeholder/50/50' },
    { id: '3', name: 'кто то ', role: 'Администратор', avatarUrl: '/api/placeholder/50/50' }
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
    <div className="container">
      <header className="page-header">
        <button className="back-button" onClick={handleBack}>
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
        
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Администраторы</h2>
          </div>
          
          <div className="admin-list">
            {admins.map(admin => (
              <AdminCard key={admin.id} admin={admin} />
            ))}
          </div>
        </section>
        
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Ближайшие события</h2>
            <a href="#" className="see-all">
              Все события
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
          
          <div className="events-grid">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
        
        <section className="members-section">
          <div className="section-header">
            <h2 className="section-title">Участники</h2>
            <a href="#" className="see-all">
              Все участники
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
          
          <div className="members-grid">
            {members.map(member => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </section>
        
        <section className="recommendations">
          <div className="section-header">
            <h2 className="section-title">Рекомендуемые сообщества</h2>
            <a href="#" className="see-all">
              Все рекомендации
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
          
          <div className="recommendation-grid">
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