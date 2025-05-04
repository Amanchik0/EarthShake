import React, { useState } from 'react';
import styles from '../../features/Profile/profile.module.css';
import SubscriptionModal from '../Modal/SubscriptionModal';

interface SubscriptionSectionProps {
  hasSubscription: boolean;
  onSubscribe: () => Promise<void> | void;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ 
  hasSubscription, 
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
    <div className={styles.subscriptionSection}>
      <div className={styles.subscriptionInfo}>
        <h3 className={styles.subscriptionTitle}>Premium подписка</h3>
        <p className={styles.subscriptionDetails}>
          {hasSubscription 
            ? "Активна до 19 июля 2025 г. \nАвтопродление включено" 
            : "Оформите подписку, чтобы получить доступ ко всем возможностям платформы"}
        </p>
      </div>
      <button 
        className={styles.manageButton} 
        onClick={handleOpenModal}
      >
        {hasSubscription ? 'Управление подпиской' : 'Оформить подписку'}
      </button>

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