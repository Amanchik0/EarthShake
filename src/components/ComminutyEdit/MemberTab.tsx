// tabs/MembersTab.tsx
import React, { useState } from 'react';

const MembersTab: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Алексей Морозов",
      role: "admin",
      lastActivity: "2 часа назад",
      joinDate: "15 апреля 2025"
    },
    // Другие участники...
  ]);

  const filteredMembers = activeFilter === 'all' 
    ? members 
    : members.filter(member => member.role === activeFilter);

  return (
    <div className="profile-section">
      <div className="section-title">Участники сообщества</div>
      
      <div className="filter-group">
        <div 
          className={`filter-option ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          Все ({members.length})
        </div>
        <div 
          className={`filter-option ${activeFilter === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveFilter('admin')}
        >
          Администраторы
        </div>
        {/* Другие фильтры... */}
      </div>
      
      <div className="search-bar">
        <input type="text" placeholder="Поиск участников..." />
        <div className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
      
      <div className="user-list">
        {filteredMembers.map(member => (
          <div key={member.id} className="user-item">
            <div className="card">
              <img src="/api/placeholder/50/50" alt={member.name} className="user-image" />
              <div className="card-content">
                <div className="user-name">{member.name}</div>
                <div className="user-role">
                  <span className={`badge ${member.role === 'admin' ? 'admin' : 'member'}`}>
                    {member.role === 'admin' ? 'Администратор' : 'Участник'}
                  </span>
                  <span>В сообществе с {member.joinDate}</span>
                </div>
                <div className="user-activity">Был(а) {member.lastActivity}</div>
              </div>
              <div className="card-actions">
                <button className="action-btn">✏️</button>
                <button className="action-btn danger">❌</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersTab;