import React from 'react';
import { Location } from '../../types/types';

interface EvacuationMapProps {
  locations: Location[];
}

const EvacuationMap: React.FC<EvacuationMapProps> = ({ locations }) => {
  return (
    <div className="map-container">
      <div className="map-header">
        <div className="map-title">Карта эвакуационных пунктов</div>
        <div className="map-actions">
          <button className="action-btn">
            <span>📍</span>
            <span>Моё местоположение</span>
          </button>
          <button className="action-btn">
            <span>🔄</span>
            <span>Обновить</span>
          </button>
        </div>
      </div>
      
      <div className="map-area">
        <img src="/api/placeholder/1200/400" alt="Карта эвакуационных пунктов" />
        {/* Маркеры можно добавить динамически на основе locations */}
      </div>
      
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color shelter"></div>
          <div>Убежища</div>
        </div>
        <div className="legend-item">
          <div className="legend-color medical"></div>
          <div>Медпункты</div>
        </div>
        <div className="legend-item">
          <div className="legend-color food"></div>
          <div>Центры питания</div>
        </div>
      </div>
    </div>
  );
};

export default EvacuationMap;