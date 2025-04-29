import React from 'react';
import { RecommendedEvent } from '../../../types/types';

interface RecommendationsProps {
  events: RecommendedEvent[];
  styles: any;
}

const Recommendations: React.FC<RecommendationsProps> = ({ events, styles }) => {
  return (
    <section className={styles.recommendations}>
      <h2 className={styles.sectionTitle}>Вам также может понравиться</h2>
      
      <div className={styles.recommendationCards}>
        {events.map((event) => (
          <div key={event.id} className={styles.recommendationCard}>
            <div className={styles.cardImg}>
              <img src={event.imageUrl} alt="Рекомендуемое событие" />
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