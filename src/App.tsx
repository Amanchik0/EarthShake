import React from 'react';
import { useAuth } from './components/auth/AuthContext';
import { useAdLogic } from './hooks/useAdLogic';
import { useEmergencyRedirect } from './hooks/useEmergencyRedirect';
import AppRoutes from './routes';
import AdModal from './components/Modal/AdModal';

const App: React.FC = () => {
  const { user } = useAuth();
  const { adData, handleCloseAd, handleAdClick } = useAdLogic();
  const isEmergency = useEmergencyRedirect();


  const shouldShowAd = adData && (!user || !user.isSubscriber);

  console.log('Проверка показа рекламы:', {
    hasAdData: !!adData,
    isUserLoggedIn: !!user,
    isSubscriber: user?.isSubscriber,
    shouldShowAd
  });

  return (
    <>
      {shouldShowAd && (
        <AdModal 
          ad={adData} 
          onClose={handleCloseAd} 
          onAdClick={handleAdClick} 
        />
      )}
      <AppRoutes isEmergency={isEmergency} />
    </>
  );
};

export default App;