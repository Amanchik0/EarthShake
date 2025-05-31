import React, { useRef, useState } from 'react';
import styles from './ProfilePhotoUpload.module.css';

interface ProfilePhotoUploadProps {
  photoUrl: string | undefined;
  onPhotoChange: (file: File) => Promise<void>; // Изменили на Promise<void>
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ photoUrl, onPhotoChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isUploading) {
      setIsUploading(true);
      try {
        await onPhotoChange(file);
      } catch (error) {
        console.error('Ошибка загрузки фото:', error);
      } finally {
        setIsUploading(false);
        // Очищаем input для возможности повторной загрузки того же файла
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className={styles.profilePhoto}>
      <div className={styles.photoContainer}>
        <img 
          src={photoUrl || "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg"} 
          alt="Фото профиля" 
        />
        <div 
          className={`${styles.photoOverlay} ${isUploading ? styles.uploading : ''}`} 
          onClick={handlePhotoClick}
        >
          <button 
            type="button" 
            className={styles.uploadBtn}
            disabled={isUploading}
          >
            {isUploading ? 'Загрузка...' : 'Изменить фото'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isUploading}
        />
      </div>
      {isUploading && (
        <div className={styles.uploadingIndicator}>
          Загрузка фото...
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;