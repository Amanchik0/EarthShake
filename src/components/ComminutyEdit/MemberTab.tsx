// tabs/MembersTab.tsx
import React, { useState, useEffect } from 'react';
import { Community } from '../../types/community';
import styles from '../../features/Community/CommunityEditPage/CommunityEditPage.module.css';

interface Member {
  id: string;
  username: string;
  role: 'admin' | 'member';
  joinDate?: string;
  lastActivity?: string;
}

interface MembersTabProps {
  community: Community;
  onMessage: (message: string) => void;
}

const MembersTab: React.FC<MembersTabProps> = ({ community, onMessage }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  // Преобразуем список пользователей сообщества в структуру участников
  useEffect(() => {
    if (community) {
      const membersList: Member[] = community.users.map(username => ({
        id: username,
        username: username,
        role: username === community.author ? 'admin' : 'member',
        joinDate: 'Неизвестно', // В API нет данных о дате присоединения
        lastActivity: 'Неизвестно' // В API нет данных об активности
      }));

      setMembers(membersList);
    }
  }, [community]);

  // Фильтрация участников
  const filteredMembers = members.filter(member => {
    const matchesFilter = activeFilter === 'all' || member.role === activeFilter;
    const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const adminCount = members.filter(m => m.role === 'admin').length;

  const handleRemoveMember = async (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    // Нельзя удалить автора сообщества
    if (member.username === community.author) {
      onMessage('Нельзя удалить создателя сообщества');
      return;
    }

    const confirmed = window.confirm(`Удалить участника "${member.username}" из сообщества?`);
    if (!confirmed) return;

    setLoading(true);

    try {
      // В данном случае мы обновляем список пользователей в сообществе
      const updatedUsers = community.users.filter(username => username !== member.username);
      
      const token = localStorage.getItem('accessToken');
      const updatePayload = {
        ...community,
        users: updatedUsers,
        numberMembers: updatedUsers.length
      };

      const response = await fetch('http://localhost:8090/api/community/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error(`Ошибка удаления участника: ${response.status}`);
      }

      // Обновляем локальный список
      setMembers(prev => prev.filter(m => m.id !== memberId));
      onMessage(`Участник "${member.username}" удален из сообщества`);

    } catch (error) {
      console.error('❌ Ошибка удаления участника:', error);
      onMessage('Ошибка при удалении участника');
    } finally {
      setLoading(false);
    }
  };

  // ЗАКОММЕНТИРОВАН ФУНКЦИОНАЛ ИЗМЕНЕНИЯ РОЛИ (СТАНОВЛЕНИЕ МОДЕРАТОРОМ)
  /*
  const handleChangeRole = async (memberId: string, newRole: 'admin' | 'member') => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    // Нельзя изменить роль создателя сообщества
    if (member.username === community.author) {
      onMessage('Нельзя изменить роль создателя сообщества');
      return;
    }

    const confirmed = window.confirm(
      `Изменить роль участника "${member.username}" на "${newRole === 'admin' ? 'Администратор' : 'Участник'}"?`
    );
    if (!confirmed) return;

    setLoading(true);

    try {
      // Обновляем локальный список (в реальном API нужно было бы отправить запрос)
      setMembers(prev => prev.map(m => 
        m.id === memberId ? { ...m, role: newRole } : m
      ));

      onMessage(`Роль участника "${member.username}" изменена на "${newRole === 'admin' ? 'Администратор' : 'Участник'}"`);

    } catch (error) {
      console.error('❌ Ошибка изменения роли:', error);
      onMessage('Ошибка при изменении роли участника');
    } finally {
      setLoading(false);
    }
  };
  */

  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionTitle}>
        Участники сообщества
        <span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--gray-medium)' }}>
          ({members.length} всего)
        </span>
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
          Администраторы ({adminCount})
        </div>

        <div 
          className={`${styles.filterOption} ${activeFilter === 'member' ? styles.filterOptionActive : ''}`}
          onClick={() => setActiveFilter('member')}
        >
          Участники ({members.length - adminCount})
        </div>
      </div>

      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Поиск участников по имени..." 
          className={styles.input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={styles.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className={styles.noData}>
          {searchQuery ? 'Участники не найдены' : 'Участники скоро появятся'}
        </div>
      ) : (
        <div className={styles.userList}>
          {filteredMembers.map(member => (
            <div key={member.id} className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.profileHeader}>
                  <img 
                    src="/api/placeholder/50/50" 
                    alt={member.username} 
                    className={styles.userImage} 
                  />
                  <div className={styles.profileInfo}>
                    <div className={styles.userName}>
                      {member.username}
                      {member.username === community.author && (
                        <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--pink-primary)' }}>
                          (Создатель)
                        </span>
                      )}
                    </div>
                    <div className={styles.userRole}>
                      <span className={`${styles.badge} ${member.role === 'admin' ? styles.badgeAdmin : styles.badgeMember}`}>
                        {member.role === 'admin' ? 'Администратор' : 'Участник'}
                      </span>
                      {member.joinDate && (
                        <span>В сообществе с {member.joinDate}</span>
                      )}
                    </div>
                    {member.lastActivity && (
                      <div className={styles.userActivity}>
                        Последняя активность: {member.lastActivity}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                {member.username !== community.author && (
                  <>
                    {/*  КНОПКА ИЗМЕНЕНИЯ РОЛИ */}
                    {/*
                    <button 
                      className={styles.button}
                      onClick={() => handleChangeRole(
                        member.id, 
                        member.role === 'admin' ? 'member' : 'admin'
                      )}
                      disabled={loading}
                      title={`Сделать ${member.role === 'admin' ? 'участником' : 'администратором'}`}
                    >
                      {member.role === 'admin' ? '👤' : '👑'}
                    </button>
                    */}
                    <button 
                      className={`${styles.button} ${styles.buttonDanger}`}
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={loading}
                      title="Удалить из сообщества"
                    >
                      ❌
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Обработка запроса...</p>
        </div>
      )}
    </div>
  );
};

export default MembersTab;