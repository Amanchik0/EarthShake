import React, { useState } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import ProfilePhotoUpload from '../../components/ProfileEdit/ProfilePhotoUpload';
import ProfileForm from '../../components/ProfileEdit/ProfileForm';
import { ProfileFormData } from '../../types/profile';
import styles from './ProfileEditPage.module.css';

interface ProfileEditPageProps {
  initialData: ProfileFormData;
  onClose: () => void;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ initialData, onClose, onSubmit }) => {
  const { isLoading } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string>(initialData.imageUrl || '');
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // CHANGED: загрузка фото и обновление formData
  const handlePhotoChange = async (file: File) => {
    const token = localStorage.getItem('accessToken');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('http://localhost:8090/api/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error('Ошибка загрузки изображения');
      const { url } = await res.json();
      setPhotoUrl(url);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error(err);
      alert('Не удалось загрузить фото');
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) onClose();
  };

  const handleSubmit = async (data: ProfileFormData) => {
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
      alert('Новый пароль и подтверждение не совпадают');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, imageUrl: photoUrl });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Ошибка обновления профиля');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Загрузка данных...</div>;

  return (
    <div className={styles.profileContainer}>
      <button
        type="button"
        className={styles.closeButton}
        aria-label="Закрыть"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        &times;
      </button>
      <h1>Редактирование профиля</h1>
      <div className={styles.content}>
        <ProfilePhotoUpload photoUrl={photoUrl} onPhotoChange={handlePhotoChange} />
        <ProfileForm
          initialData={formData}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ProfileEditPage;