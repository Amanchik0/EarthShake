import React, { useState } from 'react';
import EmergencyBanner from '../../components/Evacuation/EmergencyBanner';
import EvacuationMap from '../../components/Evacuation/EvacuationMap';
import LocationCard from '../../components/Evacuation/LocationCard';
import InfoCard from '../../components/Evacuation/InfoCard';
import Checklist from '../../components/Evacuation/Checklist';
import Notifications from '../../components/Evacuation/Notifications';
import { Location, Notification, ChecklistItem, InfoItem } from '../../types/types';
import './EvacuationPage.css';

const EvacuationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: 'Документы (паспорт, мед. полис)', checked: true },
    { id: '2', text: 'Лекарства и аптечка', checked: true },
    { id: '3', text: 'Запас питьевой воды и пищи', checked: false },
    { id: '4', text: 'Средства связи и зарядные устройства', checked: false },
    { id: '5', text: 'Одежда по сезону', checked: false }
  ]);

  const locations: Location[] = [
    {
      id: '1',
      name: 'Центральное убежище №1',
      address: 'ул. Центральная, 123',
      type: 'shelter',
      status: 'open',
      capacity: 30,
      workingHours: '24/7'
    },
    // ... другие локации
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Открытие нового убежища',
      message: 'Новое убежище открыто по адресу ул. Восточная, 56.',
      time: '2 часа назад',
      icon: '🔔'
    },
    // ... другие уведомления
  ];

  const infoItems: InfoItem[] = [
    {
      id: '1',
      icon: '📋',
      title: 'Документы',
      text: 'Возьмите с собой паспорт, медицинские документы и другие важные бумаги при эвакуации.'
    },
    // ... другие информационные пункты
  ];

  const handleChecklistToggle = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="container">
 
      
      <h1 className="page-title">Места для эвакуации</h1>
      <div className="alert-status active">
          <span>⚠️</span>
          <span>Повышенный уровень опасности</span>
        </div>
      <p className="page-description">
        Здесь вы найдете актуальную информацию о доступных местах для эвакуации, 
        включая убежища, медицинские пункты и центры раздачи продуктов.
      </p>
      
      <EmergencyBanner />
      
      <EvacuationMap locations={locations} />
      
      <div className="grid-container">
        <div className="evacuation-list">
          <div className="evacuation-header">
            <div className="evacuation-title">Доступные места эвакуации</div>
            <div className="evacuation-search">
              <span>🔍</span>
              <input type="text" placeholder="Поиск по адресу или названию" />
            </div>
          </div>
          
          <div className="location-cards">
            {locations.map(location => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>
        
        <div className="sidebar">
          <InfoCard title="Важная информация" items={infoItems} />
          <Checklist 
            title="Чек-лист для эвакуации" 
            items={checklist} 
            onToggle={handleChecklistToggle} 
          />
          <Notifications title="Последние оповещения" items={notifications} />
        </div>
      </div>
    </div>
  );
};

export default EvacuationPage;