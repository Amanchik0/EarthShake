// tabs/EventsTab.tsx
import React, { useState } from 'react';
import EventModal from './EventModal';

const EventsTab: React.FC = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Мастер-класс по живописи",
      date: "25 апреля 2025",
      description: "Научимся основам акварельной техники",
      participants: 24,
      status: "active"
    },
    // Другие события...
  ]);

  const handleAddEvent = (newEvent: any) => {
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    setShowEventModal(false);
  };

  return (
    <div className="profile-section">
      <div className="section-title">
        <span>События сообщества</span>
        <button onClick={() => setShowEventModal(true)}>+ Добавить событие</button>
      </div>
      
      <div className="search-bar">
        <input type="text" placeholder="Поиск событий..." />
        <div className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
      
      {events.map(event => (
        <div key={event.id} className="card">
          <div className="card-content">
            <div className="event-date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {event.date}
            </div>
            <div className="event-title">{event.title}</div>
            <div className="event-description">{event.description}</div>
            <div className="event-details">
              <div className="event-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                {event.participants} участников
              </div>
              <div className="event-detail">
                <span className={`status ${event.status === 'active' ? 'status-active' : 'status-pending'}`}>
                  {event.status === 'active' ? 'Активное' : 'Отложенное'}
                </span>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <button className="action-btn">✏️</button>
            <button className="action-btn">❌</button>
          </div>
        </div>
      ))}
      
      {showEventModal && (
        <EventModal 
          onClose={() => setShowEventModal(false)} 
          onSave={handleAddEvent} 
        />
      )}
    </div>
  );
};

export default EventsTab;