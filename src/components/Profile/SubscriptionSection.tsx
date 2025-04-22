import React, { useState } from 'react';
import SubscriptionModal from '../Modal/SubscriptionModal';

interface SubscriptionSectionProps {
  hasSubscription?: boolean;
  onSubscribe: () => Promise<void> | void;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  hasSubscription ,
  onSubscribe
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="subscription-section">
      {hasSubscription ? (
        <>
          <div className="subscription-info">
            <h3 className="subscription-title">Premium подписка</h3>
            <p className="subscription-details">
              Активна до 19 июля 2025 г. <br />
              Автопродление включено
            </p>
          </div>
          <button 
            className="manage-button"
            onClick={handleOpenModal}
          >
            Управление подпиской
          </button>
        </>
      ) : (
        <>
          <div className="subscription-info">
            <h3 className="subscription-title">Базовый аккаунт</h3>
            <p className="subscription-details">
              Расширьте возможности с Premium подпиской
            </p>
          </div>
          <button 
            className="manage-button"  
            onClick={handleOpenModal}
          >
            Оформить подписку
          </button>
        </>
      )}
      
      {/* Модальное окно подписки  */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubscribe={onSubscribe}
        hasSubscription={hasSubscription}
      />
    </div>
  );
};

export default SubscriptionSection;