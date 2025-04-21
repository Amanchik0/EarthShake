import React, { useState } from 'react';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileTabs from '../../components/Profile/ProfileTabs';
import EventCard from '../../components/Profile/EventCard';
import CommunityCard from '../../components/Profile/CommunityCard';
import SubscriptionSection from '../../components/Profile/SubscriptionSection';
import './Profie.css'


const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Данные для таба "События"
  const events = [
    {
      title: 'IT-конференция WebDev 2025',
      date: '27 апреля 2025, 10:00',
      participants: '42 участника',
      imageUrl: '/api/placeholder/400/160',
    },
    {
      title: 'Мастер-класс по UX/UI дизайну',
      date: '15 мая 2025, 15:30',
      participants: '18 участников',
      imageUrl: '/api/placeholder/400/160',
    },
    {
      title: 'Встреча сообщества JavaScript',
      date: '3 июня 2025, 19:00',
      participants: '56 участников',
      imageUrl: '/api/placeholder/400/160',
    },
    {
        title: 'Встреча сообщества JavaScript',
        date: '3 июня 2025, 19:00',
        participants: '56 участников',
        imageUrl: '/api/placeholder/400/160',
      },
      {
        title: 'Встреча сообщества JavaScript',
        date: '3 июня 2025, 19:00',
        participants: '56 участников',
        imageUrl: '/api/placeholder/400/160',
      },
      {
        title: 'Встреча сообщества JavaScript',
        date: '3 июня 2025, 19:00',
        participants: '56 участников',
        imageUrl: '/api/placeholder/400/160',
      },
  ];

  // Данные для таба "Сообщества"
  const communities = [
    {
      name: 'Web Developers',
      members: '1.2K участников',
      logoUrl: '/api/placeholder/64/64',
    },
    {
      name: 'UX/UI дизайнеры',
      members: '876 участников',
      logoUrl: '/api/placeholder/64/64',
    },
    {
      name: 'IT Москва',
      members: '2.5K участников',
      logoUrl: '/api/placeholder/64/64',
    },
    {
      name: 'JavaScript',
      members: '1.7K участников',
      logoUrl: '/api/placeholder/64/64',
    },
  ];  
  const handleSubscribe = async () => {
    console.log('Subscription handler triggered');
    // Здесь может быть логика API запроса для оформления подписки
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // События
        return (
          <div className="content-section">
            <h2 className="section-title">Мои события</h2>
            <div className="events-grid">
              {events.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </div>
        );
      case 1: // Сообщества
        return (
          <div className="content-section">
            <h2 className="section-title">Мои сообщества</h2>
            <div className="community-list">
              {communities.map((community, index) => (
                <CommunityCard key={index} {...community} />
              ))}
            </div>
          </div>
        );
      case 2: // Подписка
        return (
          <div className="content-section">
            <h2 className="section-title">Подписка</h2>
            <SubscriptionSection   hasSubscription={false} onSubscribe={handleSubscribe} />
          </div>
        );
    //   case 3: // Настройки
    //     return (
    //       <div className="content-section">
    //         <h2 className="section-title">Настройки профиля</h2>
    //         <div className="settings-content">
    //           <p>Здесь будут настройки вашего профиля</p>
    //           {/* Добавьте форму настроек по необходимости */}
    //         </div>
    //       </div>
    //     );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <ProfileHeader
        name="Александр Иванов"
        username="alex_ivanov"
        email="alex.ivanov@example.com"
        phone="+7 (999) 123-45-67"
        city="Москва"
        registrationDate="15 июня 2023"
      />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {renderTabContent()}
    </div>
  );
};

export default ProfilePage;