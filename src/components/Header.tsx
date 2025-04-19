import React from 'react';
import '../features/Main/mainStyle.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="app-header-container">
        <div className="app-header-content">
          <div className="app-header-logo">
            <img src="/api/placeholder/40/40" alt="Logo" className="app-header-logo-img" />
            <span className="app-header-logo-text">CityVora</span>
          </div>
          <nav className="app-header-nav">
            <ul className="app-header-nav-menu">
              <li className="app-header-nav-item">
                <a href="#" className="app-header-nav-link app-header-nav-link-active">
                  Главная
                </a>
              </li>
              <li className="app-header-nav-item">
                <a href="#" className="app-header-nav-link">
                  События
                </a>
              </li>
              <li className="app-header-nav-item">
                <a href="#" className="app-header-nav-link">
                  Сообщества
                </a>
              </li>
              <li className="app-header-nav-item">
                <a href="#" className="app-header-nav-link">
                  Гайдлайны
                </a>
              </li>
              <li className="app-header-nav-item">
                <a href="#" className="app-header-nav-link">
                  Поддержка
                </a>
              </li>
            </ul>
          </nav>
          <button className="app-header-profile-button">
            <img src="/api/placeholder/36/36" alt="Profile" className="app-header-profile-avatar" />
            <span>Профиль</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;