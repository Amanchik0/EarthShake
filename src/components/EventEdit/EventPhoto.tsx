import React from 'react';

const EventPhoto: React.FC = () => {

  //TODO фотки чтоб норм загружалсиь фиг его как но сделать над 
  
  const handlePhotoUpload = () => {
    console.log('Photo upload clicked');
  };

  return (
    <div className="event-photo">
      <div className="photo-container">
        <img src="/api/placeholder/800/300" alt="Фото события" />
        <div className="photo-overlay">
          <button type="button" className="upload-btn" onClick={handlePhotoUpload}>
            Выбрать фото
          </button>
        </div>
      </div>
      <p>Нажмите на изображение, чтобы загрузить фото события</p>
    </div>
  );
};

export default EventPhoto;