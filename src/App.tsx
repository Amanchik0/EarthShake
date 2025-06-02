// src/App.tsx
import React from 'react';
import { useAuth } from './components/auth/AuthContext';
import { useAdLogic } from './hooks/useAdLogic';
import { useEmergencySystem } from './hooks/useEmergencySystem';
import AppRoutes from './routes';
import AdModal from './components/Modal/AdModal';
import EmergencyStatusIndicator from './components/EmergencyStatus/EmergencyStatusIndicator';

const App: React.FC = () => {
  const { user } = useAuth();
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
    lastChecked
  });

  console.log('Ad display check:', {
    hasAdData: !!adData,
    isUserLoggedIn: !!user,
    isSubscriber: user?.isSubscriber,
    isEmergency,
    shouldShowAd
  });

  return (
    <>
      <EmergencyStatusIndicator 
        isEmergency={isEmergency}
        isLoading={isLoading}
        error={error}
        onRefresh={forceCheck}
      />
      
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
    </>
  );
};

export default App;