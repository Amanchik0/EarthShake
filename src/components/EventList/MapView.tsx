import React, { useState } from 'react';
import styles from '../../features/Events/EventsListPage.module.css';

interface MapViewProps {
  isFullMap: boolean;
  onToggleFullMap: () => void;
}

const MapView: React.FC<MapViewProps> = ({ isFullMap, onToggleFullMap }) => {
  const [showAreaSelection, setShowAreaSelection] = useState(false);

  const toggleAreaSelection = () => {
    setShowAreaSelection(!showAreaSelection);
  };

  return (
    <div className={styles.mapView}>
      <div className={styles.mapControls}>
        <button className={styles.mapButton} onClick={onToggleFullMap}>
          {isFullMap ? 'Свернуть карту' : 'Развернуть карту'}
        </button>
        <button className={styles.mapButton} onClick={toggleAreaSelection}>
          {showAreaSelection ? 'Отменить выбор' : 'Выбрать область'}
        </button>
      </div>
      <div className={styles.mapPlaceholder}>
        <img src="/api/placeholder/500/400" alt="Карта событий" />
      </div>
      {showAreaSelection && <div className={styles.areaSelection}></div>}
    </div>
  );
};

export default MapView;