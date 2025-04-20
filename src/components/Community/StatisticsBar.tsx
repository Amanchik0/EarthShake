import React from 'react'; 
import {StatisticsBarProps} from '../../types/types'
// interface StatisticsBarProps {
//   membersCount: number;
//   eventsCount: number;
//   rating: number;
//   postsCount: number;
// }

const StatisticsBar: React.FC<StatisticsBarProps> = ({ 
  membersCount, 
  eventsCount, 
  rating, 
  postsCount 
}) => {
  return (
    <section className="statistics-bar">
      <div className="stat-item">
        <div className="stat-value">{membersCount.toLocaleString()}</div>
        <div className="stat-label">Участников</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{eventsCount}</div>
        <div className="stat-label">Событий</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{rating}</div>
        <div className="stat-label">Рейтинг</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{postsCount}</div>
        <div className="stat-label">Публикаций</div>
      </div>
    </section>
  );
};

export default StatisticsBar;