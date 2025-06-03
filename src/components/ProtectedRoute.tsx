import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import SubscriptionCheckModal from '../components/Modal/SubscriptionCheckModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
  feature?: 'event' | 'community';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireSubscription = false,
  feature = 'event',
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoading && requireSubscription && user && !user.isSubscriber) {
      console.log(' Требуется подписка, показываем модалку');
      setShowModal(true);
    }
  }, [isLoading, requireSubscription, user]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '16px', color: '#666' }}>Проверка авторизации...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    console.log(' Пользователь не авторизован, перенаправляем на логин');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireSubscription && !user.isSubscriber) {
    console.log(' Требуется подписка, но у пользователя её нет');
    
    const handleCloseModal = () => {
      console.log(' Пользователь закрыл модалку, перенаправляем назад');
      setShowModal(false);
      window.history.back();
    };

    return (
      <>
        {showModal && (
          <SubscriptionCheckModal
            isOpen={showModal}
            onClose={handleCloseModal}
            feature={feature}
            targetPath={location.pathname}
          />
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          background: '#f8f9fa'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👑</div>
            <h2 style={{ margin: '0 0 16px', color: '#333' }}>Требуется Premium подписка</h2>
            <p style={{ color: '#666', margin: '0 0 24px' }}>
              Для доступа к этой странице необходима Premium подписка
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button 
                onClick={handleCloseModal}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Назад
              </button>
              <button 
                onClick={() => setShowModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Оформить подписку
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  console.log(' Все проверки пройдены, показываем контент');
  return <>{children}</>;
};

export default ProtectedRoute;