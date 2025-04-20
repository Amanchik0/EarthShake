import React from 'react';
import styles from './StatisticsBar.module.css';

interface StatisticsBarProps {
  membersCount: number;
  eventsCount: number;
  rating: number;
  postsCount: number;
}

const StatisticsBar: React.FC<StatisticsBarProps> = ({ 
  membersCount, 
  eventsCount, 
  rating, 
  postsCount 
}) => {
  return (
    <section className={styles.statisticsBar}>
      <div className={styles.statItem}>
        <div className={styles.statValue}>{membersCount}</div>
        <div className={styles.statLabel}>Участников</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statValue}>{eventsCount}</div>
        <div className={styles.statLabel}>Событий</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statValue}>{rating}</div>
        <div className={styles.statLabel}>Рейтинг</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statValue}>{postsCount}</div>
        <div className={styles.statLabel}>Публикаций</div>
      </div>
    </section>
  );
};

export default StatisticsBar;