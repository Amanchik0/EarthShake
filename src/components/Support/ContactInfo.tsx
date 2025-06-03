import React from 'react';

interface ContactInfoProps {
  styles: any;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ styles }) => {
  return (
    <div className={styles.contactInfo}>
      <div className={styles.contactItem}>
        <div className={styles.contactIcon}>📞</div>
        <div>
          <h3>Телефон</h3>
          <p>8-771-001-01-01</p>
          <p>Ежедневно с 9:00 до 21:00</p>
        </div>
      </div>
      
      <div className={styles.contactItem}>
        <div className={styles.contactIcon}>✉️</div>
        <div>
          <h3>Email</h3>
          <p>support@cityvora.com</p>
          <p>Отвечаем в течение 24 часов</p>
        </div>
      </div>
      <div className={styles.contactItem}>
        <div className={styles.contactIcon}>🏢</div>
        <div>
          <h3>Офис</h3>
          <p>г. Алматы, ул. Манаса, д. 34</p>
          <p>Пн-Пт: 10:00-19:00</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;