import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../auth/AuthContext';

interface AuthUser {
  username: string;
  role: string;
  city: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  city: string;
  subscriber: boolean;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Загружаем профиль пользователя для получения фотографии
  useEffect(() => {
    if (!user) return;

    const loadUserProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch(
          `http://localhost:8090/api/users/get-by-username/${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля пользователя:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Получаем отображаемое имя пользователя
  const getDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    if (userProfile?.firstName) {
      return userProfile.firstName;
    }
    return user?.username || 'Пользователь';
  };

  // Получаем URL аватара
  const getAvatarUrl = () => {
    if (userProfile?.imageUrl) {
      return userProfile.imageUrl;
    }
    // Дефолтная картинка
    return "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg";
  };

  return (
    <header className={styles.headerRoot}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.headerLogo}>
            <div className={styles.logo}>
              <svg width="50" height="50" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="60" height="60" rx="12" fill="#FF6B98"/>
                <path d="M20 30C20 24.477 24.477 20 30 20V40C24.477 40 20 35.523 20 30Z" fill="white"/>
                <path d="M30 20C35.523 20 40 24.477 40 30C40 35.523 35.523 40 30 40V20Z" fill="white" fillOpacity="0.5"/>
              </svg>
            </div>
            <span className={styles.headerLogoText}>CityVora</span>
          </Link>

          <nav>
            <ul className={styles.headerNavMenu}>
              {['/', '/events', '/communities', '/reference', '/support'].map((path, idx) => {
                const labels = ['Главная', 'События', 'Сообщества', 'Гайдлайны', 'Поддержка'];
                return (
                  <li key={path} className={styles.headerNavItem}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        isActive
                          ? `${styles.headerNavLink} ${styles.headerNavLinkActive}`
                          : styles.headerNavLink
                      }
                    >
                      {labels[idx]}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.headerActions}>
            {user ? (
              <div className={styles.headerProfileBlock}>
                <Link to="/profile" className={styles.headerProfileLink}>
                  <div className={styles.headerProfileInfo}>
                    {isLoadingProfile ? (
                      <div className={styles.headerAvatarSkeleton}></div>
                    ) : (
                      <img
                        src={getAvatarUrl()}
                        alt="Profile"
                        className={styles.headerProfileAvatar}
                        onError={(e) => {
                          // Fallback если изображение не загрузилось
                          e.currentTarget.src = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg";
                        }}
                      />
                    )}
                    <div className={styles.headerUserInfo}>
                      <span className={styles.headerUsername}>{getDisplayName()}</span>
                      {userProfile?.subscriber && (
                        <span className={styles.headerPremiumBadge}>Premium</span>
                      )}
                    </div>
                  </div>
                </Link>
                <button onClick={handleLogout} className={styles.headerLogoutButton}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Выйти
                </button>
              </div>
            ) : (
              <div className={styles.headerAuthLinks}>
                <Link to="/login" className={styles.headerNavLink}>Войти</Link>
                <Link to="/auth" className={styles.headerNavLink}>Регистрация</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;