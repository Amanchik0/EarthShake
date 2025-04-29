import React from 'react';

interface ContentHeaderProps {
  title: string;
  updateDate: string;
  articlesCount: number;
  styles: any;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ title, updateDate, articlesCount, styles }) => {
  return (
    <div className={styles.contentHeader}>
      <h1 className={styles.contentTitle}>
        {title}
      </h1>
      <div className={styles.contentMeta}>
        <span>
          Последнее обновление: {updateDate}
        </span>
        <span>
          •
        </span>
        <span>
          Статей в разделе: {articlesCount}
        </span>
      </div>
    </div>
  );
};

export default ContentHeader;