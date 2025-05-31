import React, { useState } from 'react';
import styles from '../../features/Profile/profile.module.css';
import SubscriptionModal from '../Modal/SubscriptionModal';
import { SubscriptionSectionProps } from '../../types/profile';

interface ExtendedSubscriptionSectionProps extends SubscriptionSectionProps {
  currentProfile: any; // Полный профиль пользователя
  onSubscriptionUpdate: (updatedProfile: any) => void; // Callback для обновления профиля
}

const SubscriptionSection: React.FC<ExtendedSubscriptionSectionProps> = ({ 
  hasSubscription, 
  currentProfile,
  onSubscriptionUpdate
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const updateSubscription = async (subscriptionData: any) => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Токен авторизации не найден');
    }

    const response = await fetch('http://localhost:8090/api/users/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscriptionData)
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Ошибка авторизации');
      }
      throw new Error(`Ошибка ${response.status}: Не удалось обновить подписку`);
    }

    return await response.json();
  };

  const handleSubscriptionChange = async () => {
    setIsLoading(true);
    try {
      // Подготавливаем данные для обновления
      const subscriptionData = {
        id: currentProfile.id,
        username: currentProfile.username,
        email: currentProfile.email,
        password: currentProfile.password,
        firstName: currentProfile.firstName,
        lastName: currentProfile.lastName,
        role: currentProfile.role,
        city: currentProfile.city,
        imageUrl: currentProfile.imageUrl,
        phoneNumber: currentProfile.phoneNumber,
        registrationDate: currentProfile.registrationDate,
        communityId: [], // Используем пустой массив, так как в API это может быть массивом
        eventIds: [], // Используем пустой массив
        metadata: {
          ...currentProfile.metadata,
          lastProfileUpdate: new Date().toISOString(),
          subscriptionUpdatedAt: new Date().toISOString()
        },
        subscriber: !hasSubscription // Переключаем состояние подписки
      };

      const updatedProfile = await updateSubscription(subscriptionData);

      // Преобразуем ответ API в формат FullProfile
      const fullProfile = {
        id: updatedProfile.id,
        username: updatedProfile.username,
        email: updatedProfile.email,
        password: updatedProfile.password,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        role: updatedProfile.role,
        city: updatedProfile.city,
        imageUrl: updatedProfile.imageUrl,
        phoneNumber: updatedProfile.phoneNumber,
        registrationDate: updatedProfile.registrationDate,
        metadata: updatedProfile.metadata,
        subscriber: updatedProfile.subscriber,
        events: currentProfile.events || [],
        communities: currentProfile.communities || []
      };

      // Обновляем профиль в родительском компоненте
      onSubscriptionUpdate(fullProfile);

      // Показываем уведомление
      const notification = document.createElement('div');
      notification.textContent = hasSubscription 
        ? 'Подписка успешно отменена!' 
        : 'Подписка успешно оформлена!';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${hasSubscription ? '#ef4444' : '#10b981'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 600;
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);

    } catch (error) {
      console.error('Ошибка при изменении подписки:', error);
      
      const errorNotification = document.createElement('div');
      errorNotification.textContent = 'Произошла ошибка при обработке подписки';
      errorNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 600;
      `;
      document.body.appendChild(errorNotification);
      
      setTimeout(() => {
        if (document.body.contains(errorNotification)) {
          document.body.removeChild(errorNotification);
        }
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.subscriptionSection}>
      <div className={styles.subscriptionInfo}>
        <h3 className={styles.subscriptionTitle}>Premium подписка</h3>
        <p className={styles.subscriptionDetails}>
          {hasSubscription 
            ? "Активна до 19 июля 2025 г.\nАвтопродление включено" 
            : "Оформите подписку, чтобы получить доступ ко всем возможностям платформы"}
        </p>
      </div>
      <button 
        className={styles.manageButton} 
        onClick={handleOpenModal}
        disabled={isLoading}
      >
        {isLoading ? 'Обработка...' : (hasSubscription ? 'Управление подпиской' : 'Оформить подписку')}
      </button>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubscribe={handleSubscriptionChange}
        hasSubscription={hasSubscription}
      />
    </div>
  );
};

export default SubscriptionSection;