import React from 'react';
import { Event } from '../../types/types';

interface EventMainProps {
  event: Event;
}

const EventMain: React.FC<EventMainProps> = ({ event }) => {
  const renderStars = () => {
    const stars = [];
    // можно снаружи опционки 
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div key={i} className="star" style={{ color: i <= (event.rating ?? 0)  ? 'gold' : 'var(--light-gray)' }}>
          ★
        </div>
      );
    }
    return stars;
  };

  return (
    <section className="event-main">
      <div className="event-photo">
        <img src={event.imageUrl} alt="Фото события" />
      </div>
      
      <div className="event-info">
        <h1 className="event-title">{event.title}</h1>
        
        <div className="event-meta">
          <div className="event-date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {event.date}
          </div>
          
          <div className="event-type">
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
        
        <div className="event-description">
          {event.description && event.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <div className="event-location">
          <div className="location-title">Местоположение:</div>
          <div>{event.location}</div>
        </div>
        
        <div className="event-rating">
          {renderStars()}
          <span>({event.rating && event.rating.toFixed(1)} / {event.reviewsCount} оценок)</span>
        </div>
        
        <div className="author-info">
          <div className="author-avatar">
            <img src={event.author.avatarUrl} alt="Автор" />
          </div>
          <div>
            <div><strong>{event.author.name}</strong></div>
            <div style={{ fontSize: '0.8rem' }}>{event.author.role}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventMain;