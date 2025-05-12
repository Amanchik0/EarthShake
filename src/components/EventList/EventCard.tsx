import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../types/types';
import styles from '../../features/Events/EventsListPage.module.css';
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
    const fullStars = Math.floor(event.rating ?? 0);
    const hasHalfStar = (event.rating ?? 0) % 1 >= 0.5;

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
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.image}>
        <img src={event.imageUrl || '/api/placeholder/100/100'} alt={event.title} />
      </div>
      <div className={styles.details}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.info}><strong>Дата:</strong> {event.date}</p>
        <p className={styles.info}><strong>Место:</strong> {event.location}</p>
        <p className={styles.info}><strong>Цена:</strong> {event.price}</p>
        <div className={styles.footer}>
          <div className={styles.rating}>
            <div className={styles.stars}>{renderStars()}</div>
            <span className={styles.count}>({event.reviewsCount})</span>
          </div>
          <button className={styles.button}>Купить билет</button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;