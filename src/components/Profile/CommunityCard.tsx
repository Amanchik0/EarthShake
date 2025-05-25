import React from 'react';
import { CommunityCardProps } from '../../types/profile';
import styles from '../../features/Profile/profile.module.css';

const CommunityCard: React.FC<CommunityCardProps> = ({ name, members, logoUrl }) => {
  return (
    <div className={styles.communityCard}>
      <img src={logoUrl} alt={name} className={styles.communityLogo} />
      <h3 className={styles.communityName}>{name}</h3>
      <p className={styles.communityMembers}>{members}</p>
    </div>
  );
};

export default CommunityCard;