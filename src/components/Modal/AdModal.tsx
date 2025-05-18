import React, { useEffect, useState } from 'react';

interface AdModalProps {
  ad: {
    name: string;
    mediaUrl: string;
    targetUrl: string;
  };
  onClose: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  padding: '32px 24px',
  borderRadius: 12,
  maxWidth: 400,
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  position: 'relative',
};

const imageStyle: React.CSSProperties = {
  maxWidth: '100%',
  marginBottom: 16,
  borderRadius: 8,
  cursor: 'pointer',
};

const timerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 12,
  fontSize: 14,
  color: '#999',
};

const AdModal: React.FC<AdModalProps> = ({ ad, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      onClose();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onClose]);

  const handleClick = () => {
    window.open(ad.targetUrl, '_blank');
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={timerStyle}>Закроется через {secondsLeft} сек</div>
        <img
          src={ad.mediaUrl}
          alt="Реклама"
          style={imageStyle}
          onClick={handleClick}
        />
        <h2>{ad.name}</h2>
        <p>Нажмите на изображение, чтобы перейти</p>
      </div>
    </div>
  );
};

export default AdModal;
