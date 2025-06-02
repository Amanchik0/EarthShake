// src/features/Emergency/EmergencyNotification.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EmergencyResponse, 
  EMERGENCY_TYPE_LABELS, 
  EMERGENCY_TYPE_ICONS, 
  EMERGENCY_TYPE_COLORS,
  EmergencyType 
} from '../../types/emergencyTypes';
import styles from './EmergencyNotification.module.css';

interface EmergencyNotificationProps {
  emergencyData?: EmergencyResponse | null;
}

const EmergencyNotification: React.FC<EmergencyNotificationProps> = ({ emergencyData }) => {
  const navigate = useNavigate();

  const handleRefClick = () => {
    navigate('/reference');
  };

  const handleEvacuationClick = () => {
    navigate('/evacuation');
  };

  const handleSupportClick = () => {
    navigate('/support');
  };

  // Получаем первое событие для отображения
  const currentEvent = emergencyData?.event?.[0];
  const referenceInfo = emergencyData?.referenceInfo?.[0];

  const getEmergencyTypeText = (type: EmergencyType) => {
    return EMERGENCY_TYPE_LABELS[type] || 'Чрезвычайная ситуация';
  };

  const getEmergencyIcon = (type: EmergencyType) => {
    return EMERGENCY_TYPE_ICONS[type] || '⚠️';
  };

  const getEmergencyColor = (type: EmergencyType) => {
    return EMERGENCY_TYPE_COLORS[type] || '#dc2626';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Сейчас';
    }
  };

  const defaultInstructions = [
    'Сохраняйте спокойствие',
    'Следуйте указаниям служб экстренного реагирования',
    'Не используйте лифты при эвакуации',
    'Двигайтесь к ближайшему безопасному выходу',
    'Помогайте тем, кому нужна помощь',
    'Не возвращайтесь в опасную зону до специального оповещения'
  ];

  const emergencyType = currentEvent?.emergencyType || 'OTHER';
  const emergencyColor = getEmergencyColor(emergencyType);

  return (
    <div className={styles.alertContainer}>
      <div 
        className={styles.alertHeader}
        style={{ borderTopColor: emergencyColor }}
      >
        <div 
          className={styles.alertIcon}
          style={{ color: emergencyColor }}
        >
          <div className={styles.emergencyIcon}>
            {getEmergencyIcon(emergencyType)}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        
        <h1 className={styles.alertTitle}>
          Внимание! {getEmergencyTypeText(emergencyType)}
        </h1>
        
        <p className={styles.alertSubtitle}>
          {currentEvent?.about || 'Объявлен режим чрезвычайной ситуации'}
        </p>
        
        <div className={styles.alertTime}>
          {currentEvent ? formatDate(currentEvent.date) : 'Сейчас'}
        </div>

        {currentEvent?.city && (
          <div className={styles.alertLocation}>
            📍 {currentEvent.city}
          </div>
        )}
      </div>
      
      <div className={styles.alertContent}>
        <div className={styles.alertMessage}>
          <p>{currentEvent?.about || 'Объявлен режим чрезвычайной ситуации. Следуйте инструкциям служб экстренного реагирования.'}</p>
          <p>Пожалуйста, сохраняйте спокойствие и следуйте инструкциям персонала.</p>
        </div>
        
        <div className={styles.guidelines}>
          <h3>Правила безопасности:</h3>
          <ul>
            {(referenceInfo?.safetyInstructions?.length ? referenceInfo.safetyInstructions : defaultInstructions).map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>

        {referenceInfo?.emergencyContacts && referenceInfo.emergencyContacts.length > 0 && (
          <div className={styles.contacts}>
            <h3>Экстренные контакты:</h3>
            <div className={styles.contactsList}>
              {referenceInfo.emergencyContacts.map((contact, index) => (
                <a key={index} href={`tel:${contact}`} className={styles.contactLink}>
                  📞 {contact}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Информация о точках эвакуации */}
        {referenceInfo?.evacuationPoints && referenceInfo.evacuationPoints.length > 0 && (
          <div className={styles.evacuationInfo}>
            <h3>Доступно точек эвакуации: {referenceInfo.evacuationPoints.length}</h3>
            <p>Подробная информация о местах эвакуации доступна в соответствующем разделе.</p>
          </div>
        )}
        
        <div className={styles.actionButtons}>
          <button 
            onClick={handleRefClick}
            className={`${styles.actionButton} ${styles.referenceBtn}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            <span>Справочная информация</span>
            <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          
          <button 
            onClick={handleEvacuationClick} 
            className={`${styles.actionButton} ${styles.evacuationBtn}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Места эвакуации</span>
            <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button 
            onClick={handleSupportClick} 
            className={`${styles.actionButton} ${styles.supportBtn}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <span>Служба поддержки</span>
            <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.footer}>
        <p>Система оповещения о ЧС • Экстренные службы: 112</p>
        {emergencyData && (
          <p className={styles.dataInfo}>
            Активных ЧС: {emergencyData.event.length} • 
            Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmergencyNotification;