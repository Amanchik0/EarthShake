import React from 'react';

interface EventHeaderProps {
  onBack: () => void;
  tag: string;
  styles: any; 
}

const EventHeader: React.FC<EventHeaderProps> = ({ onBack, tag, styles }) => {
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