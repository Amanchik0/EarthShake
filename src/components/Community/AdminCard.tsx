import React from 'react';
import { Admin } from '../../types/types';

interface AdminCardProps {
  admin: Admin;
}

const AdminCard: React.FC<AdminCardProps> = ({ admin }) => {
  return (
    <div className="admin-card">
      <div className="admin-avatar">
        <img src={admin.avatarUrl} alt={admin.name} />
      </div>
      <div className="admin-info">
        <h4>{admin.name}</h4>
        <div className="admin-role">{admin.role}</div>
      </div>
    </div>
  );
};

export default AdminCard;