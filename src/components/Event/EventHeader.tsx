import React from 'react';

interface EventHeaderProps {
  onBack: () => void;
  eventType: 'REGULAR' | 'EMERGENCY';  
  styles: any;

}

const EventHeader: React.FC<EventHeaderProps> = ({ onBack, eventType, styles}) => {
  return (
    <header className={styles.header}>
      <button className={styles.backButton} onClick={onBack}>
        ← Назад
      </button>
      <div className={`${styles.eventTag} ${eventType === 'EMERGENCY' ? styles.emergencyTag : ''}`}>
        {eventType === 'EMERGENCY' ? '🚨 Экстренное' : '📅 Событие'}
      </div>
    </header>
  );
};

export default EventHeader;