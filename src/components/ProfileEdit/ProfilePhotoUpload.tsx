import React from 'react';
import styles from './ProfilePhotoUpload.module.css';

interface ProfilePhotoUploadProps {
  photoUrl: string;
  onPhotoChange: () => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ photoUrl, onPhotoChange }) => {
  return (
    <div className={styles.profilePhoto}>
      <div className={styles.photoContainer}>
        <img src={photoUrl} alt="Фото профиля" />
        <div className={styles.photoOverlay} onClick={onPhotoChange}>
          <button className={styles.uploadBtn}>Изменить фото</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;