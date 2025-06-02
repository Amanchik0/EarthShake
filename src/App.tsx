


import React from 'react';
import { useAdLogic } from './hooks/useAdLogic';
import { useEmergencyRedirect } from './hooks/useEmergencyRedirect';
import AppRoutes from './routes';
import AdModal from './components/Modal/AdModal';

const App: React.FC = () => {
  const { adData, handleCloseAd, handleAdClick } = useAdLogic();
  const isEmergency = useEmergencyRedirect();

  return (
    <>
      {adData && <AdModal ad={adData} onClose={handleCloseAd} onAdClick={handleAdClick} />}
      <AppRoutes isEmergency={isEmergency} />
    </>
  );
};

export default App;





