import React from 'react';

const EmergencyBanner: React.FC = () => {
  const handleCall = () => {
    window.location.href = 'tel:112';
  };

  return (
    <div className="emergency-banner">
      <div className="emergency-banner-content">
        <h2>Экстренная ситуация?</h2>
        <p>Если вам требуется немедленная помощь, позвоните в службу спасения.</p>
      </div>
      <div className="emergency-number">
        <div>
          <div className="emergency-number-label">Горячая линия</div>
          <div className="emergency-number-value">112</div>
        </div>
        <button className="action-btn primary" onClick={handleCall}>
          <span>📞</span>
          <span>Позвонить</span>
        </button>
      </div>
    </div>
  );
};

export default EmergencyBanner;