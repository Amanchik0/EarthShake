import React from 'react';
import styles from '../../features/Evacuation/EvacuationPage.module.css';

const EmergencyBanner: React.FC = () => {
  const handleCall = () => {
    window.location.href = 'tel:112';
  };

  return (
    <div className={styles.emergencyBanner}>
      <div className={styles.emergencyBannerContent}>
        <h2>Экстренная ситуация?</h2>
        <p>Если вам требуется немедленная помощь, позвоните в службу спасения.</p>
      </div>
      <div className={styles.emergencyNumber}>
        <div>
          <div className={styles.emergencyNumberLabel}>Горячая линия</div>
          <div className={styles.emergencyNumberValue}>112</div>
        </div>
        <button className={`${styles.actionBtn} ${styles.primaryBtn}`} onClick={handleCall}>
          <span>📞</span>
          <span>Позвонить</span>
        </button>
      </div>
    </div>
  );
};

export default EmergencyBanner;