import React from 'react';
import { ProfileTabsProps } from '../../types/types';


const tabs = ['События', 'Сообщества', 'Подписка'];

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="profile-tabs">
      {tabs.map((tab, index) => (
        <div
          key={tab}
          className={`tab ${activeTab === index ? 'active' : ''}`}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default ProfileTabs;