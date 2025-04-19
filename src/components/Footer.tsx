import React from 'react';
import '../features/Main/mainStyle.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer-container">
        <div className="app-footer-content">
          <div>
            <div className="app-footer-logo">
              <img src="/api/placeholder/40/40" alt="Logo" className="app-footer-logo-img" />
              <span className="app-footer-logo-text">CityVora</span>
            </div>
            <p className="app-footer-description">
              Платформа для создания и поиска интересных мероприятий, а также для объединения в сообщества по интересам в любом городе Казахстана.
            </p>
            <div className="app-footer-social-links">
              <a href="#" className="app-footer-social-link">FB</a>
              <a href="#" className="app-footer-social-link">IG</a>
              <a href="#" className="app-footer-social-link">TW</a>
              <a href="#" className="app-footer-social-link">YT</a>
            </div>
          </div>
          <div>
            <h4 className="app-footer-title">О нас</h4>
            <ul className="app-footer-links">
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">О проекте</a>
              </li>
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Команда</a>
              </li>
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Карьера</a>
              </li>
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Блог</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="app-footer-title">Функции</h4>
            <ul className="app-footer-links">
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Создать событие</a>
              </li>
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Создать сообщество</a>
              </li>
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Премиум подписка</a>
              </li>
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Для организаторов</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="app-footer-title">Поддержка</h4>
            <ul className="app-footer-links">
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Помощь</a>
              </li>
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">FAQ</a>
              </li>
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Контакты</a>
              </li>
              <li className="app-footer-link-item">
                <a href="#" className="app-footer-link">Обратная связь</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="app-footer-bottom">
          <div className="app-footer-copyright">© 2025 CityVora. Все права защищены.</div>
          <div className="app-footer-bottom-links">
            <a href="#" className="app-footer-bottom-link">Политика конфиденциальности</a>
            <a href="#" className="app-footer-bottom-link">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;