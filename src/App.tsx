import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Импорт компонентов страниц
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
import SupportPage from './features/Support/SupportPage';
import AdminPage from './features/Admin/AdminPage';
import CommunityEditPage from './features/Community/CommunityEditPage';
import NotFoundPage from './features/NotFoundPage/NotFoundPage';
import AuthPage from './features/AuthPage/AuthPage';
import LoginPage from './features/AuthPage/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/events" element={<EventsListPage />} />
            <Route path="/events/:id" element={<EventPage />} />
            <Route path="/communities" element={<CommunityPage />} />
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
            {/* <Route path="/events/edit/:id" element={
              // <ProtectedRoute>
                <EventEditPage />
              // </ProtectedRoute>
            } /> */}
            {/* <Route path="/events/create" element={
              // <ProtectedRoute>
                <EventEditPage />
              // </ProtectedRoute>
            } /> */}
            {/* <Route path="/communities/edit/:id" element={
              // <ProtectedRoute>
                <CommunityEditPage />
              // </ProtectedRoute>
            } /> */}
            
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Footer />
        </div>
      } />

      <Route path="/admin" element={
        // <ProtectedRoute>
          <AdminPage />
        // </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;