import React, { ReactNode } from 'react';
import styles from '../../features/Events/EventEditPage/EventEditPage.module.css';

interface FormRowProps {
  children: ReactNode;
}

const FormRow: React.FC<FormRowProps> = ({ children }) => {
  return <div className={styles.formRow}>{children}</div>;
};

export default FormRow;