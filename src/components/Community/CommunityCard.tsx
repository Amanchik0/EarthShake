import React from 'react';
import { Community } from '../../types/types';
import styles from './CommunityCard.module.css';

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const handleJoin = () => {
    console.log('Join community:', community.id);
  };
  
  return (
    <div className={styles.communityCard}>
      <div className={styles.header}>
        {community.coverUrl && (
          <img src={community.coverUrl} alt={community.name} />
        )}
        <div className={styles.avatar}>
          <img src={community.avatarUrl} alt={community.name} />
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{community.name}</h3>
        
        <div className={styles.info}>
          <div>
            {community.membersCount.toLocaleString()} участников
          </div>
          <div>
            {community.location}
          </div>
        </div>
        
        <button className={styles.joinButton} onClick={handleJoin}>
          {community.isMember ? 'Вы участник' : 'Вступить'}
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;