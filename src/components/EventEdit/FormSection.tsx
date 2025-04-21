import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="form-section">
      <h2 className="section-title">{title}</h2>
      {children}
    </div>
  );
};

export default FormSection;