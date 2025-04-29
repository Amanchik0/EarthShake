import React from 'react';
import { Member } from '../../types/types';
import styles from './MemberItem.module.css';

interface MemberItemProps {
  member: Member;
}

const MemberItem: React.FC<MemberItemProps> = ({ member }) => {
  return (
    <div className={styles.memberItem}>
      <div className={styles.avatar}>
        <img src={member.avatarUrl} alt={member.name} />
      </div>
      <div className={styles.name}>{member.name}</div>
    </div>
  );
};

export default MemberItem;