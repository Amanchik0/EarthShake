import React from 'react';
import styles from './EventCard.module.css';
import { CommunityEvent } from '../../../types/types';

const EventCard: React.FC<{ event: CommunityEvent }> = ({ event }) => {
  return (
    <div className={styles.eventCard}>
      <div className={styles.eventImg}>
        <img src={event.imageUrl} alt={event.title} />
        <div className={styles.eventDate}>{event.date}</div>
      </div>
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <div className={styles.eventInfo}>
          <div>{event.time}</div>
          <div>{event.participantsCount} участников</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;