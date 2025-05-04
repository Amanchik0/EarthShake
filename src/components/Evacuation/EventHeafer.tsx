import React from 'react';
import styles from '../../features/Evacuation/EvacuationPage.module.css';

interface EventHeaderProps {
  onBack: () => void;
  tag: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({ onBack, tag }) => {
  return (
    <header className={styles.header}>
      <button className={styles.backButton} onClick={onBack}>
        &larr; Назад
      </button>
      <div className={`${styles.eventTag} ${tag === 'emergency' ? styles.emergencyTag : ''}`}>
        {tag === 'emergency' ? 'Экстренное' : 'Событие'}
      </div>
    </header>
  );
};

export default EventHeader;