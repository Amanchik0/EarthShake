// src/App.tsx
import React, { FC } from 'react';
import HomePage from './pages/HomePage';
import Header from './features/main/components/Header';
import KazakhstanMap from './pages/EmergencyMapPage';
import Footer from './features/main/components/Footer';
import { Emergency } from '@mui/icons-material';
import EmergencyDescriptionPage from './pages/EmergencyDescriptionPage';


const App: FC = () => {
  return (  

      <div style={{backgroundColor: '#fff9f9'}}>
        <Header/> 
        {/* <HomePage/> */}
        <Footer />
        {/* <KazakhstanMap/> */}
        <EmergencyDescriptionPage/>
      </div>
  );
};

export default App;
