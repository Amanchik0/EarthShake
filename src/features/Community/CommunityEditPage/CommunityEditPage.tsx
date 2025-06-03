// CommunityEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/auth/AuthContext';
import CommunityTabs from '../../../components/ComminutyEdit/CommunityTabs';
import ProfileTab from '../../../components/ComminutyEdit/ProfileTab';
import EventsTab from '../../../components/ComminutyEdit/EventsTab';
import MembersTab from '../../../components/ComminutyEdit/MemberTab';
import { Community, CommunityUpdateData } from '../../../types/community';
import styles from './CommunityEditPage.module.css';

const CommunityEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'events' | 'members' | 'statistics' | 'settings'>('profile');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Загрузка данных сообщества
  useEffect(() => {
    if (id) {
      loadCommunity(id);
    }
  }, [id]);

  const loadCommunity = async (communityId: string) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8090/api/community/${communityId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки сообщества: ${response.status}`);
      }

      const communityData: Community = await response.json();
      console.log(' Загружено сообщество для редактирования:', communityData);

      // Проверяем права доступа
      if (!user || (communityData.author !== user.username)) {
        setError('У вас нет прав для редактирования этого сообщества');
        return;
      }

      setCommunity(communityData);
    } catch (error) {
      console.error('Ошибка загрузки сообщества:', error);
      setError('Не удалось загрузить данные сообщества');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleSaveCommunity = async (updatedData: Partial<Community>) => {
    if (!community || !user) {
      showNotificationMessage('Ошибка: нет данных для сохранения');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      // Создаем полный объект для обновления
      const updatePayload: CommunityUpdateData = {
        id: community.id,
        name: updatedData.name || community.name,
        description: updatedData.description || community.description,
        imageUrls: updatedData.imageUrls || community.imageUrls,
        numberMembers: community.numberMembers,
        type: updatedData.type || community.type,
        createdAt: community.createdAt,
        rating: community.rating,
        reviewsCount: community.reviewsCount,
        content: updatedData.content || community.content,
        city: updatedData.city || community.city,
        eventsCount: community.eventsCount,
        postsCount: community.postsCount,
        users: community.users,
        author: community.author,
        listEvents: community.listEvents
      };

      console.log(' Сохраняем изменения:', updatePayload);

      const response = await fetch('http://localhost:8090/api/community/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error(`Ошибка сохранения: ${response.status}`);
      }

      const updatedCommunity: Community = await response.json();
      console.log(' Сообщество успешно обновлено:', updatedCommunity);

      setCommunity(updatedCommunity);
      showNotificationMessage('Изменения успешно сохранены!');

    } catch (error) {
      console.error('Ошибка сохранения сообщества:', error);
      showNotificationMessage('Ошибка при сохранении изменений');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (community) {
      navigate(`/communities/${community.id}`);
    } else {
      navigate('/communities');
    }
  };

  // Проверка ID
  if (!id) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>ID сообщества не найден</p>
          <button onClick={() => navigate('/communities')}>К списку сообществ</button>
        </div>
      </div>
    );
  }

  // Состояние загрузки
  if (loading && !community) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка данных сообщества...</p>
        </div>
      </div>
    );
  }

  // Ошибка загрузки
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button onClick={() => setError('')}>Закрыть</button>
            <button onClick={() => loadCommunity(id)}>Попробовать еще раз</button>
            <button onClick={handleBack}>Назад</button>
          </div>
        </div>
      </div>
    );
  }

  // Сообщество не найдено
  if (!community) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Сообщество не найдено</h2>
          <p>Запрашиваемое сообщество не существует или было удалено</p>
          <button onClick={() => navigate('/communities')}>К списку сообществ</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Назад к сообществу
        </button>
        <h1 className={styles.pageTitle}>Редактирование: {community.name}</h1>
      </header>
      
      <div className={styles.profileSection}>
        <CommunityTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className={styles.tabContentActive}>
          {activeTab === 'profile' && (
            <ProfileTab 
              community={community}
              onSave={handleSaveCommunity}
              onMessage={showNotificationMessage}
              saving={saving}
            />
          )}
          {activeTab === 'events' && (
            <EventsTab 
              community={community}
              onMessage={showNotificationMessage}
            />
          )}
          {activeTab === 'members' && (
            <MembersTab 
              community={community}
              onMessage={showNotificationMessage}
            />
          )}
        </div>
      </div>

      {showNotification && (
        <div className={styles.notification}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default CommunityEditPage;