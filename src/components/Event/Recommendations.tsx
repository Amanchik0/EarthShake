import React from 'react';
import { RecommendedEvent } from '../../types/types';

interface RecommendationsProps {
  events: RecommendedEvent[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ events }) => {
  return (
    <section className="recommendations">
      <h2 className="section-title">Вам также может понравиться</h2>
      
      <div className="recommendation-cards">
        {events.map((event) => (
          <div key={event.id} className="recommendation-card">
            <div className="card-img">
              <img src={event.imageUrl} alt="Рекомендуемое событие" />
            </div>
            <div className="card-content">
              <h3 className="card-title">{event.title}</h3>
              <div className="card-meta">{event.date} • {event.type}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Recommendations;