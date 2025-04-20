import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.headerRoot}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <div className={styles.headerLogo}>
            <img src="/api/placeholder/40/40" alt="Logo" className={styles.headerLogoImg} />
            <span className={styles.headerLogoText}>CityVora</span>
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