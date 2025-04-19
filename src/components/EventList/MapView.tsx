import React, { useState } from 'react';

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
    <div className="map-view">
      <div className="map-controls">
        <button className="map-button" onClick={onToggleFullMap}>
          {isFullMap ? 'Свернуть карту' : 'Развернуть карту'}
        </button>
        <button className="map-button" onClick={toggleAreaSelection}>
          {showAreaSelection ? 'Отменить выбор' : 'Выбрать область'}
        </button>
      </div>
      <div className="map-placeholder">
        <img src="/api/placeholder/500/400" alt="Карта событий" />
      </div>
      {showAreaSelection && <div className="area-selection"></div>}
    </div>
  );
};

export default MapView;