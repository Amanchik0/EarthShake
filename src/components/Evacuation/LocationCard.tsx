// src/components/Evacuation/LocationCard.tsx
import React from 'react';
import { Location } from '../../types/types';
import styles from '../../features/Evacuation/EvacuationPage.module.css';

interface LocationCardProps {
  location: Location;
  isEmergencyPoint?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, isEmergencyPoint = false }) => {
  const getTypeIcon = (type: string) => {
    const icons = {
      shelter: '🏠',
      evacuation: '🚁',
      medical: '🏥',
      food: '🍽️',
      transport: '🚌'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      shelter: 'Убежище',
      evacuation: 'Точка эвакуации',
      medical: 'Медицинский пункт',
      food: 'Раздача продуктов',
      transport: 'Транспорт'
    };
    return labels[type as keyof typeof labels] || 'Место';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: '#059669',
      closed: '#dc2626',
      full: '#f59e0b'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: 'Открыто',
      closed: 'Закрыто',
      full: 'Заполнено'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleGetDirections = () => {
    if (location.coordinates) {
      // Используем Google Maps для построения маршрута
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}&travelmode=walking`;
      window.open(url, '_blank');
    } else {
      // Поиск по адресу
      const searchQuery = encodeURIComponent(location.address);
      const url = `https://www.google.com/maps/search/${searchQuery}`;
      window.open(url, '_blank');
    }
  };

  const handleCall = () => {
    if (location.phone) {
      window.location.href = `tel:${location.phone}`;
    }
  };

  return (
    <div className={`${styles.card} ${isEmergencyPoint ? styles.emergencyCard : ''}`}>
      {isEmergencyPoint && (
        <div className={styles.emergencyBadge}>
          🚨 Экстренная точка
        </div>
      )}
      
      <div className={styles.header}>
        <div className={styles.typeIcon}>
          {getTypeIcon(location.type)}
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{location.name}</h3>
          <p className={styles.type}>{getTypeLabel(location.type)}</p>
        </div>
        <div 
          className={styles.status}
          style={{ backgroundColor: getStatusColor(location.status) }}
        >
          {getStatusLabel(location.status)}
        </div>
      </div>
      
      <div className={styles.details}>
        <div className={styles.address}>
          📍 {location.address}
        </div>
        
        {location.workingHours && (
          <div className={styles.hours}>
            🕒 {location.workingHours}
          </div>
        )}
        
        {location.capacity && (
          <div className={styles.capacity}>
            👥 Вместимость: {location.capacity} человек
          </div>
        )}
        
        {location.phone && (
          <div className={styles.phone}>
            📞 {location.phone}
          </div>
        )}
        
        {location.coordinates && (
          <div className={styles.coordinates}>
             {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
          </div>
        )}
      </div>
      
      <div className={styles.actions}>
        <button 
          className={styles.directionsBtn}
          onClick={handleGetDirections}
        >
          🧭 Маршрут
        </button>
        
        {location.phone && (
          <button 
            className={styles.callBtn}
            onClick={handleCall}
          >
            📞 Позвонить
          </button>
        )}
        
        <button className={styles.infoBtn}>
           Подробнее
        </button>
      </div>
      
      {isEmergencyPoint && (
        <div className={styles.emergencyNote}>
          Данная точка назначена службами экстренного реагирования
        </div>
      )}
    </div>
  );
};

export default LocationCard;