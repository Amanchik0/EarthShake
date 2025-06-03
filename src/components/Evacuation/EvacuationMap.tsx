import React from 'react';
import { Location } from '../../types/types';
import styles from '../../features/Evacuation/EvacuationPage.module.css';

interface EvacuationMapProps {
  locations: Location[];
}

const EvacuationMap: React.FC<EvacuationMapProps> = ({ locations }) => {
  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <div className={styles.mapTitle}>Карта эвакуационных пунктов</div>
        <div className={styles.mapActions}>
          <button className={styles.actionBtn}>
            <span>📍</span>
            <span>Моё местоположение</span>
          </button>
          <button className={styles.actionBtn}>
            <span></span>
            <span>Обновить</span>
          </button>
        </div>
      </div>
      
      <div className={styles.mapArea}>
        <img src="/api/placeholder/1200/400" alt="Карта эвакуационных пунктов" />
        {/* Маркеры можно добавить динамически на основе locations */}
      </div>
      
      <div className={styles.mapLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.shelterColor}`}></div>
          <div>Убежища</div>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.medicalColor}`}></div>
          <div>Медпункты</div>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.foodColor}`}></div>
          <div>Центры питания</div>
        </div>
      </div>
    </div>
  );
};

export default EvacuationMap;