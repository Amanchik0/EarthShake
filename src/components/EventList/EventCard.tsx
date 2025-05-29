// components/EventList/EventCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../features/Events/EventsListPage/EventsListPage.module.css';
import { EventDetails } from '../../types/event';

interface EventCardProps {
  event: EventDetails;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const renderStars = () => {
    const stars = [];
    const rating = event.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i}>★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i}>☆</span>);
      } else {
        stars.push(<span key={i} style={{ opacity: 0.3 }}>★</span>);
      }
    }
    return stars;
  };

  const getImageUrl = () => {
    if (!event.imageUrl) {
      return '/api/placeholder/120/90';
    }
    
    // If it's a localhost URL, keep it as is
    if (event.imageUrl.startsWith('http://localhost:8090') || 
        event.imageUrl.startsWith('https://')) {
      return event.imageUrl;
    }
    
    // If it's a relative path, prepend the base URL
    if (event.imageUrl.startsWith('/api/')) {
      return `http://localhost:8090${event.imageUrl}`;
    }
    
    return event.imageUrl;
  };

  const getEventTypeIcon = () => {
    if (event.tag === 'emergency') {
      return '🚨';
    }
    
    // Show icon based on category
    const categoryIcons: Record<string, string> = {
      'sport': '⚽',
      'soccer': '⚽',
      'музыка': '🎵',
      'образование': '📚',
      'развлечения': '🎪',
      'искусство': '🎨',
      'спорт': '⚽'
    };
    
    const primaryTag = event.type || (event.tags && event.tags.length > 0 ? event.tags[0] : '');
    return categoryIcons[primaryTag] || '📌';
  };

  const getParticipantsCount = () => {
    if (!event.usersIds || !Array.isArray(event.usersIds)) return 0;
    return event.usersIds.length;
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.image}>
        <img 
          src={getImageUrl()} 
          alt={event.title}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTIwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA0NUw2MCA1NUw3MCA0NUg1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
          }}
        />
      </div>
      
      <div className={styles.details}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{event.title}</h3>
          <span className={styles.eventIcon}>{getEventTypeIcon()}</span>
        </div>
        
        <div className={styles.eventInfo}>
          <p className={styles.info}>
            <strong>📅 Дата:</strong> {event.date}
          </p>
          <p className={styles.info}>
            <strong>📍 Место:</strong> {event.city}
          </p>
          {event.metadata && event.metadata.address && (
            <p className={styles.info}>
              <strong>🏠 Адрес:</strong> {event.metadata.address}
            </p>
          )}
          <p className={styles.info}>
            <strong>👤 Автор:</strong> {typeof event.author === 'string' ? event.author : event.author?.name}
          </p>
          
          {event.description && (
            <p className={styles.description}>
              {typeof event.description === 'string' && event.description.length > 120 
                ? `${event.description.substring(0, 120)}...` 
                : Array.isArray(event.description) 
                  ? event.description.join(', ')
                  : event.description}
            </p>
          )}
        </div>
        
        <div className={styles.footer}>
          <div className={styles.leftSection}>
            {event.rating && event.rating > 0 && (
              <div className={styles.rating}>
                <div className={styles.stars}>{renderStars()}</div>
                <span className={styles.ratingNumber}>
                  {event.rating.toFixed(1)}
                </span>
              </div>
            )}
            
            {event.commentsCount && event.commentsCount > 0 && (
              <span className={styles.comments}>
                💬 {event.commentsCount}
              </span>
            )}
          </div>
          
          <div className={styles.rightSection}>
            {getParticipantsCount() > 0 && (
              <span className={styles.participants}>
                👥 {getParticipantsCount()}
              </span>
            )}
            
            {event.tag === 'emergency' && (
              <span className={styles.emergencyBadge}>
                Экстренное
              </span>
            )}
            
            <button 
              className={styles.button}
              onClick={(e) => {
                e.stopPropagation();
                console.log('View event:', event.id);
              }}
            >
              {getParticipantsCount() > 0 ? 'Присоединиться' : 'Подробнее'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;