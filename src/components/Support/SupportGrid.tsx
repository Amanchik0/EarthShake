import React from 'react';
import SupportForm from './SupportForm';
import ContactInfo from './ContactInfo';

interface SupportGridProps {
  styles: any;
}

const SupportGrid: React.FC<SupportGridProps> = ({ styles }) => {
  return (
    <div className={styles.supportGrid}>
      <div className={styles.supportCard}>
        <h2>Напишите нам</h2>
        <SupportForm styles={styles} />
      </div>
      
      <div className={styles.supportCard}>
        <h2>Контактная информация</h2>
        <p>Вы можете связаться с нами любым удобным для вас способом:</p>
        <ContactInfo styles={styles} />
      </div>
    </div>
  );
};

export default SupportGrid;