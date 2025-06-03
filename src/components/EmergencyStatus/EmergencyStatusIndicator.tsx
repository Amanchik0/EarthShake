import React from 'react';
import { useAuth } from '../auth/AuthContext';
import styles from './EmergencyStatusIndicator.module.css';

interface EmergencyStatusIndicatorProps {
  isEmergency: boolean;
  isLoading: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const EmergencyStatusIndicator: React.FC<EmergencyStatusIndicatorProps> = ({
  isEmergency,
  isLoading,
  error,
  onRefresh
}) => {
  const { user } = useAuth();
  
  // Не показываем индикатор если нет ЧС и нет ошибки
  if (!isEmergency && !error) return null;

  const getStatusText = () => {
    const city = user?.city || 'Almaty';
    
    if (isLoading) return `Проверка статуса экстренной ситуации (${city})...`;
    if (isEmergency) return `Режим чрезвычайной ситуации активен в г. ${city}`;
    if (error) return `Ошибка связи с сервером экстренных оповещений (${city})`;
    return '';
  };

  const getStatusClass = () => {
    if (isEmergency) return styles.emergency;
    if (error) return styles.error;
    return styles.normal;
  };

  return (
    <div className={`${styles.statusBar} ${getStatusClass()}`}>
      <div className={styles.statusContent}>
        {isLoading && (
          <div className={styles.loader} />
        )}
        
        {!isLoading && (isEmergency || error) && (
          <div className={styles.icon}>
            {isEmergency ? '🚨' : '⚠️'}
          </div>
        )}
        
        <span className={styles.statusText}>
          {getStatusText()}
        </span>
        
        {error && onRefresh && !isLoading && (
          <button 
            onClick={onRefresh} 
            className={styles.refreshBtn}
            aria-label="Обновить статус"
          >
             Обновить
          </button>
        )}
        
        {isEmergency && (
          <div className={styles.emergencyActions}>
            <span className={styles.separator}>•</span>
            <a href="/emergency" className={styles.emergencyLink}>
              Подробнее
            </a>
          </div>
        )}
        
        {user && (
          <div className={styles.userInfo}>
            <span className={styles.separator}>•</span>
            <span className={styles.username}>
              {user.username} ({user.city})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyStatusIndicator;