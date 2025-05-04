import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
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
              <li className={styles.headerNavItem}>
                <NavLink 
                  to="/" 
                  className={({isActive}) => 
                    isActive ? `${styles.headerNavLink} ${styles.headerNavLinkActive}` : styles.headerNavLink
                  }
                >
                  Главная
                </NavLink>
              </li>
              <li className={styles.headerNavItem}>
                <NavLink 
                  to="/events" 
                  className={({isActive}) => 
                    isActive ? `${styles.headerNavLink} ${styles.headerNavLinkActive}` : styles.headerNavLink
                  }
                >
                  События
                </NavLink>
              </li>
              <li className={styles.headerNavItem}>
                <NavLink 
                  to="/communities" 
                  className={({isActive}) => 
                    isActive ? `${styles.headerNavLink} ${styles.headerNavLinkActive}` : styles.headerNavLink
                  }
                >
                  Сообщества
                </NavLink>
              </li>
              <li className={styles.headerNavItem}>
                <NavLink 
                  to="/reference" 
                  className={({isActive}) => 
                    isActive ? `${styles.headerNavLink} ${styles.headerNavLinkActive}` : styles.headerNavLink
                  }
                >
                  Гайдлайны
                </NavLink>
              </li>
              <li className={styles.headerNavItem}>
                <NavLink 
                  to="/support" 
                  className={({isActive}) => 
                    isActive ? `${styles.headerNavLink} ${styles.headerNavLinkActive}` : styles.headerNavLink
                  }
                >
                  Поддержка
                </NavLink>
              </li>
            </ul>
          </nav>
          <Link to="/profile" className={styles.headerProfileButton}>
            <img src="https://media.istockphoto.com/id/588348500/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80.jpg?s=612x612&w=0&k=20&c=8L_kt-Eo0R9vlgU8Aq97-T_spILhskbGZOGJ9eHJMNk=" alt="Profile" className={styles.headerProfileAvatar} />
            <span>Профиль</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;