import React, { useState } from 'react';
import { ProfileHeaderProps, ProfileFormData } from '../../types/types';
import ProfileEditPage from '../../features/Profile/ProfileEditPage';
import Modal from '../Modal/Modal';
import styles from '../../features/Profile/profile.module.css';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  username,
  email,
  phone,
  city,
  registrationDate,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Преобразуем данные профиля в форму, понятную для ProfileForm
  const profileFormData: ProfileFormData = {
    firstName: name.split(' ')[0],
    lastName: name.split(' ')[1] || '',
    email,
    bio: `Телефон: ${phone}\nГород: ${city}`,
  };

  const handleSave = (data: ProfileFormData) => {
    console.log('Сохраненные данные:', data);
    // TODO загрузка профиля 
    setIsEditModalOpen(false);
  };

  return (
    <div className={styles.profileHeader}>
      <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="User Profile" className={styles.profilePhoto} />
      <div className={styles.profileInfo}>
        <h1 className={styles.profileName}>{name}</h1>
        <p className={styles.profileUsername}>@{username}</p>
        <div className={styles.subscriptionBadge}>Premium подписка</div>
        <div className={styles.profileRating}>
          <div className={styles.stars}>★★★★☆</div>
          <span className={styles.ratingValue}>4.8</span>
        </div>
        <div className={styles.profileDetails}>
          <DetailItem label="Email" value={email} />
          <DetailItem label="Телефон" value={phone} />
          <DetailItem label="Город" value={city} />
          <DetailItem label="Дата регистрации" value={registrationDate} />
        </div>
        <button 
          className={styles.editButton} 
          onClick={() => setIsEditModalOpen(true)}
        >
          Редактировать профиль
        </button>
      </div>

      {/* Модальное окно редактирования */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ProfileEditPage 
          initialData={profileFormData}
          onCancel={() => setIsEditModalOpen(false)}
          onSubmit={handleSave}
        />
      </Modal>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className={styles.detailItem}>
    <span className={styles.detailLabel}>{label}</span>
    <span className={styles.detailValue}>{value}</span>
  </div>
);

export default ProfileHeader;