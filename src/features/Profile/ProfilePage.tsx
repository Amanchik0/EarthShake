import React, { useState } from 'react';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileTabs from '../../components/Profile/ProfileTabs';
import EventCard from '../../components/Profile/EventCard';
import CommunityCard from '../../components/Profile/CommunityCard';
import SubscriptionSection from '../../components/Profile/SubscriptionSection';
import styles from './profile.module.css';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Данные для таба "События"
  const events = [
    {
      title: 'IT-конференция WebDev 2025',
      date: '27 апреля 2025, 10:00',
      participants: '42 участника',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    },
    {
      title: 'Мастер-класс по UX/UI дизайну',
      date: '15 мая 2025, 15:30',
      participants: '18 участников',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    },
    {
      title: 'Встреча сообщества JavaScript',
      date: '3 июня 2025, 19:00',
      participants: '56 участников',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    },
    {
      title: 'Встреча сообщества JavaScript',
      date: '3 июня 2025, 19:00',
      participants: '56 участников',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    },
    {
      title: 'Встреча сообщества JavaScript',
      date: '3 июня 2025, 19:00',
      participants: '56 участников',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    },
    {
      title: 'Встреча сообщества JavaScript',
      date: '3 июня 2025, 19:00',
      participants: '56 участников',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    },
  ];

  // Данные для таба "Сообщества"
  const communities = [
    {
      name: 'Web Developers',
      members: '1.2K участников',
      logoUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    },
    {
      name: 'UX/UI дизайнеры',
      members: '876 участников',
      logoUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    },
    {
      name: 'IT Москва',
      members: '2.5K участников',
      logoUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
    },
    {
      name: 'JavaScript',
      members: '1.7K участников',
      logoUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
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
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Мои события</h2>
            <div className={styles.eventsGrid}>
              {events.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </div>
        );
      case 1: // Сообщества
        return (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Мои сообщества</h2>
            <div className={styles.communityList}>
              {communities.map((community, index) => (
                <CommunityCard key={index} {...community} />
              ))}
            </div>
          </div>
        );
      case 2: // Подписка
        return (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Подписка</h2>
            <SubscriptionSection hasSubscription={false} onSubscribe={handleSubscribe} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
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