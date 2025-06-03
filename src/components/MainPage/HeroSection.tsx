import React from 'react';
import styles from '../../features/Main/mainStyle.module.css';
// import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
    // const navigate = useNavigate(); 
    // const handleButtonClick = () => {
    //     navigate('/auth');
    // }; 
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Объединяем людей через <span>события</span> по всему Казахстану
            </h1>
            <p className={styles.heroDescription}>
              Cityvora — платформа для создания и поиска интересных мероприятий, а также для объединения в сообщества по интересам в любом городе Казахстана.
            </p>
            <a href="/auth"  className={styles.ctaButton}>
              Начать участвовать
            </a>
          </div>
          <div className={styles.heroImage}>
            <img
              src="https://www.akorda.kz/assets/media/flag.jpg"
              alt="Hero Image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;