import React, { useState } from 'react';
import styles from '../../features/Events/EventsListPage/EventsListPage.module.css';
import Map from '../MapComponent'; // Импортируем компонент карты
import { EventDetails } from '../../types/event';
import type { Feature, Polygon } from 'geojson';

interface MapViewProps {
  isFullMap: boolean;
  onToggleFullMap: () => void;
  events: EventDetails[]; 
  selectedEventId?: string | null; // Добавляем новый проп
  onEventSelect?: (eventId: string | null) => void; // Добавляем новый проп
}

const MapView: React.FC<MapViewProps> = ({ 
  isFullMap, 
  onToggleFullMap, 
  events,
  selectedEventId = null,
  onEventSelect
}) => {
  const [showAreaSelection, setShowAreaSelection] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Feature<Polygon> | null>(null);

  const toggleAreaSelection = () => {
    setShowAreaSelection(!showAreaSelection);
  };

  // Обработка выбора события на карте
  const handleEventSelect = (eventId: string | null) => {
    console.log('🗺️ MapView: Выбрано событие на карте:', eventId);
    if (onEventSelect) {
      onEventSelect(eventId);
    }
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
        
        {/* Показываем информацию о выбранном событии */}
        {selectedEventId && (
          <div className={styles.selectedEventMapInfo}>
            {(() => {
              const selectedEvent = events.find(e => e.id === selectedEventId);
              return selectedEvent ? (
                <div className={styles.mapEventBanner}>
                  <span className={styles.eventTitle}>
                    📍 {selectedEvent.title}
                  </span>
                  <span className={styles.eventLocation}>
                    {selectedEvent.city}
                  </span>
                  <button 
                    onClick={() => window.location.href = `/events/${selectedEventId}`}
                    className={styles.viewEventMapButton}
                  >
                    Подробнее
                  </button>
                  <button 
                    onClick={() => handleEventSelect(null)}
                    className={styles.clearMapSelectionButton}
                  >
                    ✕
                  </button>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
      
      <div className={styles.mapContainer}>
        <Map 
          events={events.map(event => ({
            id: event.id,
            lat: event.lat || 0,
            lng: event.lng || 0,
            title: event.title,
            tag: event.tag, // Передаем тип события
            city: event.city,
            rating: event.rating,
            description: event.description,
          }))}
          selectedArea={selectedArea}
          onSelectArea={setSelectedArea}
          selectedEventId={selectedEventId} // Передаем выбранное событие
          onEventSelect={handleEventSelect} // Передаем обработчик выбора
          mode="events"
        />
      </div>
    </div>
  );
};

export default MapView;