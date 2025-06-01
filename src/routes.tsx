// src/app/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/HeadFoot/Header';
import Footer from './components/HeadFoot/Footer';

import MainPage from './features/Main/MainPage';
import EventPage from './features/Events/EventPage/EventPage';
import EventsListPage from './features/Events/EventsListPage/EventsListPage';
import EventEditPage from './features/Events/EventEditPage/EventEditPage';
import EventCreationPage from './features/Events/EventsCreatePage/EventsCreatePage';

import CommunitiesListPage from './features/Community/CommunitiesListPage/CommunitiesListPage';
import CommunityPage from './features/Community/CommunityPage/CommunityPage';
import CommunityEditPage from './features/Community/CommunityEditPage/CommunityEditPage';
import CommunityCreatePage from './features/Community/CommunityCreatePage/CommunityCreatePage';

import EvacuationPage from './features/Evacuation/EvacuationPage';
import ReferencePage from './features/Reference/ReferencePage';
import SupportPage from './features/Support/SupportPage';
import ProfilePage from './features/Profile/ProfilePage';
import ProfileEditPage from './features/Profile/ProfileEditPage';
import NewsListPage from './features/News/NewsListPage';
import AuthPage from './features/AuthPage/AuthPage';
import LoginPage from './features/AuthPage/LoginPage';
import EmergencyNotification from './features/Emergency/EmergencyNotification';
import NotFoundPage from './features/NotFoundPage/NotFoundPage';
import AdminPage from './features/Admin/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import CommunityMembersPage from './features/Community/CommunityPage/CommunityMembersPage';
import CommunityEventsPage from './features/Community/CommunityPage/CommunityEventPage';

type Props = {
  isEmergency: boolean;
};

const AppRoutes: React.FC<Props> = ({ isEmergency }) => (
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
              <Route path="/events/:id/edit" element={<ProtectedRoute><EventEditPage /></ProtectedRoute>} />
              <Route path="/events/create" element={<ProtectedRoute><EventCreationPage /></ProtectedRoute>} />

              <Route path="/communities" element={<CommunitiesListPage />} />
              <Route path="/communities/:id" element={<CommunityPage />} />
              <Route path="/communities/create" element={<CommunityCreatePage />} />
              <Route path="/communities/edit/:id" element={<ProtectedRoute><CommunityEditPage /></ProtectedRoute>} />
              <Route path="/communities/:id/members" element={<ProtectedRoute><CommunityMembersPage /></ProtectedRoute>} />
              <Route path="/communities/:id/events" element={<ProtectedRoute><CommunityEventsPage /></ProtectedRoute>} />


              <Route path="/evacuation" element={<EvacuationPage />} />
              <Route path="/reference" element={<ReferencePage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/news" element={<NewsListPage />} />
              <Route path="/emergency" element={<EmergencyNotification />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </>
          )}
        </Routes>
        <Footer />
      </div>
    } />
    <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
  </Routes>
);

export default AppRoutes;
