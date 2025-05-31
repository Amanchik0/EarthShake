import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileTabs from '../../components/Profile/ProfileTabs';
import EventCard from '../../components/Profile/EventCard';
import CommunityCard from '../../components/Profile/CommunityCard';
import SubscriptionSection from '../../components/Profile/SubscriptionSection';
import ProfileEditPage from './ProfileEditPage';
import { ProfileInfo, EventData, CommunityData, ProfileFormData, FullProfile } from '../../types/profile';
import styles from './profile.module.css';

// Интерфейсы для API ответов
interface ApiEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  mediaUrl: string[];
  usersIds: string[];
  city: string;
  author: string;
}

interface ApiCommunity {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  numberMembers: number;
  city: string;
  author: string;
}

interface ApiProfile {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  city: string;
  imageUrl: string | null;
  phoneNumber: string | null;
  isSubscriber: boolean;
  registrationDate: string;
  eventIds: string[];
  communityId: string[];
  metadata: any;
}

const ProfilePage: React.FC = () => {
  const { user, logout, isLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [fullProfile, setFullProfile] = useState<FullProfile | null>(null);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string>('');
  const [events, setEvents] = useState<EventData[]>([]);
  const [communities, setCommunities] = useState<CommunityData[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingCommunities, setLoadingCommunities] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) navigate('/login');
  }, [isLoading, user, navigate]);

  // Функция для загрузки событий
  const loadEvents = async (eventIds: string[]) => {
    if (!eventIds || eventIds.length === 0) {
      setEvents([]);
      return;
    }

    setLoadingEvents(true);
    try {
      const token = localStorage.getItem('accessToken');
      const eventPromises = eventIds.map(async (eventId) => {
        const response = await fetch(`http://localhost:8090/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error(`Ошибка загрузки события ${eventId}:`, response.status);
          return null;
        }
        
        return await response.json() as ApiEvent;
      });

      const loadedEvents = await Promise.all(eventPromises);
      const validEvents = loadedEvents.filter(Boolean) as ApiEvent[];
      
      // Преобразуем API данные в EventData
      const transformedEvents: EventData[] = validEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.dateTime).toLocaleDateString('ru-RU'),
        participantsCount: event.usersIds?.length || 0,
        imageUrl: event.mediaUrl?.[0] || '/default-event-image.jpg'
      }));

      setEvents(transformedEvents);
    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Функция для загрузки сообществ
  const loadCommunities = async (communityIds: string[]) => {
    if (!communityIds || communityIds.length === 0) {
      setCommunities([]);
      return;
    }

    setLoadingCommunities(true);
    try {
      const token = localStorage.getItem('accessToken');
      const communityPromises = communityIds.map(async (communityId) => {
        const response = await fetch(`http://localhost:8090/api/community/${communityId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error(`Ошибка загрузки сообщества ${communityId}:`, response.status);
          return null;
        }
        
        return await response.json() as ApiCommunity;
      });

      const loadedCommunities = await Promise.all(communityPromises);
      const validCommunities = loadedCommunities.filter(Boolean) as ApiCommunity[];
      
      // Преобразуем API данные в CommunityData
      const transformedCommunities: CommunityData[] = validCommunities.map(community => ({
        id: community.id,
        name: community.name,
        membersCount: community.numberMembers,
        logoUrl: community.imageUrls?.[0] || '/default-community-logo.jpg'
      }));

      setCommunities(transformedCommunities);
    } catch (error) {
      console.error('Ошибка загрузки сообществ:', error);
      setCommunities([]);
    } finally {
      setLoadingCommunities(false);
    }
  };

  // Load profile data
  useEffect(() => {
    if (!user) return;
    
    const loadProfile = async () => {
      try {
        setProfileError('');
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('Токен авторизации не найден');
        }

        const res = await fetch(
          `http://localhost:8090/api/users/get-by-username/${user.username}`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        if (!res.ok) {
          if (res.status === 401) {
            logout();
            return;
          }
          throw new Error(`Ошибка ${res.status}: Не удалось загрузить профиль`);
        }
        
        const apiProfile: ApiProfile = await res.json();
        
        // Преобразуем API профиль в ваш FullProfile интерфейс
        const fullProfileData: FullProfile = {
          id: apiProfile.id,
          username: apiProfile.username,
          email: apiProfile.email,
          password: apiProfile.password,
          firstName: apiProfile.firstName,
          lastName: apiProfile.lastName || '',
          role: apiProfile.role,
          city: apiProfile.city,
          imageUrl: apiProfile.imageUrl,
          phoneNumber: apiProfile.phoneNumber,
          registrationDate: apiProfile.registrationDate,
          metadata: apiProfile.metadata,
          subscriber: apiProfile.isSubscriber,
          events: [], // Будут загружены отдельно
          communities: [] // Будут загружены отдельно
        };
        
        setFullProfile(fullProfileData);
        
        // Загружаем события и сообщества
        await Promise.all([
          loadEvents(apiProfile.eventIds || []),
          loadCommunities(apiProfile.communityId || [])
        ]);
        
      } catch (err: any) {
        console.error('Ошибка загрузки профиля:', err);
        setProfileError(err.message || 'Не удалось загрузить профиль');
        
        // Если критическая ошибка авторизации, разлогиниваем
        if (err.message.includes('401') || err.message.includes('авторизации')) {
          logout();
        }
      }
    };
    
    loadProfile();
  }, [user, logout]);

  // Преобразование FullProfile в ProfileInfo для отображения
  const convertToProfileInfo = (fp: FullProfile): ProfileInfo => {
    const fullName = [fp.firstName, fp.lastName].filter(Boolean).join(' ') || fp.username;
    
    return {
      name: fullName,
      username: fp.username,
      email: fp.email,
      phoneNumber: fp.phoneNumber || '',
      city: fp.city || '',
      registrationDate: new Date(fp.registrationDate).toLocaleDateString('ru-RU'),
      events: events, // Используем загруженные события
      communities: communities, // Используем загруженные сообщества
      hasSubscription: fp.subscriber,
      photoUrl: fp.imageUrl || undefined,
    };
  };

  // Подготовка данных для редактирования
  const getEditFormData = (fp: FullProfile): ProfileFormData => {
    return {
      username: fp.username,
      firstName: fp.firstName || '',
      lastName: fp.lastName || '',
      email: fp.email,
      phoneNumber: fp.phoneNumber || '',
      city: fp.city || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      imageUrl: fp.imageUrl || undefined,
    };
  };

  // Обработка успешного обновления профиля
  const handleProfileUpdate = async (updatedProfile: FullProfile) => {
    setFullProfile(updatedProfile);
    
    // Если обновились события или сообщества, перезагружаем их
    if (fullProfile) {
      const currentEventIds = fullProfile.eventIds || [];
      const currentCommunityIds = fullProfile.communityIds || [];
      
      // Проверяем, нужно ли перезагрузить события и сообщества
      // (в случае если они изменились в API)
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(
          `http://localhost:8090/api/users/get-by-username/${updatedProfile.username}`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        if (res.ok) {
          const freshProfile = await res.json();
          const newEventIds = freshProfile.eventIds || [];
          const newCommunityIds = freshProfile.communityId || [];
          
          // Перезагружаем только если изменились ID
          if (JSON.stringify(currentEventIds) !== JSON.stringify(newEventIds)) {
            await loadEvents(newEventIds);
          }
          
          if (JSON.stringify(currentCommunityIds) !== JSON.stringify(newCommunityIds)) {
            await loadCommunities(newCommunityIds);
          }
        }
      } catch (error) {
        console.log('Не удалось проверить изменения в событиях/сообществах:', error);
      }
    }
    
    // Обновляем данные в AuthContext, если изменились username или city
    if (user) {
      const authUpdates: Partial<any> = {};
      if (updatedProfile.username !== user.username) {
        authUpdates.username = updatedProfile.username;
      }
      if (updatedProfile.city !== user.city) {
        authUpdates.city = updatedProfile.city;
      }
      
      // Если есть изменения, обновляем AuthContext
      if (Object.keys(authUpdates).length > 0) {
        updateUser(authUpdates);
      }
    }
    
    // Уведомление об успешном обновлении
    const notification = document.createElement('div');
    notification.textContent = 'Профиль успешно обновлен!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>;
  
  if (profileError) {
    return (
      <div className={styles.error}>
        <h2>Ошибка загрузки профиля</h2>
        <p>{profileError}</p>
        <button onClick={() => window.location.reload()}>
          Повторить попытку
        </button>
      </div>
    );
  }
  
  if (!fullProfile) return <div className={styles.loading}>Загрузка профиля...</div>;

  const profileInfo = convertToProfileInfo(fullProfile);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Мои события</h2>
            {loadingEvents ? (
              <div className={styles.loading}>Загрузка событий...</div>
            ) : events.length > 0 ? (
              <div className={styles.eventsGrid}>
                {events.map((e: EventData) => (
                  <EventCard
                    key={e.id}
                    title={e.title}
                    date={e.date}
                    participants={`${e.participantsCount} участников`}
                    imageUrl={e.imageUrl}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>У вас пока нет событий</p>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Мои сообщества</h2>
            {loadingCommunities ? (
              <div className={styles.loading}>Загрузка сообществ...</div>
            ) : communities.length > 0 ? (
              <div className={styles.communityList}>
                {communities.map((c: CommunityData) => (
                  <CommunityCard
                    key={c.id}
                    name={c.name}
                    members={`${c.membersCount} участников`}
                    logoUrl={c.logoUrl}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>Вы не состоите ни в одном сообществе</p>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Подписка</h2>
            <SubscriptionSection
              hasSubscription={profileInfo.hasSubscription}
              currentProfile={fullProfile}
              onSubscriptionUpdate={handleProfileUpdate}
              onSubscribe={() => {}} // Не используется в новой версии
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <ProfileHeader
        {...profileInfo}
        currentProfile={fullProfile}
        onProfileUpdate={handleProfileUpdate}
      />

      {isEditOpen && (
        <ProfileEditPage
          initialData={getEditFormData(fullProfile)}
          currentProfile={fullProfile}
          onClose={() => setEditOpen(false)}
          onSubmit={handleProfileUpdate}
        />
      )}

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  );
};

export default ProfilePage;