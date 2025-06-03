import React, { ReactNode } from 'react';
import styles from '../../features/Events/EventEditPage/EventEditPage.module.css';

interface FormGroupProps {
  children: ReactNode;
  fullWidth?: boolean;
}

const FormGroup: React.FC<FormGroupProps> = ({ children, fullWidth = false }) => {
  return (
    <div className={`${styles.formGroup} ${fullWidth ? styles.fullWidth : ''}`}>
      {children}
    </div>
  );
};

export default FormGroup;