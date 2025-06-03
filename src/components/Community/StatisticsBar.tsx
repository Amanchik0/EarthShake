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
    <div className={styles.statisticsBar}>
      <div className={styles.statItem}>
        <div className={styles.value}>{membersCount.toLocaleString()}</div>
        <div className={styles.label}>Участников</div>
      </div>
      
      <div className={styles.statItem}>
        <div className={styles.value}>{eventsCount}</div>
        <div className={styles.label}>Событий</div>
      </div>
      
      <div className={styles.statItem}>
        <div className={styles.value}>{rating}</div>
        <div className={styles.label}>Рейтинг</div>
      </div>
      
      <div className={styles.statItem}>
        <div className={styles.value}>{postsCount}</div>
        <div className={styles.label}>Публикаций</div>
      </div>
    </div>
  );
};

export default StatisticsBar;