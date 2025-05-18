import React from 'react';
import { EventDetails } from '../../types/event';

interface EventMainProps {
  event: EventDetails;
  styles: any;
}

const EventMain: React.FC<EventMainProps> = ({ event, styles }) => {
  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const renderStars = () => {
    const stars = [];
    const rating = event.score || 0; // Используем score вместо rating
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div key={i} className={styles.star} style={{ color: i <= rating ? 'gold' : 'var(--light-gray)' }}>
          ★
        </div>
      );
    }
    return stars;
  };

  return (
    <section className={styles.eventMain}>
      {event.mediaUrl && (
        <div className={styles.eventPhoto}>
          <img src={event.mediaUrl} alt="Фото события" />
        </div>
      )}
      
      <div className={styles.eventInfo}>
        <h1 className={styles.eventTitle}>{event.title}</h1>
        
        <div className={styles.eventMeta}>
          <div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(event.dateTime)}
          </div>
          
          <div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 010 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            {event.type}
          </div>
        </div>
        
        <div className={styles.eventDescription}>
          {event.description && <p>{event.description}</p>}
          {event.content && <p>{event.content}</p>}
        </div>
        
        <div className={styles.eventLocation}>
          <div className={styles.locationTitle}>Местоположение:</div>
          <div>
            {event.city}
            {event.location && (
              <span>, координаты: {event.location.coordinates.join(', ')}</span>
            )}
          </div>
        </div>
        
        <div className={styles.eventRating}>
          {renderStars()}
          <span>({event.score ? event.score.toFixed(1) : '0.0'} / {event.usersIds?.length || 0} участников)</span>
        </div>
        
        {event.author && (
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              {/* Заглушка для аватара, если нет URL */}
              <div className={styles.avatarPlaceholder}>
                {event.author.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div><strong>{event.author}</strong></div>
              <div style={{ fontSize: '0.8rem' }}>Организатор события</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventMain;