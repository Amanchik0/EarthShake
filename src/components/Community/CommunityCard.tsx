import React from 'react';
import { Community } from '../../types/types';

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const handleJoin = () => {
    console.log('Join community:', community.id);
  };

  return (
    <div className="community-card">
      <div className="community-card-header">
        {community.coverUrl && (
          <img src={community.coverUrl} alt="Обложка сообщества" />
        )}
        <div className="community-card-avatar">
          <img src={community.avatarUrl} alt="Логотип сообщества" />
        </div>
      </div>
      <div className="community-card-content">
        <h3 className="community-card-title">{community.name}</h3>
        <div className="community-card-info">
          <div>{community.membersCount.toLocaleString()} участников</div>
          <div>{community.location}</div>
        </div>
        <button 
          className={`join-small-button ${community.isMember ? 'joined' : ''}`}
          onClick={handleJoin}
        >
          {community.isMember ? 'Вы участник' : 'Вступить'}
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;