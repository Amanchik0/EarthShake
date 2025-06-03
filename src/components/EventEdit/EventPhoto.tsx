import React, { useRef } from 'react';
import styles from '../../features/Events/EventEditPage/EventEditPage.module.css';

interface EventPhotoProps {
  imageUrl?: string;
  onPhotoUpload: (file: File) => Promise<void>;
  onPhotoDelete?: () => Promise<void>;
  uploading?: boolean;
}

const EventPhoto: React.FC<EventPhotoProps> = ({ 
  imageUrl, 
  onPhotoUpload, 
  onPhotoDelete,
  uploading = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }

      // Проверяем размер файла (максимум 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Размер файла не должен превышать 10MB');
        return;
      }

      try {
        await onPhotoUpload(file);
      } catch (error) {
        console.error('Ошибка загрузки фото:', error);
        alert('Ошибка загрузки фото. Попробуйте еще раз.');
      }
    }
  };

  const handleDeletePhoto = async () => {
    if (window.confirm('Вы уверены, что хотите удалить фото?')) {
      try {
        if (onPhotoDelete) {
          await onPhotoDelete();
        }
      } catch (error) {
        console.error('Ошибка удаления фото:', error);
        alert('Ошибка удаления фото. Попробуйте еще раз.');
      }
    }
  };

  return (
    <div className={styles.eventPhoto}>
      <div className={styles.photoContainer}>
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Фото события" className={styles.uploadedPhoto} />
            <div className={styles.photoOverlay}>
              <div className={styles.photoActions}>
                <button 
                  type="button" 
                  className={styles.uploadBtn} 
                  onClick={handlePhotoClick}
                  disabled={uploading}
                >
                  {uploading ? 'Загрузка...' : 'Изменить фото'}
                </button>
                {onPhotoDelete && (
                  <button 
                    type="button" 
                    className={styles.deletePhotoBtn} 
                    onClick={handleDeletePhoto}
                    disabled={uploading}
                  >
                    Удалить фото
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.photoPlaceholder}>
            <div className={styles.photoPlaceholderContent}>
              <div className={styles.photoIcon}>📸</div>
              <button 
                type="button" 
                className={styles.uploadBtn} 
                onClick={handlePhotoClick}
                disabled={uploading}
              >
                {uploading ? 'Загрузка...' : 'Выбрать фото'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <p className={styles.photoDescription}>
        {imageUrl 
          ? 'Нажмите на изображение, чтобы изменить или удалить фото события'
          : 'Нажмите на область выше, чтобы загрузить фото события'
        }
      </p>
      
      <div className={styles.photoHints}>
        <small>
          • Поддерживаемые форматы: JPG, PNG, WebP
          <br />
          • Максимальный размер: 10MB
          <br />
          • Рекомендуемое разрешение: 800x300 пикселей
        </small>
      </div>
    </div>
  );
};

export default EventPhoto;