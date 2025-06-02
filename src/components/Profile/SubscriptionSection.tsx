import React, { useState } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
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
  const { updateUser } = useAuth();
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

    console.log('📤 Отправляем запрос на обновление подписки:', subscriptionData);

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
      const errorText = await response.text();
      throw new Error(`Ошибка ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(' Ответ сервера на обновление подписки:', result);
    return result;
  };

  const handleSubscriptionChange = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Начинаем процесс изменения подписки...');
      console.log(' Текущее состояние подписки:', hasSubscription);
      
      // Получаем актуальные данные профиля с сервера перед обновлением
      const token = localStorage.getItem('accessToken');
      const profileResponse = await fetch(
        `http://localhost:8090/api/users/get-by-username/${currentProfile.username}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (!profileResponse.ok) {
        throw new Error('Не удалось получить актуальные данные профиля');
      }
      
      const actualProfile = await profileResponse.json();
      console.log('📋 Актуальные данные профиля с сервера:', actualProfile);
      
      // Подготавливаем данные для обновления с актуальными массивами
      const newSubscriptionStatus = !hasSubscription;
      console.log('📝 Новый статус подписки:', newSubscriptionStatus);
      
      const subscriptionData = {
        id: actualProfile.id,
        username: actualProfile.username,
        email: actualProfile.email,
        password: actualProfile.password,
        firstName: actualProfile.firstName,
        lastName: actualProfile.lastName,
        role: actualProfile.role,
        city: actualProfile.city,
        imageUrl: actualProfile.imageUrl,
        phoneNumber: actualProfile.phoneNumber,
        registrationDate: actualProfile.registrationDate,
        communityId: actualProfile.communityId || [], // Используем актуальные данные
        eventIds: actualProfile.eventIds || [], // Используем актуальные данные
        metadata: {
          ...actualProfile.metadata,
          lastProfileUpdate: new Date().toISOString(),
          subscriptionUpdatedAt: new Date().toISOString()
        },
        isSubscriber: newSubscriptionStatus // Правильное поле!
      };

      console.log('📤 Данные для отправки:', subscriptionData);

      const updatedProfile = await updateSubscription(subscriptionData);
      console.log(' Профиль обновлен на сервере:', updatedProfile);

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
        subscriber: updatedProfile.isSubscriber, // Сохраняем как subscriber для совместимости
        eventIds: updatedProfile.eventIds || [],
        communityIds: updatedProfile.communityId || [],
        events: currentProfile.events || [], // Сохраняем уже загруженные события
        communities: currentProfile.communities || [] // Сохраняем уже загруженные сообщества
      };

      console.log('🔄 Обновляем профиль в компоненте:', fullProfile);

      // Обновляем профиль в родительском компоненте
      onSubscriptionUpdate(fullProfile);

      // Обновляем AuthContext с новым статусом подписки
      console.log('🔄 Обновляем AuthContext...');
      updateUser({ 
        isSubscriber: updatedProfile.isSubscriber
      });

      // Также обновляем localStorage напрямую для гарантии
      localStorage.setItem('isSubscriber', updatedProfile.isSubscriber.toString());
      console.log('💾 Обновлен localStorage isSubscriber:', updatedProfile.isSubscriber);

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

      console.log(' Процесс изменения подписки завершен успешно');

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