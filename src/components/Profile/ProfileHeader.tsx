import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProfileHeaderProps, ProfileFormData, FullProfile } from '../../types/profile';
import Modal from '../Modal/Modal';
import ProfileEditPage from '../../features/Profile/ProfileEditPage';
import styles from '../../features/Profile/profile.module.css';

// Расширяем интерфейс ProfileHeaderProps, чтобы он принимал FullProfile
interface ExtendedProfileHeaderProps extends Omit<ProfileHeaderProps, 'onProfileUpdate'> {
  currentProfile: FullProfile; // Добавляем полный профиль
  onProfileUpdate: (updatedProfile: FullProfile) => Promise<void>; // Изменяем тип callback
}

const ProfileHeader: React.FC<ExtendedProfileHeaderProps> = ({
  name,
  username,
  email,
  phoneNumber,
  city,
  registrationDate,
  events,
  communities,
  hasSubscription,
  onProfileUpdate,
  photoUrl,
  currentProfile, // Получаем полный профиль
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Подготавливаем данные для формы редактирования
  const initialForm: ProfileFormData = {
    username: currentProfile.username,
    firstName: currentProfile.firstName || '',
    lastName: currentProfile.lastName || '',
    email: currentProfile.email,
    phoneNumber: currentProfile.phoneNumber || '',
    city: currentProfile.city || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    imageUrl: currentProfile.imageUrl || undefined,
  };

  const handleSave = async (updatedProfile: FullProfile) => {
    await onProfileUpdate(updatedProfile);
    setIsEditOpen(false);
  };

  return (
    <div className={styles.profileHeader}>
      <Link to="/profile">
        <img
          src={photoUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDwmG52pVI5JZfn04j9gdtsd8pAGbqjjLswg&s"}
          alt="Profile"
          className={styles.profilePhoto}
        />
      </Link>
      <div className={styles.profileInfo}>
        <h1 className={styles.profileName}>{name}</h1>
        <p className={styles.profileUsername}>@{username}</p>
        <div className={styles.subscriptionBadge}>
          {hasSubscription ? 'Premium' : 'БЕЗ ПОДПИСКИ'}
        </div>
        <div className={styles.profileDetails}>
          <div><b>Email:</b> {email}</div>
          <div><b>Телефон:</b> {phoneNumber || '-'}</div>
          <div><b>Город:</b> {city}</div>
          <div><b>Регистрация:</b> {registrationDate}</div>
        </div>
        <button onClick={() => setIsEditOpen(true)} className={styles.editButton}>
          Редактировать профиль
        </button>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <ProfileEditPage
          initialData={initialForm}
          currentProfile={currentProfile}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleSave}
        />
      </Modal>
    </div>
  );
};

export default ProfileHeader;