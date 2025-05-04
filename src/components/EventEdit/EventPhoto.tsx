import React from 'react';
import styles from '../../features/Events/EventEditPage.module.css';


const EventPhoto: React.FC = () => {
  //TODO фотки чтоб норм загружалсиь фиг его как но сделать над 
  
  const handlePhotoUpload = () => {
    console.log('Photo upload clicked');
  };

  return (
    <div className={styles.eventPhoto}>
      <div className={styles.photoContainer}>
        <img src="/api/placeholder/800/300" alt="Фото события" />
        <div className={styles.photoOverlay}>
          <button 
            type="button" 
            className={styles.uploadBtn} 
            onClick={handlePhotoUpload}
          >
            Выбрать фото
          </button>
        </div>
      </div>
      <p>Нажмите на изображение, чтобы загрузить фото события</p>
    </div>
  );
};

export default EventPhoto;

