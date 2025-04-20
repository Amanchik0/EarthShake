import React, { ReactNode } from 'react';

interface ReferenceCardProps {
  title: string;
  content: ReactNode;
}

const ReferenceCard: React.FC<ReferenceCardProps> = ({ title, content }) => {
  return (
    <div className="reference-card">
      <div className="reference-content">
        <h3 className="reference-title">{title}</h3>
        {content}
      </div>
    </div>
  );
};

export default ReferenceCard;