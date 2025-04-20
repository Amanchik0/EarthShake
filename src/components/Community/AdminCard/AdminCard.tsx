import React from 'react';
import styles from './AdminCard.module.css';
import { Admin } from '../../../types/types';

const AdminCard: React.FC<{ admin: Admin }> = ({ admin }) => {
  return (
    <div className={styles.adminCard}>
      <div className={styles.adminAvatar}>
        <img src={admin.avatarUrl} alt={admin.name} />
      </div>
      <div className={styles.adminInfo}>
        <h4>{admin.name}</h4>
        <div className={styles.adminRole}>{admin.role}</div>
      </div>
    </div>
  );
};

export default AdminCard;