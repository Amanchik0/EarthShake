import React from 'react';
import styles from './CommunityCard.module.css';
import { Community } from '../../../types/types';

const CommunityCard: React.FC<{ community: Community }> = ({ community }) => {
  return (
    <div className={styles.communityCard}>
      <div className={styles.communityCardHeader}>
        {community.coverUrl && <img src={community.coverUrl} alt="Обложка сообщества" />}
        <div className={styles.communityCardAvatar}>
          <img src={community.avatarUrl} alt="Логотип сообщества" />
        </div>
      </div>
      <div className={styles.communityCardContent}>
        <h3 className={styles.communityCardTitle}>{community.name}</h3>
        <div className={styles.communityCardInfo}>
          <div>{community.membersCount} участников</div>
          <div>{community.location}</div>
        </div>
        <button className={styles.joinSmallButton}>
          {community.isMember ? 'Вы вступили' : 'Вступить'}
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;