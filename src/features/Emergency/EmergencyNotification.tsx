import React from 'react';
import styles from './EmergencyNotification.module.css';
import { useNavigate } from 'react-router-dom';

const EmergencyNotification: React.FC = () => {
const navigate = useNavigate()
  const handleRefClick = () => {
    navigate('/reference');
  };
  const handleEvacuationClick = () => {
    navigate('/evacuation');
  };
  console.log('====================================');
  console.log('as');
  console.log('====================================');
  return (
    <div className={styles.alertContainer}>
      <div className={styles.alertHeader}>
        <div className={styles.alertIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h1 className={styles.alertTitle}>Внимание! Чрезвычайная ситуация</h1>
        <p className={styles.alertSubtitle}>Требуется немедленная эвакуация из здания</p>
        <div className={styles.alertTime}>19 апреля 2025 г. • 14:30</div>
      </div>
      
      <div className={styles.alertContent}>
        <div className={styles.alertMessage}>
          <p>В здании обнаружено задымление. Всем сотрудникам и посетителям необходимо немедленно покинуть помещение, используя ближайший безопасный выход согласно плану эвакуации.</p>
          <p>Пожалуйста, сохраняйте спокойствие и следуйте инструкциям персонала.</p>
        </div>
        
        <div className={styles.guidelines}>
          <h3>Правила эвакуации:</h3>
          <ul>
            <li>Сохраняйте спокойствие</li>
            <li>Не используйте лифты</li>
            <li>Двигайтесь к ближайшему выходу</li>
            <li>Помогайте тем, кому нужна помощь</li>
            <li>Не возвращайтесь в здание до специального оповещения</li>
            <li>Соберитесь в обозначенной зоне безопасности</li>
          </ul>
        </div>
        
        <div className={styles.actionButtons}>
          <button onClick={handleRefClick}
            className={`${styles.actionButton} ${styles.evacuationMapBtn}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            <span>План эвакуации из здания</span>
            <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          
          <button onClick ={handleEvacuationClick} className={`${styles.actionButton} ${styles.evacuationPointsBtn}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Места сбора для эвакуации</span>
            <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.footer}>
        <p>Система оповещения о ЧС • Экстренные службы: 112</p>
      </div>
    </div>
  );
};

export default EmergencyNotification;