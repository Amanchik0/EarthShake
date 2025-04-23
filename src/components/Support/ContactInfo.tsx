import React from 'react';

const ContactInfo: React.FC = () => {
  return (
    <div className="contact-info">
      <div className="contact-item">
        <div className="contact-icon">📞</div>
        <div>
          <h3>Телефон</h3>
          <p>8-800-123-45-67</p>
          <p>Ежедневно с 9:00 до 21:00</p>
        </div>
      </div>
      
      <div className="contact-item">
        <div className="contact-icon">✉️</div>
        <div>
          <h3>Email</h3>
          <p>support@example.com</p>
          <p>Отвечаем в течение 24 часов</p>
        </div>
      </div>
      
      <div className="contact-item">
        <div className="contact-icon">💬</div>
        <div>
          <h3>Чат</h3>
          <p>Онлайн-чат доступен на нашем сайте</p>
          <p>Круглосуточно без выходных</p>
        </div>
      </div>
      
      <div className="contact-item">
        <div className="contact-icon">🏢</div>
        <div>
          <h3>Офис</h3>
          <p>г. Москва, ул. Примерная, д. 123</p>
          <p>Пн-Пт: 10:00-19:00</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;