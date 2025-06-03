// components/Community/EventCard.tsx
import React from 'react';
import { CommunityEvent } from '../../types/community';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: CommunityEvent;
  onClick?: (eventId: string) => void; // Добавляем опциональный обработчик клика
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(event.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className={`${styles.eventCard} ${onClick ? styles.clickable : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Перейти к событию ${event.title}` : undefined}
    >
      <div className={styles.eventImage}>
        <img 
          src={event.imageUrl} 
          alt={event.title}
          loading="lazy"
        />
        {event.eventType === 'EMERGENCY' && (
          <div className={styles.emergencyBadge}>
            🚨 Экстренное
          </div>
        )}
      </div>
      
      <div className={styles.eventContent}>
        <div className={styles.eventDate}>
          <span className={styles.date}>{event.date}</span>
          <span className={styles.time}>{event.time}</span>
        </div>
        
        <h3 className={styles.eventTitle}>{event.title}</h3>
        
        {event.description && (
          <p className={styles.eventDescription}>
            {event.description.length > 100 
              ? `${event.description.substring(0, 100)}...` 
              : event.description
            }
          </p>
        )}
        
        <div className={styles.eventMeta}>
          <div className={styles.participants}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{event.participantsCount} участников</span>
          </div>
          
          {event.location && (
            <div className={styles.location}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{event.location.length > 30 ? `${event.location.substring(0, 30)}...` : event.location}</span>
            </div>
          )}
        </div>
        
        {event.tags && event.tags.length > 0 && (
          <div className={styles.eventTags}>
            {event.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className={styles.moreTags}>+{event.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
      
      {onClick && (
        <div className={styles.clickHint}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};

export default EventCard;