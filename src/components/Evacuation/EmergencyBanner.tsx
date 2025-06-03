// src/components/Evacuation/EmergencyBanner.tsx
import React from 'react';
import { EmergencyResponse, EMERGENCY_TYPE_LABELS, EMERGENCY_TYPE_ICONS } from '../../types/emergencyTypes';
import styles from '../../features/Evacuation/EvacuationPage.module.css';

interface EmergencyBannerProps {
  emergencyData?: EmergencyResponse | null;
}

const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ emergencyData }) => {
  const currentEvent = emergencyData?.event?.[0];
  
  if (!currentEvent) {
    return (
      <div className={styles.banner}>
        <div className={styles.content}>
          <div className={styles.icon}>⚠️</div>
          <div className={styles.text}>
            <h3>Информация о безопасности</h3>
            <p>Актуальная информация о мерах безопасности и эвакуации</p>
          </div>
        </div>
      </div>
    );
  }

  const emergencyType = currentEvent.emergencyType;
  const emergencyIcon = EMERGENCY_TYPE_ICONS[emergencyType];
  const emergencyLabel = EMERGENCY_TYPE_LABELS[emergencyType];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Сейчас';
    }
  };

  const getUrgencyLevel = () => {
    const highUrgencyTypes = ['RADIATION_LEAK', 'CHEMICAL_SPILL', 'TSUNAMI', 'TERROR_ATTACK', 'EXPLOSION'];
    const mediumUrgencyTypes = ['EARTHQUAKE', 'FIRE', 'FLOOD', 'VOLCANO'];
    
    if (highUrgencyTypes.includes(emergencyType)) return 'critical';
    if (mediumUrgencyTypes.includes(emergencyType)) return 'high';
    return 'medium';
  };

  const urgencyLevel = getUrgencyLevel();

  return (
    <div className={`${styles.banner} ${styles[urgencyLevel]}`}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <div className={styles.icon}>{emergencyIcon}</div>
          <div className={styles.pulse}></div>
        </div>
        
        <div className={styles.text}>
          <h3>{emergencyLabel}</h3>
          <p>{currentEvent.about}</p>
          <div className={styles.meta}>
            <span className={styles.location}>📍 {currentEvent.city}</span>
            <span className={styles.time}>🕒 {formatDate(currentEvent.date)}</span>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.actionBtn}>
            📞 Экстренные службы
          </button>
        </div>
      </div>
      
      <div className={styles.progress}>
        <div className={styles.progressBar}></div>
      </div>
    </div>
  );
};

export default EmergencyBanner;