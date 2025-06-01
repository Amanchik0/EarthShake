import React, { useEffect, useState } from 'react';

interface AdModalProps {
  ad: {
    name: string;
    mediaUrl: string;
    targetUrl: string;
  };
  onClose: () => void;
  onAdClick?: () => void; // Добавляем callback для обработки кликов
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
  transition: 'transform 0.2s ease',
};

const timerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 12,
  fontSize: 14,
  color: '#999',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  left: 12,
  background: 'none',
  border: 'none',
  fontSize: 20,
  cursor: 'pointer',
  color: '#999',
  padding: 4,
};

const AdModal: React.FC<AdModalProps> = ({ ad, onClose, onAdClick }) => {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onClose]);

  const handleClick = () => {
    // Вызываем callback для обновления счетчика кликов
    if (onAdClick) {
      onAdClick();
    }
    
    // Открываем ссылку
    window.open(ad.targetUrl, '_blank');
  };

  const handleImageHover = (e: React.MouseEvent<HTMLImageElement>) => {
    e.currentTarget.style.transform = 'scale(1.05)';
  };

  const handleImageLeave = (e: React.MouseEvent<HTMLImageElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button 
          style={closeButtonStyle}
          onClick={onClose}
          title="Закрыть"
        >
          ✕
        </button>
        
        <div style={timerStyle}>
          Закроется через {secondsLeft} сек
        </div>
        
        <img
          src={ad.mediaUrl}
          alt="Реклама"
          style={imageStyle}
          onClick={handleClick}
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageLeave}
        />
        
        <h2 style={{ margin: '16px 0', fontSize: '18px', color: '#333' }}>
          {ad.name}
        </h2>
        
        <p style={{ color: '#666', fontSize: '14px', margin: '8px 0' }}>
          Нажмите на изображение, чтобы перейти
        </p>
        
        <button
          onClick={handleClick}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '12px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
          }}
        >
          Перейти
        </button>
      </div>
    </div>
  );
};

export default AdModal;