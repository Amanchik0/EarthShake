import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CommunityCard.module.css';
import { CommunityDetails } from '../../types/community';

interface CommunityCardProps {
  community: CommunityDetails;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    console.log('Join community:', community.id);
  };

  const handleNavigate = () => {
    navigate(`/communities/${community.id}`);
  };

  return (
    <div className={styles.communityCard} onClick={handleNavigate}>
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
            {community.numberMembers} участников
          </div>
          <div>
            {community.location}
          </div>
        </div>
        
        <button
          className={styles.joinButton}
          onClick={(e) => {
            e.stopPropagation(); // Останавливаем всплытие события, чтобы не срабатывал `handleNavigate`
            handleJoin();
          }}
        >
          {community.isMember ? 'Вы участник' : 'Вступить'}
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;