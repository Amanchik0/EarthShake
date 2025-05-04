// tabs/EventsTab.tsx
import React, { useState } from 'react';
import EventModal from './EventModal';
import styles from '../../features/Community/CommunityEditPage.module.css';

const EventsTab: React.FC = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Мастер-класс по живописи",
      date: "25 апреля 2025",
      description: "Научимся основам акварельной техники",
      participants: 24,
      status: "active"
    },
    {
      id: 2,
      title: "Джазовый вечер",
      date: "10 мая 2025",
      description: "Живая музыка и танцы в стиле свинг",
      participants: 42,
      status: "active"
    },
    {
      id: 3,
      title: "Поэтический слэм",
      date: "15 июня 2025",
      description: "Конкурс современной поэзии с призами",
      participants: 18,
      status: "postponed"
    }
  ]);

  const handleAddEvent = (newEvent: any) => {
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    setShowEventModal(false);
  };

  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionTitle}>
        События сообщества
        <button className={styles.button} onClick={() => setShowEventModal(true)}>+ Добавить событие</button>
      </div>
      
      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Поиск событий..." 
          className={styles.input}
        />
        <div className={styles.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <div className={styles.userList}>
      {events.map(event => (
        <div key={event.id} className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.eventDate}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {event.date}
            </div>

            <div className={styles.eventTitle}>
              {event.title}
            </div>

            <div className={styles.eventDescription}>
              {event.description}
            </div>

            <div className={styles.eventDetails}>
              <div className={styles.eventDetail}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {event.participants} участников
              </div>

              <div className={styles.eventDetail}>
                <span className={`${styles.badge} ${event.status === 'active' ? styles.badgeMember : ''}`}>
                  {event.status === 'active' ? 'Активное' : 'Отложенное'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.cardActions}>
            <button className={styles.button}>✏️</button>
            <button className={`${styles.button} ${styles.buttonDanger}`}>❌</button>
          </div>
        </div>
      ))}
      </div>
      
      {showEventModal && (
        <EventModal 
          onClose={() => setShowEventModal(false)} 
          onSave={handleAddEvent} 
        />
      )}
    </div>
  );
};

export default EventsTab;
