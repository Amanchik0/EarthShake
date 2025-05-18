import React, { useState } from 'react';
import styles from '../../features/Events/EventsListPage/EventsListPage.module.css';
import Map from '../MapComponent'; // Импортируем компонент карты
import { EventDetails } from '../../types/event';
import type { Feature, Polygon } from 'geojson';

interface MapViewProps {
  isFullMap: boolean;
  onToggleFullMap: () => void;
  events: EventDetails[]; // Добавляем тип для событий
}

const MapView: React.FC<MapViewProps> = ({ isFullMap, onToggleFullMap, events }) => {
  const [showAreaSelection, setShowAreaSelection] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Feature<Polygon> | null>(null); // Добавляем состояние

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
      <div className={styles.mapContainer}>
        <Map 
          events={events.map(event => ({
            id: event.id,
            lat: event.lat || 0, // Убедимся, что координаты есть
            lng: event.lng || 0,
            title: event.title,
          }))}
          selectedArea={selectedArea  } // Передаем выбранную область
          onSelectArea={setSelectedArea} // Обновляем состояние при выборе области
          mode="events"
        />
      </div>
    </div>
  );
};

export default MapView;