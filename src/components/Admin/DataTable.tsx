import { TabType, User, Event, Community } from '../../types/adminTypes';
import <UserInfo></UserInfo> from '../UserInfj';

const mockUsers: User[] = [
  {
    id: '1',
    avatar: 'АМ',
    name: 'Алексей Морозов',
    email: 'alex@example.com',
    status: 'premium',
    registrationDate: '15 апр 2025'
  },
  // ... more mock data
];

const mockEvents: Event[] = [
  {
    id: '1',
    icon: '🎉',
    name: 'Встреча разработчиков',
    category: 'Технологии, Нетворкинг',
    organizer: 'Алексей Морозов',
    status: 'active',
    participants: 24,
    date: '25 апр 2025'
  },
  // ... more mock data
];

const mockCommunities: Community[] = [
  {
    id: '1',
    icon: '💻',
    name: 'Программисты',
    category: 'Технологии, IT',
    creator: 'Алексей Морозов',
    type: 'public',
    members: 156,
    creationDate: '1 мар 2025'
  },
  // ... more mock data
];

const DataTable = ({ tab }: { tab: TabType }) => {
  const renderTable = () => {
    switch (tab) {
      case 'users':
        return (
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
              {mockUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <UserInfo 
                      avatar={user.avatar}
                      name={user.name}
                      email={user.email}
                    />
                  </td>
                  <td>
                    <span className={`status status-${user.status}`}>
                      {user.status === 'premium' ? 'С подпиской' : 
                       user.status === 'active' ? 'Активный' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="date-cell">{user.registrationDate}</td>
                  <td>
                    <div className="actions">
                      <button className="action-btn">✏️</button>
                      <button className="action-btn">🔒</button>
                      <button className="action-btn">❌</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      // Similar implementations for events and communities
      default:
        return null;
    }
  };

  return (
    <div className="data-card">
      {renderTable()}
    </div>
  );
};

export default DataTable;