import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footerRoot}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div>
            <div className={styles.footerLogo}>
            <svg width="50" height="50" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" rx="12" fill="#FF6B98"/>
              <path d="M20 30C20 24.477 24.477 20 30 20V40C24.477 40 20 35.523 20 30Z" fill="white"/>
              <path d="M30 20C35.523 20 40 24.477 40 30C40 35.523 35.523 40 30 40V20Z" fill="white" fillOpacity="0.5"/>
            </svg>             
             <span className={styles.footerLogoText}>CityVora</span>
            </div>
            <p className={styles.footerDescription}>
              Платформа для создания и поиска интересных мероприятий, а также для объединения в сообщества по интересам в любом городе Казахстана.
            </p>
            <div className={styles.footerSocialLinks}>
              <a href="#" className={styles.footerSocialLink}>FB</a>
              <a href="#" className={styles.footerSocialLink}>IG</a>
              <a href="#" className={styles.footerSocialLink}>TW</a>
              <a href="#" className={styles.footerSocialLink}>YT</a>
            </div>
          </div>
          <div>
            <h4 className={styles.footerTitle}>О нас</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>О проекте</a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Команда</a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Карьера</a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Блог</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerTitle}>Функции</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Создать событие</a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Создать сообщество</a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Премиум подписка</a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Для организаторов</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerTitle}>Поддержка</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Помощь</a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>FAQ</a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Контакты</a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="#" className={styles.footerLink}>Обратная связь</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.footerCopyright}>© 2025 CityVora. Все права защищены.</div>
          <div className={styles.footerBottomLinks}>
            <a href="#" className={styles.footerBottomLink}>Политика конфиденциальности</a>
            <a href="#" className={styles.footerBottomLink}>Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;