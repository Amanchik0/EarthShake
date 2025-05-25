import React, { useRef } from 'react';
import styles from './ProfilePhotoUpload.module.css';

interface ProfilePhotoUploadProps {
  photoUrl: string | undefined;
  onPhotoChange: (file: File) => void; 
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ photoUrl, onPhotoChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
  };

  return (
    <div className={styles.profilePhoto}>
      <div className={styles.photoContainer}>
        <img 
          src={photoUrl || "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg"} 
          alt="Фото профиля" 
        />
        <div className={styles.photoOverlay} onClick={handlePhotoClick}>
          <button type="button" className={styles.uploadBtn}>
            Изменить фото
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;