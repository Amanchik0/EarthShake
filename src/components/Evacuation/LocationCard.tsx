import React from 'react';
import { Location } from '../../types/types';
import styles from '../../features/Evacuation/EvacuationPage.module.css';

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

  const getTypeClass = () => {
    switch (location.type) {
      case 'shelter': return styles.shelterType;
      case 'medical': return styles.medicalType;
      case 'food': return styles.foodType;
      default: return '';
    }
  };

  const getStatusClass = () => {
    switch (location.status) {
      case 'open': return styles.openStatus;
      case 'limited': return styles.limitedStatus;
      case 'full': return styles.fullStatus;
      default: return '';
    }
  };

  const getProgressClass = () => {
    if (location.capacity < 40) return styles.lowCapacity;
    if (location.capacity < 70) return styles.mediumCapacity;
    return styles.highCapacity;
  };

  return (
    <div className={styles.locationCard}>
      <div className={`${styles.locationType} ${getTypeClass()}`}>
        <span>
          {location.type === 'shelter' && 'Убежище'}
          {location.type === 'medical' && 'Медпункт'}
          {location.type === 'food' && 'Центр питания'}
        </span>
        <span className={styles.locationBadge}>{location.workingHours}</span>
      </div>
      <div className={styles.locationInfo}>
        <div className={styles.locationName}>{location.name}</div>
        <div className={styles.locationAddress}>{location.address}</div>
        <div className={styles.locationStatus}>
          <div className={`${styles.statusIndicator} ${getStatusClass()}`}></div>
          <div>{getStatusText()}</div>
        </div>
        <div className={styles.locationCapacity}>
          <div>Заполненность: {location.capacity}%</div>
          <div className={styles.capacityBar}>
            <div className={`${styles.capacityProgress} ${getProgressClass()}`}></div>
          </div>
        </div>
        <div className={styles.locationActions}>
          <button className={styles.actionBtn}>
            <span>🗺️</span>
            <span>Маршрут</span>
          </button>
          <button className={styles.actionBtn}>
            <span>ℹ️</span>
            <span>Подробнее</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;