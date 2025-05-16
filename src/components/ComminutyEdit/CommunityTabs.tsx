import React from 'react';
import styles from '../../features/Community/CommunityEditPage/CommunityEditPage.module.css';

interface CommunityTabsProps {
  activeTab: 'profile' | 'events' | 'members' | 'statistics' | 'settings';
  onTabChange: (tab: 'profile' | 'events' | 'members' | 'statistics' | 'settings') => void;
}

const CommunityTabs: React.FC<CommunityTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.navTabs}>
      <div 
        className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
        onClick={() => onTabChange('profile')}
      >
        Профиль сообщества
      </div>

      <div 
        className={`${styles.tab} ${activeTab === 'events' ? styles.active : ''}`}
        onClick={() => onTabChange('events')}
      >
        События
      </div>

      <div 
        className={`${styles.tab} ${activeTab === 'members' ? styles.active : ''}`}
        onClick={() => onTabChange('members')}
      >
        Участники
      </div>
    </div>
  );
};

export default CommunityTabs;