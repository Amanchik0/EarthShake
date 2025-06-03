// src/components/EmergencyStatus/EmergencyDebugInfo.tsx
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { EmergencyResponse } from '../../types/emergencyTypes';
import styles from './EmergencyDebugInfo.module.css';

interface EmergencyDebugInfoProps {
  isEmergency: boolean;
  emergencyData: EmergencyResponse | null;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
  onForceCheck: () => void;
}

const EmergencyDebugInfo: React.FC<EmergencyDebugInfoProps> = ({
  isEmergency,
  emergencyData,
  isLoading,
  error,
  lastChecked,
  onForceCheck
}) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // Показываем только в режиме разработки
  if (process.env.NODE_ENV !== 'development') return null;

  const formatTime = (date: Date | null) => {
    if (!date) return 'Никогда';
    return date.toLocaleTimeString('ru-RU');
  };

  const getNextCheckTime = () => {
    if (!lastChecked) return 'Неизвестно';
    const nextCheck = new Date(lastChecked.getTime() + 15000);
    return nextCheck.toLocaleTimeString('ru-RU');
  };

  return (
    <div className={styles.debugPanel}>
      <button 
        className={styles.toggleBtn}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        🐛 Debug Emergency System {isExpanded ? '▲' : '▼'}
      </button>
      
      {isExpanded && (
        <div className={styles.debugContent}>
          <div className={styles.section}>
            <h4>🔧 Системная информация</h4>
            <div className={styles.info}>
              <span>Пользователь:</span>
              <span>{user ? `${user.username} (${user.city})` : 'Не авторизован'}</span>
            </div>
            <div className={styles.info}>
              <span>API URL:</span>
              <span>http://localhost:8090/api/events/emergency/{user?.city || 'Almaty'}</span>
            </div>
            <div className={styles.info}>
              <span>Последняя проверка:</span>
              <span>{formatTime(lastChecked)}</span>
            </div>
            <div className={styles.info}>
              <span>Следующая проверка:</span>
              <span>{getNextCheckTime()}</span>
            </div>
          </div>

          <div className={styles.section}>
            <h4>📊 Статус системы</h4>
            <div className={styles.info}>
              <span>Режим ЧС:</span>
              <span className={isEmergency ? styles.active : styles.inactive}>
                {isEmergency ? '🚨 АКТИВЕН' : '✅ ОТКЛЮЧЕН'}
              </span>
            </div>
            <div className={styles.info}>
              <span>Загрузка:</span>
              <span>{isLoading ? ' Да' : '⏸️ Нет'}</span>
            </div>
            <div className={styles.info}>
              <span>Ошибка:</span>
              <span className={error ? styles.error : styles.success}>
                {error || '✅ Нет ошибок'}
              </span>
            </div>
            <div className={styles.info}>
              <span>События ЧС:</span>
              <span>{emergencyData?.event?.length || 0}</span>
            </div>
            <div className={styles.info}>
              <span>Справочная информация:</span>
              <span>{emergencyData?.referenceInfo?.length || 0}</span>
            </div>
          </div>

          {emergencyData && (
            <div className={styles.section}>
              <h4>📋 Данные ЧС</h4>
              <div className={styles.jsonData}>
                <pre>{JSON.stringify(emergencyData, null, 2)}</pre>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button 
              className={styles.actionBtn}
              onClick={onForceCheck}
              disabled={isLoading}
            >
              {isLoading ? ' Проверка...' : ' Принудительная проверка'}
            </button>
            
            <button 
              className={styles.actionBtn}
              onClick={() => {
                const city = user?.city || 'Almaty';
                const url = `http://localhost:8090/api/events/emergency/${city}`;
                window.open(url, '_blank');
              }}
            >
              🌐 Открыть API в браузере
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyDebugInfo;