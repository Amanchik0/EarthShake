import styles from '../../features/Events/EventsListPage.module.css';
import React from 'react';

type ViewMode = 'list' | 'split' | 'map';

interface ViewToggleProps {
  currentMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentMode, onChange }) => {
  return (
    <div className={styles.viewToggle}>
      <button 
        className={`${styles.toggleButton} ${currentMode === 'list' ? styles.active : ''}`} 
        onClick={() => onChange('list')}
      >
        Список
      </button>
      <button 
        className={`${styles.toggleButton} ${currentMode === 'split' ? styles.active : ''}`} 
        onClick={() => onChange('split')}
      >
        Список + Карта
      </button>
      <button 
        className={`${styles.toggleButton} ${currentMode === 'map' ? styles.active : ''}`} 
        onClick={() => onChange('map')}
      >
        Карта
      </button>
    </div>
  );
};

export default ViewToggle;