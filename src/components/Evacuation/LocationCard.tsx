import React from 'react';
import { Location } from '../../types/types';

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const getStatusText = () => {
    switch (location.status) {
      case 'open': return 'Открыто';
      case 'limited': return 'Ограниченный доступ';
      case 'full': return 'Полностью занято';
      default: return '';
    }
  };

  const getProgressClass = () => {
    if (location.capacity < 40) return 'low';
    if (location.capacity < 70) return 'medium';
    return 'high';
  };

  return (
    <div className="location-card">
      <div className={`location-type ${location.type}`}>
        <span>
          {location.type === 'shelter' && 'Убежище'}
          {location.type === 'medical' && 'Медпункт'}
          {location.type === 'food' && 'Центр питания'}
        </span>
        <span className="location-badge">{location.workingHours}</span>
      </div>
      <div className="location-info">
        <div className="location-name">{location.name}</div>
        <div className="location-address">{location.address}</div>
        <div className="location-status">
          <div className={`status-indicator ${location.status}`}></div>
          <div>{getStatusText()}</div>
        </div>
        <div className="location-capacity">
          <div>Заполненность: {location.capacity}%</div>
          <div className="capacity-bar">
            <div className={`capacity-progress ${getProgressClass()}`}></div>
          </div>
        </div>
        <div className="location-actions">
          <button className="action-btn">
            <span>🗺️</span>
            <span>Маршрут</span>
          </button>
          <button className="action-btn">
            <span>ℹ️</span>
            <span>Подробнее</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;