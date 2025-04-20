import React, { useState, useEffect } from 'react';
import './ModalSubs.css'
interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => Promise<void> | void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubscribe 
}) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
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
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen && !isMounted) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleOverlayClick}
    >
      <div className={`modal transform transition-transform duration-300 ${
        isOpen ? 'scale-100' : 'scale-95'
      }`}>
        <div className="modal-header">
          <button 
            className="close-btn"
            onClick={onClose}
            disabled={isSubscribing}
            aria-label="Закрыть модальное окно"
          >
            ×
          </button>
          <h2>Премиум подписка</h2>
          <p>Откройте все возможности платформы</p>
        </div>
        
        <div className="modal-body">
          <div className="subscription-price">
            <span className="price">5000</span>
            <span className="currency">тенге/месяц</span>
          </div>
          
          <div className="benefits">
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <span>Создание ивентов</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <span>Отсутствие рекламы</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <span>Создание сообществ</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <span>Галочка в профиле возле ника</span>
              <span className="badge-highlight">VIP</span>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="subscribe-btn"
            onClick={handleSubscribe}
            disabled={isSubscribing}
          >
            {isSubscribing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка...
              </span>
            ) : 'Оформить подписку'}
          </button>
          <p>Подписка автоматически продлевается каждый месяц</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;