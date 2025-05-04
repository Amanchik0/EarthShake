import React, { useState } from 'react';
import styles from './AdminPage.module.css';

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
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>A</div>
          
          <div className={styles.logoText}>Админ-панель</div>
          
        </div>
        
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <a href="#" className={`${styles.navLink} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => setActiveTab('users')}>
              <span>👥</span>
              <span>Пользователи</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#" className={`${styles.navLink} ${activeTab === 'events' ? styles.active : ''}`} onClick={() => setActiveTab('events')}>
              <span>🗓️</span>
              <span>События</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#" className={`${styles.navLink} ${activeTab === 'communities' ? styles.active : ''}`} onClick={() => setActiveTab('communities')}>
              <span>👪</span>
              <span>Сообщества</span>
            </a>
          </li>

        </ul>
        
        <div className={styles.adminProfile}>
          <div className={styles.adminAvatar}>А</div>
          <div className={styles.adminInfo}>
            <div className={styles.adminName}>Администратор</div>
            <div className={styles.adminRole}>Главный админ</div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Панель управления</h1>
        </div>
        
        {/* Tabs */}
        <div className={styles.tabContainer}>
          <div className={styles.tabs}>
            <div className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`} onClick={() => setActiveTab('users')}>
              <div className={styles.badge}>
                <span>Пользователи</span>
                <span className={styles.badgeCount}>254</span>
              </div>
            </div>
            <div className={`${styles.tab} ${activeTab === 'events' ? styles.tabActive : ''}`} onClick={() => setActiveTab('events')}>
              <div className={styles.badge}>
                <span>События</span>
                <span className={styles.badgeCount}>45</span>
              </div>
            </div>
            <div className={`${styles.tab} ${activeTab === 'communities' ? styles.tabActive : ''}`} onClick={() => setActiveTab('communities')}>
              <div className={styles.badge}>
                <span>Сообщества</span>
                <span className={styles.badgeCount}>32</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Users tab content */}
        <div className={`${styles.tabContent} ${activeTab === 'users' ? styles.tabContentActive : ''}`}>
          <div className={styles.searchFilterContainer}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>🔍</span>
              <input type="text" className={styles.searchInput} placeholder="Поиск пользователей..." />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button className={styles.filterButton} onClick={() => toggleFilterDropdown('users')}>
                <span>Фильтр</span>
                <span>▼</span>
              </button>
              
              <div className={`${styles.filterDropdown} ${showUsersFilter ? styles.show : ''}`}>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="withSubscription" />
                  <label htmlFor="withSubscription">С подпиской</label>
                </div>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="withoutSubscription" />
                  <label htmlFor="withoutSubscription">Без подписки</label>
                </div>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="activeUsers" />
                  <label htmlFor="activeUsers">Активные</label>
                </div>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="blockedUsers" />
                  <label htmlFor="blockedUsers">Заблокированные</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.dataCard}>
            <table className={styles.table}>
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
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>АМ</div>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>Алексей Морозов</span>
                        <span className={styles.userEmail}>alex@example.com</span>
                      </div>
                    </div>
                  </td>
                  <td><span className={`${styles.status} ${styles.statusPremium}`}>С подпиской</span></td>
                  <td className={styles.dateCell}>15 апр 2025</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn}>✏️</button>
                      <button className={styles.actionBtn}>🔒</button>
                      <button className={styles.actionBtn}>❌</button>
                    </div>
                  </td>
                </tr>
                {/* Other rows can be added here */}
              </tbody>
            </table>
          </div>
          
          <div className={styles.pagination}>
            <button className={styles.pageButton}>«</button>
            <button className={`${styles.pageButton} ${styles.pageButtonActive}`}>1</button>
            <button className={styles.pageButton}>2</button>
            <button className={styles.pageButton}>3</button>
            <button className={styles.pageButton}>»</button>
          </div>
        </div>
        
        {/* Events tab content */}
        <div className={`${styles.tabContent} ${activeTab === 'events' ? styles.tabContentActive : ''}`}>
          <div className={styles.searchFilterContainer}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>🔍</span>
              <input type="text" className={styles.searchInput} placeholder="Поиск событий..." />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button className={styles.filterButton} onClick={() => toggleFilterDropdown('events')}>
                <span>Фильтр</span>
                <span>▼</span>
              </button>
              
              <div className={`${styles.filterDropdown} ${showEventsFilter ? styles.show : ''}`}>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="activeEvents" />
                  <label htmlFor="activeEvents">Активные</label>
                </div>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="pastEvents" />
                  <label htmlFor="pastEvents">Прошедшие</label>
                </div>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="privateEvents" />
                  <label htmlFor="privateEvents">Приватные</label>
                </div>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="publicEvents" />
                  <label htmlFor="publicEvents">Публичные</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.dataCard}>
            <table className={styles.table}>
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
                    <div className={styles.userInfo}>
                      <div className={styles.eventImage}>🎉</div>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>Встреча разработчиков</span>
                        <span className={styles.userEmail}>Технологии, Нетворкинг</span>
                      </div>
                    </div>
                  </td>
                  <td>Алексей Морозов</td>
                  <td><span className={`${styles.status} ${styles.statusActive}`}>Активный</span></td>
                  <td>24</td>
                  <td className={styles.dateCell}>25 апр 2025</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn}>✏️</button>
                      <button className={styles.actionBtn}>🔒</button>
                      <button className={styles.actionBtn}>❌</button>
                    </div>
                  </td>
                </tr>
                {/* Other rows can be added here */}
              </tbody>
            </table>
          </div>
          
          <div className={styles.pagination}>
            <button className={styles.pageButton}>«</button>
            <button className={`${styles.pageButton} ${styles.pageButtonActive}`}>1</button>
            <button className={styles.pageButton}>2</button>
            <button className={styles.pageButton}>»</button>
          </div>
        </div>
        
        {/* Communities tab content */}
        <div className={`${styles.tabContent} ${activeTab === 'communities' ? styles.tabContentActive : ''}`}>
          <div className={styles.searchFilterContainer}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>🔍</span>
              <input type="text" className={styles.searchInput} placeholder="Поиск сообществ..." />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button className={styles.filterButton} onClick={() => toggleFilterDropdown('communities')}>
                <span>Фильтр</span>
                <span>▼</span>
              </button>
              
              <div className={`${styles.filterDropdown} ${showCommunitiesFilter ? styles.show : ''}`}>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="activeCommunities" />
                  <label htmlFor="activeCommunities">Активные</label>
                </div>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="privateCommunities" />
                  <label htmlFor="privateCommunities">Приватные</label>
                </div>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="publicCommunities" />
                  <label htmlFor="publicCommunities">Публичные</label>
                </div>
                <div className={styles.filterOption}>
                  <input type="checkbox" className={styles.filterCheckbox} id="verifiedCommunities" />
                  <label htmlFor="verifiedCommunities">Верифицированные</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.dataCard}>
            <table className={styles.table}>
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
                    <div className={styles.userInfo}>
                      <div className={styles.communityImage}>💻</div>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>Программисты</span>
                        <span className={styles.userEmail}>Технологии, IT</span>
                      </div>
                    </div>
                  </td>
                  <td>Алексей Морозов</td>
                  <td><span className={`${styles.status} ${styles.statusActive}`}>Публичное</span></td>
                  <td>156</td>
                  <td className={styles.dateCell}>1 мар 2025</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn}>✏️</button>
                      <button className={styles.actionBtn}>🔒</button>
                      <button className={styles.actionBtn}>❌</button>
                    </div>
                  </td>
                </tr>
                {/* Other rows can be added here */}
              </tbody>
            </table>
          </div>
          
          <div className={styles.pagination}>
            <button className={styles.pageButton}>«</button>
            <button className={`${styles.pageButton} ${styles.pageButtonActive}`}>1</button>
            <button className={styles.pageButton}>2</button>
            <button className={styles.pageButton}>»</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;