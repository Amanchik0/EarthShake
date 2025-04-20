import React from 'react';
import { CommunityEvent } from '../../types/types';

interface EventCardProps {
  event: CommunityEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="event-card">
      <div className="event-img">
        <img src={event.imageUrl} alt="Событие" />
        <div className="event-date">{event.date}</div>
      </div>
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-info">
          <div>{event.time}</div>
          <div>{event.participantsCount} участников</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;