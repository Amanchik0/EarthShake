// src/App.tsx
import React from 'react';
import { useAuth } from './components/auth/AuthContext';
import { useAdLogic } from './hooks/useAdLogic';
import { useEmergencySystem } from './hooks/useEmergencySystem';
import AppRoutes from './routes';
import AdModal from './components/Modal/AdModal';
import EmergencyStatusIndicator from './components/EmergencyStatus/EmergencyStatusIndicator';

const App: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { adData, handleCloseAd, handleAdClick } = useAdLogic();
  const { 
    isEmergency, 
    emergencyData, 
    isLoading, 
    error, 
    forceCheck,
    lastChecked 
  } = useEmergencySystem();

  // Показываем рекламу только если нет ЧС
  const shouldShowAd = adData && (!user || !user.isSubscriber) && !isEmergency;

  console.log('Emergency system status:', {
    isEmergency,
    hasEmergencyData: !!emergencyData,
    isLoading,
    error,
    lastChecked,
    userCity: user?.city || 'не авторизован'
  });

  console.log('Ad display check:', {
    hasAdData: !!adData,
    isUserLoggedIn: !!user,
    isSubscriber: user?.isSubscriber,
    isEmergency,
    shouldShowAd
  });

  // Показываем загрузку только при первой инициализации
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e2e8f0', 
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b', fontSize: '16px' }}>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Индикатор статуса экстренной ситуации */}
      <EmergencyStatusIndicator 
        isEmergency={isEmergency}
        isLoading={isLoading}
        error={error}
        onRefresh={forceCheck}
      />
      
      {/* Модальное окно рекламы (скрыто во время ЧС) */}
      {shouldShowAd && (
        <AdModal 
          ad={adData} 
          onClose={handleCloseAd} 
          onAdClick={handleAdClick} 
        />
      )}
      
      <AppRoutes 
        isEmergency={isEmergency} 
        emergencyData={emergencyData} 
      />
      
      {/* Глобальные стили для анимации загрузки */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default App;