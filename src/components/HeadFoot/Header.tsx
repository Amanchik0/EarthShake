import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.headerRoot}>
      <div className={styles.headerContainer}>
        
        <div className={styles.headerContent}>
          <div className={styles.headerLogo}>
          <div className={styles.logo}>
            <svg width="50" height="50" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" rx="12" fill="#FF6B98"/>
              <path d="M20 30C20 24.477 24.477 20 30 20V40C24.477 40 20 35.523 20 30Z" fill="white"/>
              <path d="M30 20C35.523 20 40 24.477 40 30C40 35.523 35.523 40 30 40V20Z" fill="white" fillOpacity="0.5"/>
            </svg>
          </div>            <span className={styles.headerLogoText}>CityVora</span>
          </div>
          <nav>
            <ul className={styles.headerNavMenu}>
              <li className={styles.headerNavItem}>
                <a href="#" className={`${styles.headerNavLink} ${styles.headerNavLinkActive}`}>
                  Главная
                </a>
              </li>
              <li className={styles.headerNavItem}>
                <a href="#" className={styles.headerNavLink}>
                  События
                </a>
              </li>
              <li className={styles.headerNavItem}>
                <a href="#" className={styles.headerNavLink}>
                  Сообщества
                </a>
              </li>
              <li className={styles.headerNavItem}>
                <a href="#" className={styles.headerNavLink}>
                  Гайдлайны
                </a>
              </li>
              <li className={styles.headerNavItem}>
                <a href="#" className={styles.headerNavLink}>
                  Поддержка
                </a>
              </li>
            </ul>
          </nav>
          <button className={styles.headerProfileButton}>
            <img src="/api/placeholder/36/36" alt="Profile" className={styles.headerProfileAvatar} />
            <span>Профиль</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;