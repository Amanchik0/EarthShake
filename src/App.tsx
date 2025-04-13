// src/App.tsx
import React, { FC } from 'react';
import HomePage from './pages/HomePage';
import Header from './features/main/components/Header';
import KazakhstanMap from './pages/EmergencyMapPage';
import Footer from './features/main/components/Footer';
import { Emergency } from '@mui/icons-material';
import EmergencyDescriptionPage from './pages/EmergencyDescriptionPage';
import GuidelinesPage from './pages/GuidelinesPage';
import LatestEventsPage from './pages/NewsPage';
import NewsDescriptionPage from './pages/NewsDescriptionPage';
import ProfilePage from './pages/ProflePage';


const App: FC = () => {
  return (  

      <div style={{backgroundColor: '#fff9f9'}}>
        <Header/> 
        {/* <HomePage/> */}
        {/* <GuidelinesPage/> */}
        {/* <NewsPage /> */}
        {/* <NewsDescriptionPage/> */}
        <ProfilePage/>
        <Footer />
        {/* <KazakhstanMap/> */}
        {/* <EmergencyDescriptionPage/> */}
      </div>
  );
};

export default App;
