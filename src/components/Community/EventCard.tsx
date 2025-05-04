import React from 'react';
import { CommunityEvent } from '../../types/types';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: CommunityEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className={styles.eventCard}>
      <div className={styles.imgContainer}>
        <img src={event.imageUrl} alt={event.title} />
        <div className={styles.date}>{event.date}</div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        
        <div className={styles.info}>
          <div>{event.time}</div>
          <div>{event.participantsCount} участников</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;