import React from 'react';
import SupportForm from './SupportForm';
import ContactInfo from './ContactInfo';

const SupportGrid: React.FC = () => {
  return (
    <div className="support-grid">
      <div className="support-card">
        <h2>Напишите нам</h2>
        <SupportForm />
      </div>
      
      <div className="support-card">
        <h2>Контактная информация</h2>
        <p>Вы можете связаться с нами любым удобным для вас способом:</p>
        <ContactInfo />
      </div>
    </div>
  );
};

export default SupportGrid;