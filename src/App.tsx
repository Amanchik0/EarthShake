import React, { useState } from 'react';
import MainPage from './features/main/MainPage';
import EventPage from './features/Events/EventPage';
import EventsListPage from './features/Events/EventsListPage';
import Header from './components/HeadFoot/Header';
import Footer from './components/HeadFoot/Footer';
import CommunityPage from './features/Community/CommunityPage';
import EvacuationPage from './features/Evacuation/EvacuationPage';
import ProfilePage from './features/Profile/ProfilePage';
import ProfileEditPage from './features/Profile/ProfileEditPage';
import EventEditPage from './features/Events/EventEditPage';
import ReferencePage from './features/Reference/ReferencePage';
import SubscriptionModal from './components/Modal/SubscriptionModal';
import SupportPage from './features/Support/SupportPage';
import AdminPage from './features/Admin/AdminPage';
import CommunityEditPage from './features/Community/CommunityEditPage';
const App: React.FC = () => {




  return ( 
    <div>
      
    <Header/>
    {/* <CommunityPage />  */}
    {/* <MainPage/> */}
    {/* <EventsListPage/> */}
    {/* <EventPage/> */}
    {/* <EvacuationPage/> */}
    {/* <ProfilePage/> */}
    {/* <ProfileEditPage/> */}
    {/* <EventEditPage/> */}
    {/* <ReferencePage/> */}
    {/* <SupportPage/> */}
    {/* <AdminPage/> */}
    <CommunityEditPage/>
    <Footer/> 
  </div>

);
};

export default App;