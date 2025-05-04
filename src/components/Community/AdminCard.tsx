import React from 'react';
import { Admin } from '../../types/types';
import styles from './AdminCard.module.css';

interface AdminCardProps {
  admin: Admin;
}

const AdminCard: React.FC<AdminCardProps> = ({ admin }) => {
  return (
    <div className={styles.adminCard}>
      <div className={styles.avatar}>
        <img src={admin.avatarUrl} alt={admin.name} />
      </div>
      
      <div className={styles.info}>
        <h4>{admin.name}</h4>
        <div className={styles.role}>{admin.role}</div>
      </div>
    </div>
  );
};

export default AdminCard;