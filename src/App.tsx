import React from 'react';
import MainPage from './features/Main/MainPage';
import EventPage from './features/Events/EventPage';
import EventsListPage from './features/Events/EventsListPage';
import Header from './components/HeadFoot/Header';
import Footer from './components/HeadFoot/Footer';
import CommunityPage from './features/Community/CommunityPage';
import './var.css'
const App: React.FC = () => {
  return ( 
    <div>
    {/* <Header/> */}
    <CommunityPage />
    {/* <Footer/> */}
  </div>

);
};

export default App;