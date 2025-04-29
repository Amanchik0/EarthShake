import React, { ReactNode } from 'react';

interface ReferenceSectionProps {
  title: string;
  content: ReactNode;
  styles: any;
}

const ReferenceSection: React.FC<ReferenceSectionProps> = ({ title, content, styles }) => {
  return (
    <div className={styles.referenceSection}>
      <h3 className={styles.sectionTitle}>
        {title}
      </h3>
      {content}
    </div>
  );
};

export default ReferenceSection;