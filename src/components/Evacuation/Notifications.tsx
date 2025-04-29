import React from 'react';
import { Notification } from '../../types/types';
import styles from '../../features/Evacuation/EvacuationPage.module.css';

interface NotificationsProps {
  title: string;
  items: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ title, items }) => {
  return (
    <div className={styles.sidebarCard}>
      <div className={styles.sidebarTitle}>{title}</div>
      <div>
        {items.map(item => (
          <div key={item.id} className={styles.notificationItem}>
            <div className={styles.notificationIcon}>{item.icon}</div>
            <div className={styles.notificationContent}>
              <div className={styles.notificationTitle}>{item.title}</div>
              <div className={styles.notificationText}>{item.message}</div>
              <div className={styles.notificationTime}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;