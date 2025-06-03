import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../features/Profile/profile.module.css';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => Promise<void> | void;
  hasSubscription: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubscribe,
  hasSubscription
}) => {
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
    
    return () => {
      // Не удаляем modal-root при размонтировании
    };
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

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      await onSubscribe();
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Произошла ошибка при обработке подписки');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!modalRoot || !isOpen) return null;

  console.log('Модалка отображается:', isOpen);

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
          <h2>{hasSubscription ? 'Управление подпиской' : 'Премиум подписка'}</h2>
          <p>{hasSubscription ? 'Управляйте своей подпиской' : 'Откройте все возможности платформы'}</p>
        </div>
        
        {!hasSubscription && (
          <div className={styles.modalBody}>
            <div className={styles.subscriptionPrice}>
              <span className={styles.price}>5000</span>
              <span className={styles.currency}>тенге/месяц</span>
            </div>
            
            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Создание ивентов</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Отсутствие рекламы</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Создание сообществ</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Галочка в профиле возле ника</span>
                <span className={styles.badgeHighlight}>VIP</span>
              </div>
            </div>
          </div>
        )}

        {hasSubscription && (
          <div className={styles.modalBody}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Подписка активна
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Автопродление: включено<br />
                Следующий платеж: 19 июля 2025 г.
              </div>
            </div>
          </div>
        )}
        
        <div className={styles.modalFooter}>
          <button 
            className={`${styles.subscribeBtn} ${hasSubscription ? styles.cancelSubscription : ''}`}
            onClick={handleSubscribe}
            disabled={isSubscribing}
          >
            {isSubscribing ? (
              <span className={styles.loaderContainer}>
                <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка...
              </span>
            ) : hasSubscription ? 'Отменить подписку' : 'Оформить подписку'}
          </button>
          {!hasSubscription && (
            <p>Подписка автоматически продлевается каждый месяц</p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default SubscriptionModal;