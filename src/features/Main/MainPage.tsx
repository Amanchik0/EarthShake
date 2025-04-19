import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './mainStyle.css';

const MainPage: React.FC = () => {
  console.log('====================================');
  console.log();
  console.log('====================================');
  return (
    <div className="page-wrapper">
      <Header />
      
      <main>
      <section className="hero-section">
        <div className="container">
            <div className="hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">Объединяем людей через <span>события</span> по всему Казахстану</h1>
                    <p className="hero-description">Cityvora — платформа для создания и поиска интересных мероприятий, а также для объединения в сообщества по интересам в любом городе Казахстана.</p>
                    <a href="#" className="cta-button">Начать участвовать</a>
                </div>
                <div className="hero-image">
                    <img src="/api/placeholder/500/400" alt="Hero Image"/>
                </div>
            </div>
        </div>
    </section>

    <section className="section">
        <div className="container">
            <div className="map-container">
                <h2 className="map-title">События по всему Казахстану</h2>
                <img src="/api/placeholder/1000/500" alt="Карта Казахстана" className="map-image"/>
            </div>
        </div>
    </section>

    <section className="section">
        <div className="container">
            <div className="section-header">
                <h2 className="section-title">Популярные события</h2>
                <p className="section-subtitle">Присоединяйтесь к самым интересным мероприятиям в вашем городе</p>
            </div>
            <div className="event-cards">
                <div className="event-card">
                    <img src="/api/placeholder/400/200" alt="Event 1" className="event-image"/>
                    <div className="event-details">
                        <div className="event-meta">
                            <span className="event-date">27 апреля</span>
                            <span className="event-location">Алматы</span>
                        </div>
                        <h3 className="event-title">IT-конференция Kazakhstan Digital 2025</h3>
                        <p className="event-description">Ежегодная конференция для профессионалов IT-индустрии со всего Казахстана.</p>
                        <a href="#" className="event-button">Подробнее</a>
                    </div>
                </div>
                <div className="event-card">
                    <img src="/api/placeholder/400/200" alt="Event 2" className="event-image"/>
                    <div className="event-details">
                        <div className="event-meta">
                            <span className="event-date">15 мая</span>
                            <span className="event-location">Нур-Султан</span>
                        </div>
                        <h3 className="event-title">Фестиваль стартапов Astana Hub</h3>
                        <p className="event-description">Презентация инновационных проектов и нетворкинг с инвесторами.</p>
                        <a href="#" className="event-button">Подробнее</a>
                    </div>
                </div>
                <div className="event-card">
                    <img src="/api/placeholder/400/200" alt="Event 3" className="event-image"/>
                    <div className="event-details">
                        <div className="event-meta">
                            <span className="event-date">5 июня</span>
                            <span className="event-location">Шымкент</span>
                        </div>
                        <h3 className="event-title">Эко-фестиваль "Зеленый Казахстан"</h3>
                        <p className="event-description">Мероприятие, посвященное экологичному образу жизни и защите природы.</p>
                        <a href="#" className="event-button">Подробнее</a>
                    </div>
                </div>
            </div>
            <a href="#" className="view-all">Смотреть все события</a>
        </div>
    </section>

    <section className="section">
        <div className="container">
            <div className="section-header">
                <h2 className="section-title">Популярные сообщества</h2>
                <p className="section-subtitle">Найдите единомышленников и присоединяйтесь к активным сообществам</p>
            </div>
            <div className="community-cards">
                <div className="community-card">
                    <img src="/api/placeholder/80/80" alt="Community 1" className="community-icon"/>
                    <h3 className="community-title">IT-специалисты Казахстана</h3>
                    <p className="community-members">3,245 участников</p>
                    <a href="#" className="community-button">Присоединиться</a>
                </div>
                <div className="community-card">
                    <img src="/api/placeholder/80/80" alt="Community 2" className="community-icon"/>
                    <h3 className="community-title">Бизнес-сообщество</h3>
                    <p className="community-members">2,178 участников</p>
                    <a href="#" className="community-button">Присоединиться</a>
                </div>
                <div className="community-card">
                    <img src="/api/placeholder/80/80" alt="Community 3" className="community-icon"/>
                    <h3 className="community-title">Творческие люди</h3>
                    <p className="community-members">1,823 участников</p>
                    <a href="#" className="community-button">Присоединиться</a>
                </div>
                <div className="community-card">
                    <img src="/api/placeholder/80/80" alt="Community 4" className="community-icon"/>
                    <h3 className="community-title">Спортивная лига</h3>
                    <p className="community-members">1,456 участников</p>
                    <a href="#" className="community-button">Присоединиться</a>
                </div>
            </div>
            <a href="#" className="view-all">Смотреть все сообщества</a>
        </div>
    </section>

    <section className="section">
        <div className="container">
            <div className="guidelines-container">
                <div className="guidelines-content">
                    <div className="guidelines-text">
                        <h2 className="guidelines-title">Наши гайдлайны</h2>
                        <p className="guidelines-description">Мы создали простые рекомендации, которые помогут вам организовать успешное мероприятие и привлечь максимальное количество участников.</p>
                        <ul className="guidelines-list">
                            <li className="guidelines-item">
                                <div className="guidelines-icon">1</div>
                                <p className="guidelines-item-text">Составьте подробное описание события, указав все детали и преимущества для посетителей.</p>
                            </li>
                            <li className="guidelines-item">
                                <div className="guidelines-icon">2</div>
                                <p className="guidelines-item-text">Выберите подходящую площадку с учетом формата мероприятия и ожидаемого количества гостей.</p>
                            </li>
                            <li className="guidelines-item">
                                <div className="guidelines-icon">3</div>
                                <p className="guidelines-item-text">Заранее анонсируйте событие и приглашайте участников через наши инструменты рассылки.</p>
                            </li>
                            <li className="guidelines-item">
                                <div className="guidelines-icon">4</div>
                                <p className="guidelines-item-text">Используйте фото и видео с предыдущих мероприятий для привлечения новых участников.</p>
                            </li>
                        </ul>
                        <a href="#" className="cta-button">Подробные гайдлайны</a>
                    </div>
                    <div className="guidelines-image">
                        <img src="/api/placeholder/400/300" alt="Guidelines Image"/>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="section">
        <div className="container">
            <div className="section-header">
                <h2 className="section-title">Преимущества нашей платформы</h2>
                <p className="section-subtitle">Почему сотни организаторов и тысячи участников выбирают Cityvora</p>
            </div>
            <div className="features-cards">
                <div className="feature-card">
                    <div className="feature-icon">🔍</div>
                    <h3 className="feature-title">Удобный поиск</h3>
                    <p className="feature-description">Находите события и сообщества по интересам, местоположению и датам проведения в несколько кликов.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h3 className="feature-title">Мобильное приложение</h3>
                    <p className="feature-description">Все функции платформы доступны в нашем мобильном приложении для iOS и Android.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">💬</div>
                    <h3 className="feature-title">Коммуникация</h3>
                    <p className="feature-description">Чаты, форумы и уведомления помогут вам быть в курсе всех изменений и новостей.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3 className="feature-title">Аналитика</h3>
                    <p className="feature-description">Подробные отчеты и статистика по посещаемости и активности участников.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🎟️</div>
                    <h3 className="feature-title">Билетная система</h3>
                    <p className="feature-description">Продавайте билеты и управляйте регистрацией участников через нашу платформу.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⭐</div>
                    <h3 className="feature-title">Рейтинги и отзывы</h3>
                    <p className="feature-description">Система рейтингов помогает выбирать лучшие события и надежных организаторов.</p>
                </div>
            </div>
        </div>
    </section>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;