import React from 'react';
import { Community } from '../../types/types';
import styles from './CommunityHeader.module.css';

interface CommunityHeaderProps {
  community: Community;
  onJoin: () => void;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ community, onJoin }) => {
  return (
    <div className={styles.communityHeader}>
      <div className={styles.avatar}>
        <img src={community.avatarUrl} alt={community.name} />
      </div>
      
      <div className={styles.info}>
        <h1 className={styles.name}>{community.name}</h1>
        
        <div className={styles.meta}>
          <div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
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
        
        <div className={styles.description}>
          {community.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <button className={styles.joinButton} onClick={onJoin}>
          {community.isMember ? 'Вы участник' : 'Вступить в сообщество'}
        </button>
      </div>
    </div>
  );
};

export default CommunityHeader;