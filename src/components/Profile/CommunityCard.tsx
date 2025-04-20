import React from 'react';
import { CommunityCardProps } from '../../types/types';


const CommunityCard: React.FC<CommunityCardProps> = ({ name, members, logoUrl }) => {
  return (
    <div className="community-card">
      <img src={logoUrl} alt={name} className="community-logo" />
      <h3 className="community-name">{name}</h3>
      <p className="community-members">{members}</p>
    </div>
  );
};

export default CommunityCard;