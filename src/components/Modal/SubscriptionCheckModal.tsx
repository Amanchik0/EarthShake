import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import styles from './SubscriptionCheckModal.module.css';

interface SubscriptionCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'event' | 'community';
  targetPath: string;
}

const SubscriptionCheckModal: React.FC<SubscriptionCheckModalProps> = ({ 
  isOpen, 
  onClose,
  feature,
  targetPath
}) => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let modalRootElement = document.getElementById('modal-root');
    if (!modalRootElement) {
      modalRootElement = document.createElement('div');
      modalRootElement.id = 'modal-root';
      document.body.appendChild(modalRootElement);
    }
    setModalRoot(modalRootElement);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const updateSubscription = async () => {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
      throw new Error('Данные авторизации не найдены');
    }

    // Получаем актуальные данные профиля
    const profileResponse = await fetch(
      `http://localhost:8090/api/users/get-by-username/${username}`,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    if (!profileResponse.ok) {
      throw new Error('Не удалось получить данные профиля');
    }
    
    const actualProfile = await profileResponse.json();
    
    // Подготавливаем данные для обновления
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
      communityId: actualProfile.communityId || [],
      eventIds: actualProfile.eventIds || [],
      metadata: {
        ...actualProfile.metadata,
        subscriptionUpdatedAt: new Date().toISOString()
      },
      isSubscriber: true
    };

    const response = await fetch('http://localhost:8090/api/users/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscriptionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка ${response.status}: ${errorText}`);
    }

    return await response.json();
  };

  const handleSubscribeAndProceed = async () => {
    setIsSubscribing(true);
    try {
      console.log('🔄 Оформляем подписку для доступа к функции...');
      
      const updatedProfile = await updateSubscription();
      
      // Обновляем AuthContext
      updateUser({ isSubscriber: true });
      
      // Обновляем localStorage
      localStorage.setItem('isSubscriber', 'true');
      
      console.log(' Подписка оформлена, переходим к:', targetPath);
      
      // Показываем уведомление
      const notification = document.createElement('div');
      notification.textContent = 'Подписка оформлена! Добро пожаловать в Premium!';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1002;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 600;
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);

      // Закрываем модалку и переходим к целевой странице
      onClose();
      navigate(targetPath);
      
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
      
      const errorNotification = document.createElement('div');
      errorNotification.textContent = 'Произошла ошибка при оформлении подписки';
      errorNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1002;
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
      setIsSubscribing(false);
    }
  };

  const handleGoToProfile = () => {
    onClose();
    navigate('/profile');
  };

  if (!modalRoot || !isOpen) return null;

  const featureNames = {
    event: 'событий',
    community: 'сообществ'
  };

  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <button 
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSubscribing}
            aria-label="Закрыть модальное окно"
          >
            ×
          </button>
          <div className={styles.premiumIcon}></div>
          <h2>Требуется Premium подписка</h2>
          <p>Для создания {featureNames[feature]} необходима Premium подписка</p>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.subscriptionPrice}>
            <span className={styles.price}>5000</span>
            <span className={styles.currency}>тенге/месяц</span>
          </div>
          
          <div className={styles.benefits}>
            <div className={styles.benefitItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Создание событий</span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Создание сообществ</span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Отсутствие рекламы</span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>VIP значок в профиле</span>
              <span className={styles.badgeHighlight}></span>
            </div>
          </div>

          <div className={styles.featureHighlight}>
            <div className={styles.highlightIcon}>
              {feature === 'event' ? '📅' : '👥'}
            </div>
            <div className={styles.highlightText}>
              После оформления подписки вы сразу сможете создать {feature === 'event' ? 'событие' : 'сообщество'}!
            </div>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.subscribeBtn}
            onClick={handleSubscribeAndProceed}
            disabled={isSubscribing}
          >
            {isSubscribing ? (
              <span className={styles.loaderContainer}>
                <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Оформляем подписку...
              </span>
            ) : 'Оформить подписку и продолжить'}
          </button>
          
          <button 
            className={styles.profileBtn}
            onClick={handleGoToProfile}
            disabled={isSubscribing}
          >
            Управлять подпиской в профиле
          </button>
          
          <p className={styles.subscriptionNote}>
            Подписка автоматически продлевается каждый месяц
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default SubscriptionCheckModal;