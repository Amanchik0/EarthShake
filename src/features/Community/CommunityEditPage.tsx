// CommunityEditPage.tsx
import React, { useState } from 'react';
import CommunityHeader from '../../components/ComminutyEdit/CommunityHeader';
import CommunityTabs from '../../components/ComminutyEdit/CommunityTabs';
import ProfileTab from '../../components/ComminutyEdit/ProfileTab';
import EventsTab from '../../components/ComminutyEdit/EventsTab';
import MembersTab from '../../components/ComminutyEdit/MemberTab';
import './CommunityEditPage.css'
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
    <div className="community-edit-page">
      {/* <CommunityHeader onPreview={() => showNotificationMessage('Предпросмотр сохранен!')} /> */}
      
      <div className="container">
        <CommunityTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className="tab-contents">
          {activeTab === 'profile' && <ProfileTab onSave={showNotificationMessage} />}
          {activeTab === 'events' && <EventsTab />}
          {activeTab === 'members' && <MembersTab />}

        </div>
      </div>

      {showNotification && (
        <div className="notification">
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default CommunityEditPage;