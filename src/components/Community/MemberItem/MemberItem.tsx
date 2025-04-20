import React from 'react';
import styles from './MemberItem.module.css';
import { Member } from '../../../types/types';

const MemberItem: React.FC<{ member: Member }> = ({ member }) => {
  return (
    <div className={styles.memberItem}>
      <div className={styles.memberAvatar}>
        <img src={member.avatarUrl} alt={member.name} />
      </div>
      <div className={styles.memberName}>{member.name}</div>
    </div>
  );
};

export default MemberItem;