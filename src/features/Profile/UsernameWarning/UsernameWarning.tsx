// components/Profile/UsernameWarning.tsx
import React, { useState, useEffect } from 'react';
import styles from './UsernameWarning.module.css';

interface UsernameWarningProps {
  currentUsername: string;
  newUsername: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

interface UsageStats {
  communities: number;
  events: number;
  total: number;
}

const UsernameWarning: React.FC<UsernameWarningProps> = ({
  currentUsername,
  newUsername,
  onConfirm,
  onCancel,
  isVisible
}) => {
  const [usage, setUsage] = useState<UsageStats>({ communities: 0, events: 0, total: 0 });
  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    if (isVisible && currentUsername) {
      checkUsage();
    }
  }, [isVisible, currentUsername]);

  const checkUsage = async () => {
    setLoadingUsage(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUsage({ communities: 0, events: 0, total: 0 });
        return;
      }

      const response = await fetch('http://localhost:8090/api/community/get-all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const communities = data.content || [];
        
        const communityCount = communities.filter((community: any) => 
          community.author === currentUsername || 
          (community.users && community.users.includes(currentUsername))
        ).length;

        setUsage({ communities: communityCount, events: 0, total: communityCount });
      } else {
        setUsage({ communities: 0, events: 0, total: 0 });
      }
    } catch (error) {
      console.error('Ошибка проверки использования username:', error);
      setUsage({ communities: 0, events: 0, total: 0 });
    } finally {
      setLoadingUsage(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.warningIcon}>⚠️</div>
          <h2 className={styles.title}>Смена username</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.changeInfo}>
            <p className={styles.changeText}>
              Вы собираетесь изменить username:
            </p>
            <div className={styles.usernameChange}>
              <span className={styles.oldUsername}>{currentUsername}</span>
              <span className={styles.arrow}>→</span>
              <span className={styles.newUsername}>{newUsername}</span>
            </div>
          </div>

          <div className={styles.warningInfo}>
            <h3 className={styles.warningTitle}>Что произойдет:</h3>
            <ul className={styles.warningList}>
              <li>Ваш username будет обновлен во всех сообществах где вы участвуете</li>
              <li>Ваш username будет обновлен во всех событиях где вы участвуете</li>
              <li>Это действие нельзя отменить</li>
              <li>Другие пользователи увидят ваш новый username</li>
            </ul>
          </div>

          {loadingUsage ? (
            <div className={styles.loadingUsage}>
              <div className={styles.spinner}></div>
              <span>Проверяем использование username...</span>
            </div>
          ) : usage.total > 0 ? (
            <div className={styles.usageStats}>
              <h3 className={styles.usageTitle}>Текущее использование:</h3>
              <div className={styles.statsGrid}>
                {usage.communities > 0 && (
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{usage.communities}</span>
                    <span className={styles.statLabel}>сообществ</span>
                  </div>
                )}
                {usage.events > 0 && (
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{usage.events}</span>
                    <span className={styles.statLabel}>событий</span>
                  </div>
                )}
              </div>
              <p className={styles.updateNote}>
                Все эти записи будут автоматически обновлены
              </p>
            </div>
          ) : (
            <div className={styles.noUsage}>
              <p>Ваш username не используется в сообществах и событиях</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel}
            type="button"
          >
            Отменить
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm}
            disabled={loadingUsage}
            type="button"
          >
            {loadingUsage ? 'Проверка...' : 'Продолжить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsernameWarning;