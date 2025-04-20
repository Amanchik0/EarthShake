import React from 'react';
import { EventCardProps } from '../../types/types';


const EventCard: React.FC<EventCardProps> = ({ title, date, participants, imageUrl }) => {
  return (
    <div className="event-card">
      <img src={imageUrl} alt={title} className="event-image" />
      <div className="event-content">
        <h3 className="event-title">{title}</h3>
        <p className="event-date">{date}</p>
        <div className="event-participants">
          <span>{participants}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;