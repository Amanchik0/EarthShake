import React from 'react';
import MainPage from './features/Main/MainPage';
import EventPage from './features/Events/EventPage';
import EventsListPage from './features/Events/EventsListPage';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return ( 
    <div>
    <Header/>
    <EventsListPage />
    <Footer/>
  </div>

);
};

export default App;