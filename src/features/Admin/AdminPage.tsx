import React, { useState } from 'react';
import './AdminPage.css'
const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'events' | 'communities'>('users');
  const [showUsersFilter, setShowUsersFilter] = useState(false);
  const [showEventsFilter, setShowEventsFilter] = useState(false);
  const [showCommunitiesFilter, setShowCommunitiesFilter] = useState(false);

  const toggleFilterDropdown = (filterType: 'users' | 'events' | 'communities') => {
    switch (filterType) {
      case 'users':
        setShowUsersFilter(!showUsersFilter);
        setShowEventsFilter(false);
        setShowCommunitiesFilter(false);
        break;
      case 'events':
        setShowEventsFilter(!showEventsFilter);
        setShowUsersFilter(false);
        setShowCommunitiesFilter(false);
        break;
      case 'communities':
        setShowCommunitiesFilter(!showCommunitiesFilter);
        setShowUsersFilter(false);
        setShowEventsFilter(false);
        break;
    }
  };

  return (
    <div className="container">
      {/* Боковая панель */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">A</div>
          <div className="logo-text">Админ-панель</div>
        </div>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="#" className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
              <span>👥</span>
              <span>Пользователи</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className={`nav-link ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
              <span>🗓️</span>
              <span>События</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className={`nav-link ${activeTab === 'communities' ? 'active' : ''}`} onClick={() => setActiveTab('communities')}>
              <span>👪</span>
              <span>Сообщества</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span>⚙️</span>
              <span>Настройки</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span>📊</span>
              <span>Статистика</span>
            </a>
          </li>
        </ul>
        
        <div className="admin-profile">
          <div className="admin-avatar">А</div>
          <div className="admin-info">
            <div className="admin-name">Администратор</div>
            <div className="admin-role">Главный админ</div>
          </div>
        </div>
      </aside>
      
      {/* Основной контент */}
      <main className="content">
        <div className="header">
          <h1 className="title">Панель управления</h1>
        </div>
        
        {/* Табы */}
        <div className="tab-container">
          <div className="tabs">
            <div className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
              <div className="badge">
                <span>Пользователи</span>
                <span className="badge-count">254</span>
              </div>
            </div>
            <div className={`tab ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
              <div className="badge">
                <span>События</span>
                <span className="badge-count">45</span>
              </div>
            </div>
            <div className={`tab ${activeTab === 'communities' ? 'active' : ''}`} onClick={() => setActiveTab('communities')}>
              <div className="badge">
                <span>Сообщества</span>
                <span className="badge-count">32</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Содержимое таба "Пользователи" */}
        <div id="users" className={`tab-content ${activeTab === 'users' ? 'active' : ''}`}>
          <div className="search-filter-container">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" className="search-input" placeholder="Поиск пользователей..." />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button className="filter-button" onClick={() => toggleFilterDropdown('users')}>
                <span>Фильтр</span>
                <span>▼</span>
              </button>
              
              <div id="usersFilter" className={`filter-dropdown ${showUsersFilter ? 'show' : ''}`}>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="withSubscription" />
                  <label htmlFor="withSubscription">С подпиской</label>
                </div>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="withoutSubscription" />
                  <label htmlFor="withoutSubscription">Без подписки</label>
                </div>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="activeUsers" />
                  <label htmlFor="activeUsers">Активные</label>
                </div>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="blockedUsers" />
                  <label htmlFor="blockedUsers">Заблокированные</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="data-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Статус</th>
                  <th>Дата регистрации</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="user-info">
                      <div className="avatar">АМ</div>
                      <div className="user-details">
                        <span className="user-name">Алексей Морозов</span>
                        <span className="user-email">alex@example.com</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="status status-premium">С подпиской</span></td>
                  <td className="date-cell">15 апр 2025</td>
                  <td>
                    <div className="actions">
                      <button className="action-btn">✏️</button>
                      <button className="action-btn">🔒</button>
                      <button className="action-btn">❌</button>
                    </div>
                  </td>
                </tr>
                {/* Остальные строки таблицы пользователей */}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <button className="page-button">«</button>
            <button className="page-button active">1</button>
            <button className="page-button">2</button>
            <button className="page-button">3</button>
            <button className="page-button">»</button>
          </div>
        </div>
        
        {/* Содержимое таба "События" */}
        <div id="events" className={`tab-content ${activeTab === 'events' ? 'active' : ''}`}>
          <div className="search-filter-container">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" className="search-input" placeholder="Поиск событий..." />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button className="filter-button" onClick={() => toggleFilterDropdown('events')}>
                <span>Фильтр</span>
                <span>▼</span>
              </button>
              
              <div id="eventsFilter" className={`filter-dropdown ${showEventsFilter ? 'show' : ''}`}>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="activeEvents" />
                  <label htmlFor="activeEvents">Активные</label>
                </div>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="pastEvents" />
                  <label htmlFor="pastEvents">Прошедшие</label>
                </div>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="privateEvents" />
                  <label htmlFor="privateEvents">Приватные</label>
                </div>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="publicEvents" />
                  <label htmlFor="publicEvents">Публичные</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="data-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Событие</th>
                  <th>Организатор</th>
                  <th>Статус</th>
                  <th>Участники</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="user-info">
                      <div className="event-image">🎉</div>
                      <div className="user-details">
                        <span className="user-name">Встреча разработчиков</span>
                        <span className="user-email">Технологии, Нетворкинг</span>
                      </div>
                    </div>
                  </td>
                  <td>Алексей Морозов</td>
                  <td><span className="status status-active">Активный</span></td>
                  <td>24</td>
                  <td className="date-cell">25 апр 2025</td>
                  <td>
                    <div className="actions">
                      <button className="action-btn">✏️</button>
                      <button className="action-btn">🔒</button>
                      <button className="action-btn">❌</button>
                    </div>
                  </td>
                </tr>
                {/* Остальные строки таблицы событий */}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <button className="page-button">«</button>
            <button className="page-button active">1</button>
            <button className="page-button">2</button>
            <button className="page-button">»</button>
          </div>
        </div>
        
        {/* Содержимое таба "Сообщества" */}
        <div id="communities" className={`tab-content ${activeTab === 'communities' ? 'active' : ''}`}>
          <div className="search-filter-container">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" className="search-input" placeholder="Поиск сообществ..." />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button className="filter-button" onClick={() => toggleFilterDropdown('communities')}>
                <span>Фильтр</span>
                <span>▼</span>
              </button>
              
              <div id="communitiesFilter" className={`filter-dropdown ${showCommunitiesFilter ? 'show' : ''}`}>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="activeCommunities" />
                  <label htmlFor="activeCommunities">Активные</label>
                </div>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="privateCommunities" />
                  <label htmlFor="privateCommunities">Приватные</label>
                </div>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="publicCommunities" />
                  <label htmlFor="publicCommunities">Публичные</label>
                </div>
                <div className="filter-option">
                  <input type="checkbox" className="filter-checkbox" id="verifiedCommunities" />
                  <label htmlFor="verifiedCommunities">Верифицированные</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="data-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Сообщество</th>
                  <th>Создатель</th>
                  <th>Тип</th>
                  <th>Участники</th>
                  <th>Дата создания</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="user-info">
                      <div className="community-image">💻</div>
                      <div className="user-details">
                        <span className="user-name">Программисты</span>
                        <span className="user-email">Технологии, IT</span>
                      </div>
                    </div>
                  </td>
                  <td>Алексей Морозов</td>
                  <td><span className="status status-active">Публичное</span></td>
                  <td>156</td>
                  <td className="date-cell">1 мар 2025</td>
                  <td>
                    <div className="actions">
                      <button className="action-btn">✏️</button>
                      <button className="action-btn">🔒</button>
                      <button className="action-btn">❌</button>
                    </div>
                  </td>
                </tr>
                {/* Остальные строки таблицы сообществ */}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <button className="page-button">«</button>
            <button className="page-button active">1</button>
            <button className="page-button">2</button>
            <button className="page-button">»</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;