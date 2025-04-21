import React from 'react';
import ProfilePhotoUpload from '../../components/ProfileEdit/ProfilePhotoUpload';
import ProfileForm from '../../components/ProfileEdit/ProfileForm';
import styles from './ProfileEditPage.module.css';
import { ProfileFormData } from '../../types/types';

interface ProfileFormProps {
  initialData: ProfileFormData;
  onCancel: () => void;
  onSubmit: (data: ProfileFormData) => void;
}

const ProfileEditPage: React.FC<ProfileFormProps> = ({
  initialData,
  onCancel,
  onSubmit,
}) => {
  const [photoUrl, setPhotoUrl] = React.useState('/api/placeholder/150/150');

  const handlePhotoChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setPhotoUrl(URL.createObjectURL(file));
      }
    };
    input.click();
  };

  return (
    <div className={styles.profileEditModalContent}>
      <div className={styles.header}>
        <h1>Редактирование профиля</h1>
      </div>

      <ProfilePhotoUpload 
        photoUrl={photoUrl} 
        onPhotoChange={handlePhotoChange} 
      />

      <ProfileForm
        initialData={initialData}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ProfileEditPage;