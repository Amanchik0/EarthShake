import React from 'react';
import { Event } from '../../types/types';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(event.rating ?? 0);
    const hasHalfStar = (event.rating?? 0 ) % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i}>★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i}>½</span>);
      } else {
        stars.push(<span key={i} style={{ opacity: 0.3 }}>★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="event-card" onClick={handleCardClick}>
      <div className="event-image">
        <img src={event.imageUrl || '/api/placeholder/100/100'} alt={event.title} />
      </div>
      <div className="event-details">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-info"><strong>Дата:</strong> {event.date}</p>
        <p className="event-info"><strong>Место:</strong> {event.location}</p>
        <p className="event-info"><strong>Цена:</strong> {event.price}</p>
        <div className="event-footer">
          <div className="event-rating">
            <div className="rating-stars">{renderStars()}</div>
            <span className="rating-count">({event.reviewsCount})</span>
          </div>
          <button className="primary-btn">Купить билет</button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;