import React, { useState } from 'react';
import MainPage from './features/Main/MainPage';
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
const App: React.FC = () => {


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscribe = async () => {
    // Здесь может быть реальный запрос к API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert('Подписка успешно оформлена!');
        resolve();
      }, 1500);
    });
  };
  return ( 
    <div>
    <Header/>
    {/* <CommunityPage />  */}
    {/* <MainPage/> */}
    {/* <EventsListPage/> */}
    {/* <EventPage/> */}
    {/* <EvacuationPage/> */}
    <ProfilePage/>
    {/* <ProfileEditPage/> */}
    {/* <EventEditPage/> */}
    {/* <ReferencePage/> */}
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition-colors"
      >
        Открыть модальное окно подписки
      </button>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
    <Footer/> 
  </div>

);
};

export default App;