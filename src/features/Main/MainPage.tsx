import React from 'react';
import styles from './mainStyle.module.css';

const MainPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      
      <main>
      <section className={styles.heroSection}>
        <div className={styles.container}>
            <div className={styles.heroContent}>
                <div className={styles.heroText}>
                    <h1 className={styles.heroTitle}>Объединяем людей через <span>события</span> по всему Казахстану</h1>
                    <p className={styles.heroDescription}>Cityvora — платформа для создания и поиска интересных мероприятий, а также для объединения в сообщества по интересам в любом городе Казахстана.</p>
                    <a href="#" className={styles.ctaButton}>Начать участвовать</a>
                </div>
                <div className={styles.heroImage}>
                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="Hero Image"/>
                </div>
            </div>
        </div>
    </section>
        {/* TODO доделать карту  */}
    <section className={styles.section}>
        <div className={styles.container}>
            <div className={styles.mapContainer}>
                <h2 className={styles.mapTitle}>События по всему Казахстану</h2>
                <img src="/api/placeholder/1000/500" alt="Карта Казахстана" className={styles.mapImage}/>
            </div>
        </div>
    </section>

    <section className={styles.section}>
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Популярные события</h2>
                <p className={styles.sectionSubtitle}>Присоединяйтесь к самым интересным мероприятиям в вашем городе</p>
            </div>
            <div className={styles.eventCards}>
                <div className={styles.eventCard}>
                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="Event 1" className={styles.eventImage}/>
                    <div className={styles.eventDetails}>
                        <div className={styles.eventMeta}>
                            <span className={styles.eventDate}>27 апреля</span>
                            <span className={styles.eventLocation}>Алматы</span>
                        </div>
                        <h3 className={styles.eventTitle}>IT-конференция Kazakhstan Digital 2025</h3>
                        <p className={styles.eventDescription}>Ежегодная конференция для профессионалов IT-индустрии со всего Казахстана.</p>
                        <a href="/events/3" className={styles.eventButton}>Подробнее</a>
                    </div>
                </div>
                <div className={styles.eventCard}>
                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="Event 2" className={styles.eventImage}/>
                    <div className={styles.eventDetails}>
                        <div className={styles.eventMeta}>
                            <span className={styles.eventDate}>15 мая</span>
                            <span className={styles.eventLocation}>Нур-Султан</span>
                        </div>
                        <h3 className={styles.eventTitle}>Фестиваль стартапов Astana Hub</h3>
                        <p className={styles.eventDescription}>Презентация инновационных проектов и нетворкинг с инвесторами.</p>
                        <a href="/events/2" className={styles.eventButton}>Подробнее</a>
                    </div>
                </div>
                <div className={styles.eventCard}>
                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="Event 3" className={styles.eventImage}/>
                    <div className={styles.eventDetails}>
                        <div className={styles.eventMeta}>
                            <span className={styles.eventDate}>5 июня</span>
                            <span className={styles.eventLocation}>Шымкент</span>
                        </div>
                        <h3 className={styles.eventTitle}>Эко-фестиваль "Зеленый Казахстан"</h3>
                        <p className={styles.eventDescription}>Мероприятие, посвященное экологичному образу жизни и защите природы.</p>
                        <a href="/events/1" className={styles.eventButton}>Подробнее</a>
                    </div>
                </div>
            </div>
            <a href="/events" className={styles.viewAll}>Смотреть все события</a>
        </div>
    </section>

    <section className={styles.section}>
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Популярные сообщества</h2>
                <p className={styles.sectionSubtitle}>Найдите единомышленников и присоединяйтесь к активным сообществам</p>
            </div>
            <div className={styles.communityCards}>
                <div className={styles.communityCard}>
                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="Community 1" className={styles.communityIcon}/>
                    <h3 className={styles.communityTitle}>IT-специалисты Казахстана</h3>
                    <p className={styles.communityMembers}>3,245 участников</p>
                    <a href="/communities" className={styles.communityButton}>Присоединиться</a>
                </div>
                <div className={styles.communityCard}>
                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="Community 2" className={styles.communityIcon}/>
                    <h3 className={styles.communityTitle}>Бизнес-сообщество</h3>
                    <p className={styles.communityMembers}>2,178 участников</p>
                    <a href="/communities" className={styles.communityButton}>Присоединиться</a>
                </div>
                <div className={styles.communityCard}>
                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="Community 3" className={styles.communityIcon}/>
                    <h3 className={styles.communityTitle}>Творческие люди</h3>
                    <p className={styles.communityMembers}>1,823 участников</p>
                    <a href="/communities" className={styles.communityButton}>Присоединиться</a>
                </div>
                <div className={styles.communityCard}>
                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="Community 4" className={styles.communityIcon}/>
                    <h3 className={styles.communityTitle}>Спортивная лига</h3>
                    <p className={styles.communityMembers}>1,456 участников</p>
                    <a href="/communities" className={styles.communityButton}>Присоединиться</a>
                </div>
            </div>
            <a href="#" className={styles.viewAll}>Смотреть все сообщества</a>
        </div>
    </section>

    <section className={styles.section}>
        <div className={styles.container}>
            <div className={styles.guidelinesContainer}>
                <div className={styles.guidelinesContent}>
                    <div className={styles.guidelinesText}>
                        <h2 className={styles.guidelinesTitle}>Наши гайдлайны</h2>
                        <p className={styles.guidelinesDescription}>Мы создали простые рекомендации, которые помогут вам организовать успешное мероприятие и привлечь максимальное количество участников.</p>
                        <ul className={styles.guidelinesList}>
                            <li className={styles.guidelinesItem}>
                                <div className={styles.guidelinesIcon}>1</div>
                                <p className={styles.guidelinesItemText}>Составьте подробное описание события, указав все детали и преимущества для посетителей.</p>
                            </li>
                            <li className={styles.guidelinesItem}>
                                <div className={styles.guidelinesIcon}>2</div>
                                <p className={styles.guidelinesItemText}>Выберите подходящую площадку с учетом формата мероприятия и ожидаемого количества гостей.</p>
                            </li>
                            <li className={styles.guidelinesItem}>
                                <div className={styles.guidelinesIcon}>3</div>
                                <p className={styles.guidelinesItemText}>Заранее анонсируйте событие и приглашайте участников через наши инструменты рассылки.</p>
                            </li>
                            <li className={styles.guidelinesItem}>
                                <div className={styles.guidelinesIcon}>4</div>
                                <p className={styles.guidelinesItemText}>Используйте фото и видео с предыдущих мероприятий для привлечения новых участников.</p>
                            </li>
                        </ul>
                        <a href="/reference" className={styles.ctaButton}>Подробные гайдлайны</a>
                    </div>
                    <div className={styles.guidelinesImage}>
                        <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" alt="Guidelines Image"/>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className={styles.section}>
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Преимущества нашей платформы</h2>
                <p className={styles.sectionSubtitle}>Почему сотни организаторов и тысячи участников выбирают Cityvora</p>
            </div>
            <div className={styles.featuresCards}>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>🔍</div>
                    <h3 className={styles.featureTitle}>Удобный поиск</h3>
                    <p className={styles.featureDescription}>Находите события и сообщества по интересам, местоположению и датам проведения в несколько кликов.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>📱</div>
                    <h3 className={styles.featureTitle}>Мобильное приложение</h3>
                    <p className={styles.featureDescription}>Все функции платформы доступны в нашем мобильном приложении для iOS и Android.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>💬</div>
                    <h3 className={styles.featureTitle}>Коммуникация</h3>
                    <p className={styles.featureDescription}>Чаты, форумы и уведомления помогут вам быть в курсе всех изменений и новостей.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>📊</div>
                    <h3 className={styles.featureTitle}>Аналитика</h3>
                    <p className={styles.featureDescription}>Подробные отчеты и статистика по посещаемости и активности участников.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>🎟️</div>
                    <h3 className={styles.featureTitle}>Билетная система</h3>
                    <p className={styles.featureDescription}>Продавайте билеты и управляйте регистрацией участников через нашу платформу.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>⭐</div>
                    <h3 className={styles.featureTitle}>Рейтинги и отзывы</h3>
                    <p className={styles.featureDescription}>Система рейтингов помогает выбирать лучшие события и надежных организаторов.</p>
                </div>
            </div>
        </div>
    </section>
      </main>

    </div>
  );
};

export default MainPage;