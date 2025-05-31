import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunityApi } from '../../hooks/useCommunityApi';
import styles from './CommunityCard.module.css';
import { CommunityDetails } from '../../types/community';

interface CommunityCardProps {
  community: CommunityDetails;
  onCommunityUpdate?: (updatedCommunity: CommunityDetails) => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, onCommunityUpdate }) => {
  const navigate = useNavigate();
  const { joinCommunity, leaveCommunity } = useCommunityApi();
  const [isJoining, setIsJoining] = useState(false);
  const [localCommunity, setLocalCommunity] = useState(community);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isJoining) return;
    
    setIsJoining(true);
    
    try {
      if (localCommunity.isMember) {
        await leaveCommunity(localCommunity.id);
        // Локально обновляем состояние
        const updatedCommunity = {
          ...localCommunity,
          isMember: false,
          numberMembers: localCommunity.numberMembers - 1,
          membersCount: localCommunity.membersCount - 1
        };
        setLocalCommunity(updatedCommunity);
        onCommunityUpdate?.(updatedCommunity);
      } else {
        await joinCommunity(localCommunity.id);
        // Локально обновляем состояние
        const updatedCommunity = {
          ...localCommunity,
          isMember: true,
          numberMembers: localCommunity.numberMembers + 1,
          membersCount: localCommunity.membersCount + 1
        };
        setLocalCommunity(updatedCommunity);
        onCommunityUpdate?.(updatedCommunity);
      }
    } catch (error) {
      console.error('Error joining/leaving community:', error);
      // В случае ошибки все равно показываем изменение (API fallback)
      const updatedCommunity = {
        ...localCommunity,
        isMember: !localCommunity.isMember,
        numberMembers: localCommunity.isMember 
          ? localCommunity.numberMembers - 1 
          : localCommunity.numberMembers + 1,
        membersCount: localCommunity.isMember 
          ? localCommunity.membersCount - 1 
          : localCommunity.membersCount + 1
      };
      setLocalCommunity(updatedCommunity);
      onCommunityUpdate?.(updatedCommunity);
    } finally {
      setIsJoining(false);
    }
  };

  const handleNavigate = () => {
    navigate(`/communities/${localCommunity.id}`);
  };

  const formatMemberCount = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  const getCategoryLabel = (category: string): string => {
    const categoryLabels: Record<string, string> = {
      'hobby': 'Хобби',
      'technology': 'Технологии',
      'arts': 'Искусство',
      'sports': 'Спорт',
      'education': 'Образование',
      'social': 'Социальные',
      'business': 'Бизнес',
      'other': 'Другое'
    };
    return categoryLabels[category] || category;
  };

  return (
    <div className={styles.communityCard} onClick={handleNavigate}>
      <div className={styles.header}>
        {localCommunity.coverUrl ? (
          <img src={localCommunity.coverUrl} alt={localCommunity.name} />
        ) : (
          <div className={styles.defaultCover}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        )}
        <div className={styles.avatar}>
          <img 
            src={localCommunity.avatarUrl} 
            alt={localCommunity.name}
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/70/70';
            }}
          />
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{localCommunity.name}</h3>
        
        <div className={styles.category}>
          {getCategoryLabel(localCommunity.category)}
        </div>
        
        <div className={styles.info}>
          <div className={styles.members}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {formatMemberCount(localCommunity.numberMembers)} участников
          </div>
          <div className={styles.location}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {localCommunity.location}
          </div>
        </div>

        {localCommunity.rating > 0 && (
          <div className={styles.rating}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </svg>
            {localCommunity.rating.toFixed(1)}
          </div>
        )}
        
        <button
          className={`${styles.joinButton} ${localCommunity.isMember ? styles.joined : ''} ${isJoining ? styles.loading : ''}`}
          onClick={handleJoin}
          disabled={isJoining}
        >
          {isJoining ? (
            <>
              <div className={styles.spinner}></div>
              {localCommunity.isMember ? 'Выход...' : 'Вступление...'}
            </>
          ) : (
            localCommunity.isMember ? 'Вы участник' : 'Вступить'
          )}
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;