import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileTabs from '../../components/Profile/ProfileTabs';
import EventCard from '../../components/Profile/EventCard';
import CommunityCard from '../../components/Profile/CommunityCard';
import SubscriptionSection from '../../components/Profile/SubscriptionSection';
import ProfileEditPage from './ProfileEditPage';
import { ProfileInfo, EventData, CommunityData, ProfileFormData } from '../../types/profile';
import styles from './profile.module.css';

const ProfilePage: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) navigate('/login');
  }, [isLoading, user, navigate]);

  // Load profile data
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(
          `http://localhost:8090/api/users/get-by-username/${user.username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Не удалось загрузить профиль');
        const api = (await res.json()) as ProfileInfo;
        setProfile(api);
      } catch (err) {
        console.error(err);
        logout();
      }
    };
    loadProfile();
  }, [user, logout]);

  if (isLoading || !profile) return <div>Загрузка профиля...</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Мои события</h2>
            <div className={styles.eventsGrid}>
              {profile.events.map((e: EventData) => (
                <EventCard
                  key={e.id}
                  title={e.title}
                  date={e.date}
                  participants={`${e.participantsCount} участников`}
                  imageUrl={e.imageUrl}
                />
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Мои сообщества</h2>
            <div className={styles.communityList}>
              {profile.communities.map((c: CommunityData) => (
                <CommunityCard
                  key={c.id}
                  name={c.name}
                  members={`${c.membersCount} участников`}
                  logoUrl={c.logoUrl}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Подписка</h2>
            <SubscriptionSection
              hasSubscription={profile.hasSubscription}
              onSubscribe={() => alert('Функция подписки пока не подключена')}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // CHANGED: подготовка данных только для редактирования
  const getEditData = (p: ProfileInfo): ProfileFormData => {
    const [firstName, lastName] = p.name.split(' ', 2);
    return {
      firstName: firstName || '',
      lastName: lastName || '',
      email: p.email,
      phoneNumber: p.phoneNumber,
      city: p.city,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      imageUrl: p.photoUrl || '',
    };
  };

  // CHANGED: обновление только UI после успешного PUT
  const handleProfileUpdate = (updated: ProfileInfo) => {
    setProfile(updated);
  };

  return (
    <div className={styles.container}>
      <ProfileHeader
        profile={profile}
        onEditClick={() => setEditOpen(true)}
      />

      {isEditOpen && (
        <ProfileEditPage
          initialData={getEditData(profile)}
          onClose={() => setEditOpen(false)}
          onSubmit={async (data) => {
            const token = localStorage.getItem('accessToken');
            // CHANGED: PUT только редактируемых полей
            const res = await fetch('http://localhost:8090/api/users/update', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            });
            if (!res.ok) {
              alert('Ошибка обновления');
            } else {
              const updated = (await res.json()) as ProfileInfo;
              handleProfileUpdate(updated);
              setEditOpen(false);
            }
          }}
        />
      )}

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  );
};

export default ProfilePage;