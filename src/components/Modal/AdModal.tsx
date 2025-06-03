import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface AdModalProps {
  ad: {
    name: string;
    mediaUrl: string;
    targetUrl: string;
  };
  onClose: () => void;
  onAdClick?: () => void;
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

const subscriptionHintStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
  color: 'white',
  padding: '8px 12px',
  borderRadius: 6,
  fontSize: '12px',
  marginTop: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: 'none',
  fontWeight: '500',
};

const AdModal: React.FC<AdModalProps> = ({ ad, onClose, onAdClick }) => {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          onClose();
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
    console.log(' Клик по рекламе');
    
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

  const handleSubscriptionClick = () => {
    console.log(' Переход к оформлению подписки');
    onClose(); // Закрываем рекламу
    navigate('/profile'); // Переходим в профиль
  };

  const handleLoginClick = () => {
    console.log(' Переход к авторизации');
    onClose(); // Закрываем рекламу
    navigate('/login'); // Переходим на страницу входа
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
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
            transition: 'background-color 0.2s ease',
            marginRight: user ? '8px' : '0px' // Отступ только если пользователь авторизован
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

        {/* Показываем разные кнопки в зависимости от статуса пользователя */}
        {user ? (
          // Если пользователь авторизован, показываем кнопку Premium
          <>
            <button
              onClick={handleSubscriptionClick}
              style={subscriptionHintStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff1493, #e91e63)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff69b4, #ff1493)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
               Отключить рекламу с Premium
            </button>

            <p style={{ 
              color: '#999', 
              fontSize: '11px', 
              margin: '8px 0 0 0',
              lineHeight: '1.4'
            }}>
              Premium подписка отключает всю рекламу навсегда
            </p>
          </>
        ) : (
          // Если пользователь не авторизован, показываем кнопку входа
          <>
            <button
              onClick={handleLoginClick}
              style={{
                ...subscriptionHintStyle,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                marginTop: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
               Войти в аккаунт
            </button>

            <p style={{ 
              color: '#999', 
              fontSize: '11px', 
              margin: '8px 0 0 0',
              lineHeight: '1.4'
            }}>
              Войдите, чтобы получить доступ к Premium функциям
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdModal;