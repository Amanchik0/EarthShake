import React from 'react';
import styles from '../../features/Main/mainStyle.module.css';
import Map, { Emergency } from '../MapComponent'; // Импортируем ваш компонент карты
// TODO прям жирный косяк надо исправить 
//нет сейчас без исправлении все работает там просто не отображалось 
// теперь другой вопрос 
// почему то радиус не показывается 
// тоесть сам маркер есть ( причем если этот маркер виден в моем экране вся карта загорается красным , ладно бы если я был в радиусе но нет он становаиться красным даже если на карте я задевая красную точку даже если растояние 900км а там у емергенси радиус 5км )

const MapSection: React.FC = () => {
  // Пример данных для демонстрации
  const demoEmergencies: Emergency[] = [
    {
      id: '1',
      lat: 51.1694,
      lng: 71.4491,
      radius: 5000,
      title: 'Наводнение в Нур-Султане'
    },
    // {
    //   id: '2',
    //   lat: 43.2567,
    //   lng: 76.9286,
    //   radius: 3000,
    //   title: 'Землетрясение в Алматы'
    // }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.mapContainer}>
          <h2 className={styles.mapTitle}>События по всему Казахстану</h2>
          
          {/* Заменяем img на ваш компонент Map */}
          <div className={styles.mapWrapper}>
            <Map 
              emergencies={demoEmergencies} 
              mode="emergencies"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;