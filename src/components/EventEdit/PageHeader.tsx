import React from 'react';
import styles from '../../features/Events/EventEditPage/EventEditPage.module.css';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className={styles.pageHeader}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
};

export default PageHeader;