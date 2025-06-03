import React from 'react';
import { ProfileTabsProps } from '../../types/profile';
import styles from '../../features/Profile/profile.module.css';

const tabs = ['События', 'Сообщества', 'Подписка'];

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.profileTabs}>
      {tabs.map((tab, index) => (
        <div
          key={tab}
          className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default ProfileTabs;