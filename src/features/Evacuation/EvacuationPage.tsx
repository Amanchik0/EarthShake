  import React, { useState, useMemo } from 'react';
  import EmergencyBanner from '../../components/Evacuation/EmergencyBanner';
  import EvacuationMap from '../../components/Evacuation/EvacuationMap';
  import LocationCard from '../../components/Evacuation/LocationCard';
  import InfoCard from '../../components/Evacuation/InfoCard';
  import Checklist from '../../components/Evacuation/Checklist';
  import Notifications from '../../components/Evacuation/Notifications';
  import EventHeader from '../../components/Evacuation/EventHeafer';
  import { Location, Notification, ChecklistItem, InfoItem } from '../../types/types';
  import { EmergencyResponse, EMERGENCY_TYPE_LABELS, EMERGENCY_TYPE_ICONS } from '../../types/emergencyTypes';
  import styles from './EvacuationPage.module.css';

  interface EvacuationPageProps {
    emergencyData?: EmergencyResponse | null;
  }

  const EvacuationPage: React.FC<EvacuationPageProps> = ({ emergencyData }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [checklist, setChecklist] = useState<ChecklistItem[]>([
        { id: '1', text: 'Документы (паспорт, мед. полис)', checked: true },
      { id: '2', text: 'Лекарства и аптечка', checked: true },
      { id: '3', text: 'Запас питьевой воды и пищи', checked: false },
      { id: '4', text: 'Средства связи и зарядные устройства', checked: false },
      { id: '5', text: 'Одежда по сезону', checked: false }
    ]);

    const baseLocations: Location[] = [
      {
        id: '1',
        name: 'Центральное убежище №1',
        address: 'ул. Центральная, 123',
        type: 'shelter',
        status: 'open',
        capacity: 30,
        workingHours: '24/7'
      },
      {
        id: '2',
        name: 'Спортивный комплекс "Алматы"',
        address: 'пр. Абая, 45',
        type: 'evacuation',
        status: 'open',
        capacity: 200,
        workingHours: '24/7'
      },
      {
        id: '3',
        name: 'Медицинский пункт №5',
        address: 'ул. Толе би, 67',
        type: 'medical',
        status: 'open',
        capacity: 50,
        workingHours: '24/7'
      }
    ];

    const apiLocations: Location[] = useMemo(() => {
      if (!emergencyData?.referenceInfo?.[0]?.evacuationPoints) return [];
      
      return emergencyData.referenceInfo[0].evacuationPoints.map((point, index) => ({
        id: `api-${index}`,
        name: `Точка эвакуации ${index + 1}`,
        address: `Координаты: ${point.x.toFixed(4)}, ${point.y.toFixed(4)}`,
        type: 'evacuation' as const,
        status: 'open' as const,
        capacity: 100,
        workingHours: '24/7',
        coordinates: { lat: point.x, lng: point.y }
      }));
    }, [emergencyData]);

    const allLocations = [...baseLocations, ...apiLocations];

    const notifications: Notification[] = useMemo(() => {
      const baseNotifications: Notification[] = [
        {
          id: '1',
          title: 'Открытие нового убежища',
          message: 'Новое убежище открыто по адресу ул. Восточная, 56.',
          time: '2 часа назад',
          icon: '🔔'
        }
      ];

      if (emergencyData?.event?.[0]) {
        const event = emergencyData.event[0];
        const emergencyNotification: Notification = {
          id: 'emergency-' + event.id,
          title: EMERGENCY_TYPE_LABELS[event.emergencyType] || 'ЧС',
          message: event.about,
          time: new Date(event.date).toLocaleString('ru-RU'),
          icon: EMERGENCY_TYPE_ICONS[event.emergencyType] || '⚠️'
        };
        return [emergencyNotification, ...baseNotifications];
      }

      return baseNotifications;
    }, [emergencyData]);

    // Информационные карточки на основе данных ЧС
    const infoItems: InfoItem[] = useMemo(() => {
      const baseInfo: InfoItem[] = [
        {
          id: '1',
          icon: '📋',
          title: 'Документы',
          text: 'Возьмите с собой паспорт, медицинские документы и другие важные бумаги при эвакуации.'
        },
        {
          id: '2',
          icon: '🎒',
          title: 'Аварийный набор',
          text: 'Подготовьте рюкзак с необходимыми вещами: вода, еда, лекарства, фонарик.'
        }
      ];

      if (emergencyData?.referenceInfo?.[0]?.safetyInstructions) {
        const safetyInfo: InfoItem = {
          id: 'safety',
          icon: '⚠️',
          title: 'Инструкции безопасности',
          text: emergencyData.referenceInfo[0].safetyInstructions.slice(0, 2).join(' ')
        };
        return [safetyInfo, ...baseInfo];
      }

      return baseInfo;
    }, [emergencyData]);

    const handleChecklistToggle = (id: string) => {
      setChecklist(checklist.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      ));
    };

    const handleBack = () => {
      window.history.back();
    };

    // Определяем уровень опасности на основе типа ЧС
    const getDangerLevel = () => {
      if (!emergencyData?.event?.[0]) return 'medium';
      
      const emergencyType = emergencyData.event[0].emergencyType;
      const highDangerTypes = ['RADIATION_LEAK', 'CHEMICAL_SPILL', 'TSUNAMI', 'VOLCANO', 'TERROR_ATTACK'];
      const mediumDangerTypes = ['EARTHQUAKE', 'FIRE', 'FLOOD', 'EXPLOSION'];
      
      if (highDangerTypes.includes(emergencyType)) return 'high';
      if (mediumDangerTypes.includes(emergencyType)) return 'medium';
      return 'low';
    };

    const dangerLevel = getDangerLevel();
    const emergencyEvent = emergencyData?.event?.[0];

    return (
      <div className={styles.container}>
        <EventHeader onBack={handleBack} tag="emergency" />
        
        <h1 className={styles.pageTitle}>Места для эвакуации</h1>
        
        <div className={`${styles.alertStatus} ${styles[dangerLevel]}`}>
          <span></span>
          <span>
            {dangerLevel === 'high' && 'Критический уровень опасности'}
            {dangerLevel === 'medium' && 'Повышенный уровень опасности'}
            {dangerLevel === 'low' && 'Умеренный уровень опасности'}
          </span>
          {emergencyEvent && (
            <span className={styles.emergencyType}>
              {EMERGENCY_TYPE_ICONS[emergencyEvent.emergencyType]} {EMERGENCY_TYPE_LABELS[emergencyEvent.emergencyType]}
            </span>
          )}
        </div>
        
        <p className={styles.pageDescription}>
          {emergencyEvent ? (
            <>
              Актуальная информация о местах эвакуации в связи с {EMERGENCY_TYPE_LABELS[emergencyEvent.emergencyType].toLowerCase()}.
              Доступно {allLocations.length} точек эвакуации.
            </>
          ) : (
            'Здесь вы найдете актуальную информацию о доступных местах для эвакуации, включая убежища, медицинские пункты и центры раздачи продуктов.'
          )}
        </p>
        
        <EmergencyBanner emergencyData={emergencyData} />
        
        {/* <EvacuationMap 
          locations={allLocations} 
          emergencyData={emergencyData}
        /> */}
        
        <div className={styles.gridContainer}>
          <div className={styles.evacuationList}>
            <div className={styles.evacuationHeader}>
              <div className={styles.evacuationTitle}>
                Доступные места эвакуации ({allLocations.length})
              </div>
              <div className={styles.evacuationSearch}>
                <span>🔍</span>
                <input type="text" placeholder="Поиск по адресу или названию" />
              </div>
            </div>
            
            {apiLocations.length > 0 && (
              <div className={styles.sectionHeader}>
                <h3>🚨 Экстренные точки эвакуации</h3>
                <p>Точки эвакуации, назначенные службами экстренного реагирования</p>
              </div>
            )}
            
            <div className={styles.locationCards}>
              {allLocations.map(location => (
                <LocationCard 
                  key={location.id} 
                  location={location}
                  isEmergencyPoint={location.id.startsWith('api-')}
                />
              ))}
            </div>
          </div>
          
          <div className={styles.sidebar}>
            <InfoCard title="Важная информация" items={infoItems} />
            
            <Checklist 
              title="Чек-лист для эвакуации" 
              items={checklist} 
              onToggle={handleChecklistToggle} 
            />
            
            <Notifications title="Последние оповещения" items={notifications} />
            
            {emergencyData?.referenceInfo?.[0]?.emergencyContacts && (
              <div className={styles.emergencyContacts}>
                <h3>Экстренные контакты</h3>
                <div className={styles.contactsList}>
                  {emergencyData.referenceInfo[0].emergencyContacts.map((contact, index) => (
                    <a key={index} href={`tel:${contact}`} className={styles.contactLink}>
                      📞 {contact}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default EvacuationPage;