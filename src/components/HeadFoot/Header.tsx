import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../auth/AuthContext';

interface AuthUser {
  username: string;
  role: string;
  city: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
                <Link to="/profile" className={styles.headerProfileBlock}>
            <img
              src="https://…avatar.jpg"
              alt="Profile"
              className={styles.headerProfileAvatar}
            />
            <span className={styles.headerUsername}>{user.username}</span>
            <button onClick={handleLogout} className={styles.headerLogoutButton}>
              Выйти
            </button>
          </Link>
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
