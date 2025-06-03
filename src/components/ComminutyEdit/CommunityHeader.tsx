
import React from 'react';

interface CommunityHeaderProps {
  onPreview: () => void;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ onPreview }) => {
  return (
    <header>
      <div className="header-logo">
        <img src="/api/placeholder/36/36" alt="Логотип сообщества" />
        <h1>Управление сообществом</h1>
      </div>
      <div className="header-actions">
        <button className="secondary" onClick={onPreview}>Предпросмотр</button>
        <button className="secondary">Выйти</button>
      </div>
    </header>
  );
};

export default CommunityHeader;