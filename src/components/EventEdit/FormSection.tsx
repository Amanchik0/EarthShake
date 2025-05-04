import React, { ReactNode } from 'react';
import styles from '../../features/Events/EventEditPage.module.css';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className={styles.formSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
};

export default FormSection;