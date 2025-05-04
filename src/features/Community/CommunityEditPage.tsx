// CommunityEditPage.tsx
import React, { useState } from 'react';
import CommunityTabs from '../../components/ComminutyEdit/CommunityTabs';
import ProfileTab from '../../components/ComminutyEdit/ProfileTab';
import EventsTab from '../../components/ComminutyEdit/EventsTab';
import MembersTab from '../../components/ComminutyEdit/MemberTab';
import styles from './CommunityEditPage.module.css';

const CommunityEditPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'events' | 'members' | 'statistics' | 'settings'>('profile');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.profileSection}>
        <CommunityTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className={styles.tabContentActive}>
          {activeTab === 'profile' && <ProfileTab onSave={(msg) => showNotificationMessage(msg)} />}
          {activeTab === 'events' && <EventsTab />}
          {activeTab === 'members' && <MembersTab />}
        </div>
      </div>

      {showNotification && (
        <div className={styles.notification}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default CommunityEditPage;