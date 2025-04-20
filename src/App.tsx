import React from 'react';
import MainPage from './features/Main/MainPage';
import EventPage from './features/Events/EventPage';
import EventsListPage from './features/Events/EventsListPage';
import Header from './components/HeadFoot/Header';
import Footer from './components/HeadFoot/Footer';
import CommunityPage from './features/Community/CommunityPage';
import EvacuationPage from './features/Evacuation/EvacuationPage';
import ProfilePage from './features/Profile/ProfilePage';
import ProfileEditPage from './features/Profile/ProfileEditPage';
const App: React.FC = () => {
  return ( 
    <div>
    <Header/>
    {/* <CommunityPage /> */}
    {/* <MainPage/> */}
    {/* <EventsListPage/> */}
    {/* <EventPage/> */}
    {/* <EvacuationPage/> */}
    <ProfilePage/>
    {/* <ProfileEditPage/> */}
    <Footer/> 
  </div>

);
};

export default App;