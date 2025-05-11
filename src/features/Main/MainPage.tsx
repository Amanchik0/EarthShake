import React, { useEffect, useState } from 'react';
import styles from './mainStyle.module.css';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/MainPage/HeroSection';
import MapSection from '../../components/MainPage/MapSection';
import EventSection from '../../components/MainPage/EventSection';
import { Event } from '../../types/event';
import { Community } from '../../types/community';
import CommunitySection from '../../components/MainPage/CommunitiesSection';



const MainPage: React.FC = () => {

    const mockEvents = [
        {
            id: 1,
            title: 'IT-конференция Kazakhstan Digital 2025',
            description: 'Ежегодная конференция для профессионалов IT-индустрии со всего Казахстана.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            date: '27 апреля',
            location: 'Алматы'
        },
        {
            id: 2,
            title: 'Фестиваль стартапов Astana Hub',
            description: 'Презентация инновационных проектов и нетворкинг с инвесторами.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            date: '15 мая',
            location: 'Нур-Султан'
        },
        {
            id: 5,
            title: 'Эко-фестиваль "Зеленый Казахстан"',
            description: 'Мероприятие, посвященное экологичному образу жизни и защите природы.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            date: '5 июня',
            location: 'Шымкент'
        },
         {
            id: 4,
            title: 'Эко-фестиваль "Зеленый Казахстан"',
            description: 'Мероприятие, посвященное экологичному образу жизни и защите природы.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            date: '5 июня',
            location: 'Шымкент'
        },
         {
            id: 3,
            title: 'Эко-фестиваль "Зеленый Казахстан"',
            description: 'Мероприятие, посвященное экологичному образу жизни и защите природы.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            date: '5 июня',
            location: 'Шымкент'
        }

    ];
    const mockCommunities = [
        {
            id: 1,
            name: 'IT-специалисты Казахстана',
            description: 'Сообщество для обмена опытом и знаниями в области информационных технологий.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            numberMembers: 3245
        },
        {
            id: 2,
            name: 'Бизнес-сообщество',
            description: 'Обсуждение актуальных тем бизнеса и предпринимательства.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            numberMembers: 1200
        },
        {
            id: 3,
            name: 'Творческие люди',
            description: 'Сообщество для художников, музыкантов и творческих личностей.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            numberMembers: 1500
        }, 
         {
            id: 4,
            name: 'IT-специалисты Казахстана',
            description: 'Сообщество для обмена опытом и знаниями в области информационных технологий.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            numberMembers: 3245
        },
         {
            id: 5,
            name: 'IT-специалисты Казахстана',
            description: 'Сообщество для обмена опытом и знаниями в области информационных технологий.',
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1',
            numberMembers: 3245
        },
    ];
    const [events , setEvents] = useState<Event[]>([])
    const [communities , setCommunities] = useState<Community[]>([])
    const navigate = useNavigate();
      useEffect(() => {
        const abortController = new AbortController()
        const fetchData = async()=>{
            try {
                // const [eventsResponse, communitiesResponse] = await Promise.all([
                //     fetch('/api/events/', { signal: abortController.signal }),
                //     fetch('/api/communities/', { signal: abortController.signal })  
                // ]);
                // const [eventsData, communitiesData] = await Promise.all([
                //     eventsResponse.json(),
                //     communitiesResponse.json()
                // ]); 
                setEvents(mockEvents);
                setCommunities(mockCommunities);

            }
            catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                    console.log('Error fetching data:', error);
                } 
            }
        }; 
        fetchData();
    },[]);
    

    const handleEventClick = (eventId: number) => {
        console.log('Event clicked:', eventId);
        navigate(`/events/${eventId}`);
    }
    const handleCommunityClick = (communityId: number) => {
        console.log('Community clicked:', communityId);
        navigate(`/communities/${communityId}`);
    }
  return (
    <div className={styles.pageWrapper}>
      
      <main>
      {/* <section className={styles.heroSection}>
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
    </section> */}
    <HeroSection />
            {/* TODO доделать карту  */}
    <MapSection />
    <EventSection events={events}  onEventClick={handleEventClick}/>
    <CommunitySection communities={communities} onCommunityClick={handleCommunityClick}/>


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