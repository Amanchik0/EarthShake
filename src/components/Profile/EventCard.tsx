import React from 'react';
import { EventCardProps } from '../../types/types';
import styles from '../../features/Profile/profile.module.css';

const EventCard: React.FC<EventCardProps> = ({ title, date, participants, imageUrl }) => {
  return (
    <div className={styles.eventCard}>
      <img src={imageUrl} alt={title} className={styles.eventImage} />
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{title}</h3>
        <p className={styles.eventDate}>{date}</p>
        <div className={styles.eventParticipants}>
          <span>{participants}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;