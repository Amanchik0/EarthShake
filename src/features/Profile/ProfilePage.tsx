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

const ProfilePage: React.FC = () => {
  const { user, logout, isLoading, updateUser } = useAuth(); // Добавляем updateUser
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [fullProfile, setFullProfile] = useState<FullProfile | null>(null);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string>('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) navigate('/login');
  }, [isLoading, user, navigate]);

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
        
        const apiProfile = await res.json() as FullProfile;
        setFullProfile(apiProfile);
        
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
      events: fp.events || [],
      communities: fp.communities || [],
      hasSubscription: fp.subscriber,
      photoUrl: fp.imageUrl || undefined,
    };
  };

  // Подготовка данных для редактирования (теперь с username)
  const getEditFormData = (fp: FullProfile): ProfileFormData => {
    return {
      username: fp.username, // Добавили username
      firstName: fp.firstName || '',
      lastName: fp.lastName || '',
      email: fp.email,
      phoneNumber: fp.phoneNumber || '',
      city: fp.city || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      imageUrl: fp.imageUrl || '',
    };
  };

  // Обработка успешного обновления профиля
  const handleProfileUpdate = async (updatedProfile: FullProfile) => {
    setFullProfile(updatedProfile);
    
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
            {profileInfo.events.length > 0 ? (
              <div className={styles.eventsGrid}>
                {profileInfo.events.map((e: EventData) => (
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
            {profileInfo.communities.length > 0 ? (
              <div className={styles.communityList}>
                {profileInfo.communities.map((c: CommunityData) => (
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
              onSubscribe={() => alert('Функция подписки пока не подключена')}
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