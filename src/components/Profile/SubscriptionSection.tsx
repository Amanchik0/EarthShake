import React from 'react';

const SubscriptionSection: React.FC = () => {
  return (
    <div className="subscription-section">
      <div className="subscription-info">
        <h3 className="subscription-title">Premium подписка</h3>
        <p className="subscription-details">
          Активна до 19 июля 2025 г. <br />
          Автопродление включено
        </p>
        {/* 
        TODO : на чек юзера сабскрипшн  
        <ul className="subscription-features">
          <li>Создание неограниченного количества событий</li>
          <li>Отсутствие комиссии при продаже билетов</li>
          <li>Расширенная аналитика</li>
          <li>Приоритетная поддержка</li>
        </ul> */}
      </div>
      <button className="manage-button">Управление подпиской</button>
    </div>
  );
};

export default SubscriptionSection;