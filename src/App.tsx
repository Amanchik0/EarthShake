// src/App.tsx
import React, { FC } from 'react';
import HomePage from './pages/HomePage';
import Header from './features/main/components/Header';
import KazakhstanMap from './pages/EmergencyMapPage';


const App: FC = () => {
  return (  

      <div style={{backgroundColor: '#fff9f9'}}>
        <Header/> 
        {/* <HomePage/> */}
        <KazakhstanMap/>
      </div>
  );
};

export default App;
