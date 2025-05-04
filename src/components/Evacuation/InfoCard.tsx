import React from 'react';
import { InfoItem } from '../../types/types';
import styles from '../../features/Evacuation/EvacuationPage.module.css';

interface InfoCardProps {
  title: string;
  items: InfoItem[];
}

const InfoCard: React.FC<InfoCardProps> = ({ title, items }) => {
  return (
    <div className={styles.sidebarCard}>
      <div className={styles.sidebarTitle}>{title}</div>
      <div className={styles.infoList}>
        {items.map(item => (
          <div key={item.id} className={styles.infoItem}>
            <div className={styles.infoIcon}>{item.icon}</div>
            <div className={styles.infoContent}>
              <div className={styles.infoTitle}>{item.title}</div>
              <div className={styles.infoText}>{item.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;