import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Типы данных
interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  city: string;
  imageUrl: string | null;
  phoneNumber: string | null;
  isSubscriber: boolean;
  registrationDate: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  author: string;
  city: string;
  dateTime: string;
  tags: string[];
  usersIds: string[];
}

interface Community {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  numberMembers: number;
  type: string;
  createdAt: string;
  author: string;
  city: string;
}

interface Advertisement {
  id?: string;
  name: string;
  mediaUrl: string;
  type: 'BANNER' | 'VIDEO';
  targetUrl: string;
  finishDate: string;
  active?: boolean;
  showCount?: number;
  clickCount?: number;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'events' | 'communities' | 'ads'>('users');
  const [showFilterDropdown, setShowFilterDropdown] = useState<string | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  
  // Данные
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  
  // Состояния загрузки
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // API функции
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8090/api/users/get-all');
      const data = await response.json();
      setUsers(data.content || []);
    } catch (err) {
      setError('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8090/api/events/get-all');
      const data = await response.json();
      setEvents(data.content || []);
    } catch (err) {
      setError('Ошибка загрузки событий');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8090/api/community/get-all');
      const data = await response.json();
      setCommunities(data.content || []);
    } catch (err) {
      setError('Ошибка загрузки сообществ');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8090/api/advertisement/get-all');
      const data = await response.json();
      
      // API возвращает один объект рекламы, оборачиваем в массив
      if (data && data.id) {
        setAdvertisements([data]);
      } else if (Array.isArray(data)) {
        setAdvertisements(data);
      } else if (data && Array.isArray(data.content)) {
        setAdvertisements(data.content);
      } else {
        setAdvertisements([]);
      }
    } catch (err) {
      setError('Ошибка загрузки рекламы');
      setAdvertisements([]);
    } finally {
      setLoading(false);
    }
  };

  // Функции удаления
  const deleteUser = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    
    try {
      await fetch(`http://localhost:8090/api/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Ошибка удаления пользователя');
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это событие?')) return;
    
    try {
      await fetch(`http://localhost:8090/api/events/${id}`, { method: 'DELETE' });
      setEvents(events.filter(event => event.id !== id));
    } catch (err) {
      setError('Ошибка удаления события');
    }
  };

  const deleteCommunity = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это сообщество?')) return;
    
    try {
      await fetch(`http://localhost:8090/api/community/${id}`, { method: 'DELETE' });
      setCommunities(communities.filter(community => community.id !== id));
    } catch (err) {
      setError('Ошибка удаления сообщества');
    }
  };

  useEffect(() => {
    switch (activeTab) {
      case 'users':
        fetchUsers();
        break;
      case 'events':
        fetchEvents();
        break;
      case 'communities':
        fetchCommunities();
        break;
      case 'ads':
        fetchAdvertisements();
        break;
    }
  }, [activeTab]);

  const toggleFilterDropdown = (filterType: string) => {
    setShowFilterDropdown(showFilterDropdown === filterType ? null : filterType);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <aside style={{
        width: '260px',
        background: 'linear-gradient(180deg, #ec4899 0%, #a1a1aa 100%)',
        color: 'white',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', marginBottom: '32px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ec4899',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>A</div>
          <div style={{ fontSize: '20px', fontWeight: '600' }}>Админ-панель</div>
        </div>
        
        <ul style={{ listStyle: 'none' }}>
          {[
            { id: 'users', icon: '👥', label: 'Пользователи', count: users.length },
            { id: 'events', icon: '🗓️', label: 'События', count: events.length },
            { id: 'communities', icon: '👪', label: 'Сообщества', count: communities.length },
            { id: 'ads', icon: '📢', label: 'Реклама', count: Array.isArray(advertisements) ? advertisements.length : 0 }
          ].map(item => (
            <li key={item.id} style={{ marginBottom: '6px' }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id as any);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  backgroundColor: activeTab === item.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                <span style={{
                  marginLeft: 'auto',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {item.count}
                </span>
              </a>
            </li>
          ))}
        </ul>
        
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer'
        }}
        onClick={() => {
                            navigate('/profile')

          console.log('Переход на страницу профиля');
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#ec4899'
          }}>А</div>
          <div>
            <div style={{ fontWeight: '500' }}>Администратор</div>
            <div style={{ fontSize: '12px', opacity: '0.8' }}>Главный админ</div>
          </div>
        </div>
      </aside>
      
      <main style={{ flex: 1, padding: '24px', backgroundColor: '#f9fafb' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#4b5563' }}>Панель управления</h1>
            <button
              onClick={() => {
                  navigate('/')
                console.log('Переход на главную страницу');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                color: '#4b5563',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <span>🏠</span>
              На главную
            </button>
          </div>
          {activeTab === 'ads' && (
            <button
              onClick={() => setShowAdModal(true)}
              style={{
                backgroundColor: '#ec4899',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              + Создать рекламу
            </button>
          )}
        </div>
        
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}
        
        {/* Поиск и фильтры */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '0 16px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <span style={{ color: '#a1a1aa', marginRight: '8px' }}>🔍</span>
            <input
              type="text"
              placeholder={`Поиск ${activeTab === 'users' ? 'пользователей' : activeTab === 'events' ? 'событий' : activeTab === 'communities' ? 'сообществ' : 'рекламы'}...`}
              style={{
                flex: 1,
                border: 'none',
                padding: '12px 0',
                outline: 'none',
                color: '#4b5563'
              }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleFilterDropdown(activeTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                cursor: 'pointer',
                color: '#4b5563',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
              }}
            >
              <span>Фильтр</span>
              <span>▼</span>
            </button>
          </div>
        </div>
        
        {/* Контент */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
            {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#a1a1aa' }}>
              Загрузка...
            </div>
          ) : (
            <>
              {((activeTab === 'users' && users.length === 0) || 
                (activeTab === 'events' && events.length === 0) || 
                (activeTab === 'communities' && communities.length === 0) || 
                (activeTab === 'ads' && (!Array.isArray(advertisements) || advertisements.length === 0))) && (
                <div style={{ padding: '48px', textAlign: 'center', color: '#a1a1aa' }}>
                  Данные отсутствуют
                </div>
              )}
              
              {((activeTab === 'users' && users.length > 0) || 
                (activeTab === 'events' && events.length > 0) || 
                (activeTab === 'communities' && communities.length > 0) || 
                (activeTab === 'ads' && Array.isArray(advertisements) && advertisements.length > 0)) && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  {activeTab === 'users' && (
                    <>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Пользователь</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Статус</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Город</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Дата регистрации</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Действия</th>
                    </>
                  )}
                  {activeTab === 'events' && (
                    <>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Событие</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Автор</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Город</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Дата</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Участники</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Действия</th>
                    </>
                  )}
                  {activeTab === 'communities' && (
                    <>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Сообщество</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Создатель</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Тип</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Участники</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Дата создания</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Действия</th>
                    </>
                  )}
                  {activeTab === 'ads' && (
                    <>
                      <th style={{ padding: '20px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Реклама</th>
                      <th style={{ padding: '20px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Тип</th>
                      <th style={{ padding: '20px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Статус</th>
                      <th style={{ padding: '20px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Показы</th>
                      <th style={{ padding: '20px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Клики</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'users' && users.map((user) => (
                  <tr key={user.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#a1a1aa',
                          fontWeight: '500'
                        }}>
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: '#4b5563' }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div style={{ fontSize: '13px', color: '#a1a1aa' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: user.isSubscriber ? '#fce7f3' : '#f3f4f6',
                        color: user.isSubscriber ? '#ec4899' : '#a1a1aa'
                      }}>
                        {user.isSubscriber ? 'С подпиской' : 'Без подписки'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#a1a1aa' }}>{user.city}</td>
                    <td style={{ padding: '16px', color: '#a1a1aa' }}>{formatDate(user.registrationDate)}</td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => deleteUser(user.id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          cursor: 'pointer'
                        }}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'events' && events.map((event) => (
                  <tr key={event.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: '#fce7f3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ec4899'
                        }}>
                          🎉
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: '#4b5563' }}>{event.title}</div>
                          <div style={{ fontSize: '13px', color: '#a1a1aa' }}>
                            {event.tags.join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>{event.author}</td>
                    <td style={{ padding: '16px', color: '#a1a1aa' }}>{event.city}</td>
                    <td style={{ padding: '16px', color: '#a1a1aa' }}>{formatDate(event.dateTime)}</td>
                    <td style={{ padding: '16px' }}>{event.usersIds.length}</td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          cursor: 'pointer'
                        }}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'communities' && communities.map((community) => (
                  <tr key={community.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: '#fce7f3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ec4899'
                        }}>
                          💻
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: '#4b5563' }}>{community.name}</div>
                          <div style={{ fontSize: '13px', color: '#a1a1aa' }}>{community.type}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>{community.author}</td>
                    <td style={{ padding: '16px' }}>{community.type}</td>
                    <td style={{ padding: '16px' }}>{community.numberMembers}</td>
                    <td style={{ padding: '16px', color: '#a1a1aa' }}>{formatDate(community.createdAt)}</td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => deleteCommunity(community.id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          cursor: 'pointer'
                        }}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'ads' && Array.isArray(advertisements) && advertisements.map((ad) => (
                  <tr key={ad.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: '#fce7f3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ec4899'
                        }}>
                          📢
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: '#4b5563' }}>{ad.name}</div>
                          <div style={{ fontSize: '13px', color: '#a1a1aa' }}>{ad.targetUrl}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>{ad.type}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: ad.active ? '#dcfce7' : '#fee2e2',
                        color: ad.active ? '#16a34a' : '#dc2626'
                      }}>
                        {ad.active ? 'Активна' : 'Неактивна'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>{ad.showCount || 0}</td>
                    <td style={{ padding: '16px' }}>{ad.clickCount || 0}</td>
                    <td style={{ padding: '16px' }}>
                      {/* <button
                        onClick={() => }
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          cursor: 'pointer'
                        }}
                      >
                        ❌
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              )}
            </>
          )}
        </div>
      </main>

      {/* Модальное окно создания рекламы */}
      {showAdModal && <AdCreationModal onClose={() => setShowAdModal(false)} />}
    </div>
  );
};

// Компонент для создания рекламы
const AdCreationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'BANNER' as 'BANNER' | 'VIDEO',
    targetUrl: '',
    finishDate: '',
    mediaFile: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mediaFile) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Загрузка файла
      const mediaFormData = new FormData();
      mediaFormData.append('file', formData.mediaFile);

      const uploadResponse = await fetch('http://localhost:8090/api/media/upload', {
        method: 'POST',
        body: mediaFormData
      });

      if (!uploadResponse.ok) throw new Error('Ошибка загрузки файла');

      const mediaUrl = await uploadResponse.text();

      // Создание рекламы
      const adData = {
        name: formData.name,
        type: formData.type,
        targetUrl: formData.targetUrl,
        finishDate: formData.finishDate,
        mediaUrl: mediaUrl
      };

      const adResponse = await fetch('http://localhost:8090/api/advertisement/add-advertisement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adData)
      });

      if (!adResponse.ok) throw new Error('Ошибка создания рекламы');

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        margin: '20px'
      }}>
        <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
          Создать рекламу
        </h2>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Название рекламы
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Тип рекламы
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as 'BANNER' | 'VIDEO'})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none'
              }}
            >
              <option value="BANNER">Баннер</option>
              <option value="VIDEO">Видео</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Ссылка для перехода
            </label>
            <input
              type="url"
              value={formData.targetUrl}
              onChange={(e) => setFormData({...formData, targetUrl: e.target.value})}
              required
              placeholder="https://example.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Дата окончания
            </label>
            <input
              type="datetime-local"
              value={formData.finishDate}
              onChange={(e) => setFormData({...formData, finishDate: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Медиа файл
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFormData({...formData, mediaFile: e.target.files?.[0] || null})}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#ec4899',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;