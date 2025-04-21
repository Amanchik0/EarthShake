import React, { ReactNode } from 'react';

interface ReferenceSectionProps {
  title: string;
  content: ReactNode;
}

const ReferenceSection: React.FC<ReferenceSectionProps> = ({ title, content }) => {
  return (
    <div className="reference-section">
      <h4 className="section-title">{title}</h4>
      {content}
    </div>
  );
};

export default ReferenceSection;