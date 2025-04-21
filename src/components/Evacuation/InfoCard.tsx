import React from 'react';
import { InfoItem } from '../../types/types';

interface InfoCardProps {
  title: string;
  items: InfoItem[];
}

const InfoCard: React.FC<InfoCardProps> = ({ title, items }) => {
  return (
    <div className="sidebar-card">
      <div className="sidebar-title">{title}</div>
      <div className="info-list">
        {items.map(item => (
          <div key={item.id} className="info-item">
            <div className="info-icon">{item.icon}</div>
            <div className="info-content">
              <div className="info-title">{item.title}</div>
              <div className="info-text">{item.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;