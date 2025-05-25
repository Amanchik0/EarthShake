import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProfileHeaderProps, ProfileFormData, ProfileInfo } from '../../types/profile';
import Modal from '../Modal/Modal';
import ProfileEditPage from '../../features/Profile/ProfileEditPage';
import styles from '../../features/Profile/profile.module.css';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
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
  photoUrl, // Добавлено: URL фото профиля
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Разбиваем полное имя на firstName и lastName для формы
  const [firstName, ...rest] = name.split(' ');
  const lastName = rest.join(' ');

  const initialForm: ProfileFormData = {
    firstName: firstName || '',
    lastName: lastName || '',
    email,
    phoneNumber,
    city,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    imageUrl: photoUrl || undefined, // Исправлено: передаем undefined если нет URL
  };

  const handleSave = (data: ProfileFormData) => {
    const updated: ProfileInfo = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      username,
      email: data.email,
      phoneNumber: data.phoneNumber,
      city: data.city,
      registrationDate,
      events,
      communities,
      hasSubscription,
      photoUrl: data.imageUrl, // Добавлено: обновляем URL фото
    };
    onProfileUpdate(updated);
    setIsEditOpen(false);
  };

  return (
    <div className={styles.profileHeader}>
      <Link to="/profile">
        <img
          src={photoUrl || "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg"}
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
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleSave}
        />
      </Modal>
    </div>
  );
};

export default ProfileHeader;
