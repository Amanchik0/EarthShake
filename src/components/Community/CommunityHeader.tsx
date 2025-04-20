import React from 'react';
import { Community } from '../../types/types';

interface CommunityHeaderProps {
  community: Community;
  onJoin: () => void;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ community, onJoin }) => {
  return (
    <section className="community-header">
      <div className="community-avatar">
        <img src={community.avatarUrl} alt="Логотип сообщества" />
      </div>
      
      <div className="community-info">
        <h1 className="community-name">{community.name}</h1>
        
        <div className="community-meta">
          <div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {community.location}
          </div>
          <div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Создано: {community.createdAt}
          </div>
        </div>
        
        <div className="community-description">
          {community.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <button 
          className={`join-button ${community.isMember ? 'joined' : ''}`}
          onClick={onJoin}
        >
          {community.isMember ? 'Вы участник' : 'Вступить в сообщество'}
        </button>
      </div>
    </section>
  );
};

export default CommunityHeader;