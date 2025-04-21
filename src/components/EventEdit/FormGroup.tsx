import React, { ReactNode } from 'react';

interface FormGroupProps {
  children: ReactNode;
  fullWidth?: boolean;
}

const FormGroup: React.FC<FormGroupProps> = ({ children, fullWidth = false }) => {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      {children}
    </div>
  );
};

export default FormGroup;