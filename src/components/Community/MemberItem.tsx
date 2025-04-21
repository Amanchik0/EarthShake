import React from 'react';
import { Member } from '../../types/types';

interface MemberItemProps {
  member: Member;
}

const MemberItem: React.FC<MemberItemProps> = ({ member }) => {
  return (
    <div className="member-item">
      <div className="member-avatar">
        <img src={member.avatarUrl} alt={member.name} />
      </div>
      <div className="member-name">{member.name}</div>
    </div>
  );
};

export default MemberItem;