import React, { useState } from 'react';
import { ProfileHeaderProps, ProfileFormData } from '../../types/types';
import ProfileEditPage from '../../features/Profile/ProfileEditPage';
import Modal from '../Modal/Modal';

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
    <div className="profile-header">
      <img src="/api/placeholder/180/180" alt="User Profile" className="profile-photo" />
      <div className="profile-info">
        <h1 className="profile-name">{name}</h1>
        <p className="profile-username">@{username}</p>
        <div className="subscription-badge">Premium подписка</div>
        <div className="profile-rating">
          <div className="stars">★★★★☆</div>
          <span className="rating-value">4.8</span>
        </div>
        <div className="profile-details">
          <DetailItem label="Email" value={email} />
          <DetailItem label="Телефон" value={phone} />
          <DetailItem label="Город" value={city} />
          <DetailItem label="Дата регистрации" value={registrationDate} />
        </div>
        <button 
          className="edit-button" 
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
  <div className="detail-item">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value}</span>
  </div>
);

export default ProfileHeader;