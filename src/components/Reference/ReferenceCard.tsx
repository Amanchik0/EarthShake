import React, { ReactNode } from 'react';

interface ReferenceCardProps {
  title: string;
  content: ReactNode;
  styles: any;
}

const ReferenceCard: React.FC<ReferenceCardProps> = ({ title, content, styles }) => {
  return (
    <div className={styles.referenceCard}>
      <div className={styles.referenceContent}>
        <h2 className={styles.referenceTitle}>
          {title}
        </h2>
        {content}
      </div>
    </div>
  );
};

export default ReferenceCard;