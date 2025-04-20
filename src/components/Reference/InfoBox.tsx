import React from 'react';

interface InfoBoxProps {
  title: string;
  content: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, content }) => {
  return (
    <div className="info-box">
      <div className="info-box-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {title}
      </div>
      <p>{content}</p>
    </div>
  );
};

export default InfoBox;