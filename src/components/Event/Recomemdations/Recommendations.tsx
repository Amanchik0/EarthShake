import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecommendedEvent } from '../../../types/event';

interface RecommendationsProps {
  events: RecommendedEvent[];
  styles: any;
}

const Recommendations: React.FC<RecommendationsProps> = ({ events, styles }) => {
  const navigate = useNavigate();

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  if (events.length === 0) {
    return (
      <section className={styles.recommendations}>
        <h2 className={styles.sectionTitle}>Вам также может понравиться</h2>
        <div className={styles.noRecommendations}>
          <p>Рекомендации загружаются...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.recommendations}>
      <h2 className={styles.sectionTitle}>Вам также может понравиться</h2>
      
      <div className={styles.recommendationCards}>
        {events.map((event) => (
          <div 
            key={event.id} 
            className={styles.recommendationCard}
            onClick={() => handleEventClick(event.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.cardImg}>
              <img 
                src={event.imageUrl} 
                alt={`Рекомендуемое событие: ${event.title}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/200/150';
                }}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{event.title}</h3>
              <div className={styles.cardMeta}>{event.date} • {event.type}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Recommendations;