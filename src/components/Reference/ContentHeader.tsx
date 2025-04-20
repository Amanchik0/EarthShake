import React from 'react';

interface ContentHeaderProps {
  title: string;
  updateDate: string;
  articlesCount: number;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ title, updateDate, articlesCount }) => {
  return (
    <div className="content-header">
      <h2 className="content-title">{title}</h2>
      <div className="content-meta">
        <div>Последнее обновление: {updateDate}</div>
        <div>•</div>
        <div>Статей в разделе: {articlesCount}</div>
      </div>
    </div>
  );
};

export default ContentHeader;