// CommunityTabs.tsx
import React from 'react';

interface CommunityTabsProps {
  activeTab: 'profile' | 'events' | 'members' | 'statistics' | 'settings';
  onTabChange: (tab: 'profile' | 'events' | 'members' | 'statistics' | 'settings') => void;
}

const CommunityTabs: React.FC<CommunityTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="nav-tabs">
      <div 
        className={`tab ${activeTab === 'profile' ? 'active' : ''}`} 
        onClick={() => onTabChange('profile')}
      >
        Профиль сообщества
      </div>
      <div 
        className={`tab ${activeTab === 'events' ? 'active' : ''}`} 
        onClick={() => onTabChange('events')}
      >
        События
      </div>
      <div 
        className={`tab ${activeTab === 'members' ? 'active' : ''}`} 
        onClick={() => onTabChange('members')}
      >
        Участники
      </div>
      
    </div>
  );
};

export default CommunityTabs;