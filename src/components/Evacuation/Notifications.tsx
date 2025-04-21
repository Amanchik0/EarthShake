import React from 'react';
import { Notification } from '../../types/types';

interface NotificationsProps {
  title: string;
  items: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ title, items }) => {
  return (
    <div className="sidebar-card">
      <div className="sidebar-title">{title}</div>
      <div className="notifications">
        {items.map(item => (
          <div key={item.id} className="notification-item">
            <div className="notification-icon">{item.icon}</div>
            <div className="notification-content">
              <div className="notification-title">{item.title}</div>
              <div className="notification-text">{item.message}</div>
              <div className="notification-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;