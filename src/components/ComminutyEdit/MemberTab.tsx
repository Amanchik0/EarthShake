// tabs/MembersTab.tsx
import React, { useState } from 'react';
import styles from '../../features/Community/CommunityEditPage/CommunityEditPage.module.css';


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
    {
      id: 2,
      name: "Елена Смирнова",
      role: "member",
      lastActivity: "вчера",
      joinDate: "20 марта 2025"
    },
    {
      id: 3,
      name: "Иван Петров",
      role: "member",
      lastActivity: "3 дня назад",
      joinDate: "5 февраля 2025"
    },
    {
      id: 4,
      name: "Мария Козлова",
      role: "admin",
      lastActivity: "неделю назад",
      joinDate: "10 января 2025"
    }
  ]);

  const filteredMembers = activeFilter === 'all' 
    ? members 
    : members.filter(member => member.role === activeFilter);

  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionTitle}>
        Участники сообщества
      </div>
      
      <div className={styles.filterGroup}>
        <div 
          className={`${styles.filterOption} ${activeFilter === 'all' ? styles.filterOptionActive : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          Все ({members.length})
        </div>

        <div 
          className={`${styles.filterOption} ${activeFilter === 'admin' ? styles.filterOptionActive : ''}`}
          onClick={() => setActiveFilter('admin')}
        >
          Администраторы
        </div>
      </div>

      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Поиск участников..." 
          className={styles.input}
        />
        <div className={styles.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <div className={styles.userList}>
        {filteredMembers.map(member => (
          <div key={member.id} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.profileHeader}>
                <img 
                  src="/api/placeholder/50/50" 
                  alt={member.name} 
                  className={styles.userImage} 
                />
                <div className={styles.profileInfo}>
                  <div className={styles.userName}>
                    {member.name}
                  </div>
                  <div className={styles.userRole}>
                    <span className={`${styles.badge} ${member.role === 'admin' ? styles.badgeAdmin : styles.badgeMember}`}>
                      {member.role === 'admin' ? 'Администратор' : 'Участник'}
                    </span>
                    <span>В сообществе с {member.joinDate}</span>
                  </div>
                  <div className={styles.userActivity}>
                    Был(а) {member.lastActivity}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button className={styles.button}>✏️</button>
              <button className={`${styles.button} ${styles.buttonDanger}`}>❌</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersTab;
