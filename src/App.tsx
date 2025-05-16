import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import MainPage from './features/main/MainPage';
import EventPage from './features/Events/EventPage';
import EventsListPage from './features/Events/EventsListPage';
import Header from './components/HeadFoot/Header';
import Footer from './components/HeadFoot/Footer';
import CommunityPage from './features/Community/CommunityPage/CommunityPage';
import EvacuationPage from './features/Evacuation/EvacuationPage';
import ProfilePage from './features/Profile/ProfilePage';
import ProfileEditPage from './features/Profile/ProfileEditPage';
import EventEditPage from './features/Events/EventEditPage';
import ReferencePage from './features/Reference/ReferencePage';
import SupportPage from './features/Support/SupportPage';
import AdminPage from './features/Admin/AdminPage';
import CommunityEditPage from './features/Community/CommunityEditPage/CommunityEditPage';
import NotFoundPage from './features/NotFoundPage/NotFoundPage';
import AuthPage from './features/AuthPage/AuthPage';
import LoginPage from './features/AuthPage/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import EmergencyNotification from './features/Emergency/EmergencyNotification';
import CommunitiesListPage from './features/Community/CommunitiesListPage/CommunitiesListPage';
import CommunityCreatePage from './features/Community/CommunityCreatePage/CommunityCreatePage';

const App: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = { emergency: false 

       };  // флажка на модалку 
      
      setIsEmergency(data.emergency);

      const allowedDuringEmergency = ['/emergency', '/reference', '/evacuation' , '/support'];
      if (data.emergency && !allowedDuringEmergency.includes(location.pathname)) {
        navigate('/emergency', { replace: true });
      }
    }, );

    return () => clearInterval(interval);
  }, [navigate, location.pathname]);


  // if (!isEmergency) {
  //   return null; 
  // }
  
  return (
    <Routes>
      <Route path="/*" element={
        <div>
          <Header />
          <Routes>
          {isEmergency ? (
              <>
                <Route path="/emergency" element={<EmergencyNotification />} />
                <Route path="/reference" element={<ReferencePage />} />
                <Route path="/evacuation" element={<EvacuationPage />} />
                <Route path="/support" element={<SupportPage />} />

                <Route path="*" element={<Navigate to="/emergency" replace />} />
              </>
            ) : (
              <>
            <Route path="/" element={<MainPage />} />
            <Route path="/events" element={<EventsListPage />} />
            <Route path="/events/:id" element={<EventPage />} />
            <Route path="/communities/:id" element={<CommunityPage />} />
            <Route path="/communities/" element={<CommunitiesListPage />} />

            <Route path="/evacuation" element={<EvacuationPage />} />
            <Route path="/reference" element={<ReferencePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            {/* <Routw path='eve' */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/  /:id" element={
              <ProtectedRoute>
                <EventEditPage />
              </ProtectedRoute>
            } />
            <Route path="/events/create" element={
              <ProtectedRoute>
                <EventEditPage />
              </ProtectedRoute>
            } />
            <Route path="/communities/create" element={
                <CommunityCreatePage />

            } />
            <Route path="/communities/edit/:id" element={
              <ProtectedRoute>
                <CommunityEditPage />
               </ProtectedRoute>
            } />
            <Route path='/emergency' element={<EmergencyNotification/>}/>
            <Route path="*" element={<Navigate to="/404" replace />} />
              </>
            )}
          </Routes>
          <Footer />
        </div>
      } />

      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;








