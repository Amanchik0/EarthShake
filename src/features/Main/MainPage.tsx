import React, { useEffect, useState } from 'react';
import styles from './mainStyle.module.css';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/MainPage/HeroSection';
import MapSection from '../../components/MainPage/MapSection';
import EventSection from '../../components/MainPage/EventSection';
import { Event, BackendEventData } from '../../types/event';
import { Community } from '../../types/community';
import CommunitySection from '../../components/MainPage/CommunitiesSection';

const MainPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const abortController = new AbortController();
        
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [eventsResponse, communitiesResponse] = await Promise.all([
                    fetch('http://localhost:8090/api/events/get-all', { 
                        signal: abortController.signal 
                    }),
                    fetch('http://localhost:8090/api/community/get-all', { 
                        signal: abortController.signal 
                    })
                ]);

                if (!eventsResponse.ok) {
                    throw new Error(`Events API error: ${eventsResponse.status}`);
                }
                if (!communitiesResponse.ok) {
                    throw new Error(`Communities API error: ${communitiesResponse.status}`);
                }

                const [eventsData, communitiesData] = await Promise.all([
                    eventsResponse.json(),
                    communitiesResponse.json()
                ]);

                // Преобразуем данные событий из формата бэкенда
                const transformedEvents: Event[] = eventsData.content.map((event: BackendEventData) => ({
                    id: event.id,
                    title: event.title,
                    date: formatEventDate(event.dateTime),
                    description: event.description,
                    imageUrl: Array.isArray(event.mediaUrl) ? event.mediaUrl[0] : event.mediaUrl || '/api/placeholder/600/400',
                    city: event.city,
                    location: event.metadata?.address || event.city
                }));

                // Преобразуем данные сообществ
                const transformedCommunities: Community[] = communitiesData.content.map((community: any) => ({
                    id: community.id,
                    name: community.name,
                    description: community.description,
                    imageUrl: community.imageUrls[0] || '/api/placeholder/150/150',
                    numberMembers: community.numberMembers,
                    type: community.type,
                    createdAt: community.createdAt,
                    rating: community.rating,
                    reviewsCount: community.reviewsCount,
                    content: community.content,
                    city: community.city,
                    eventsCount: community.eventsCount,
                    postsCount: community.postsCount,
                    users: community.users,
                    author: community.author,
                    listEvents: community.listEvents
                }));

                setEvents(transformedEvents);
                setCommunities(transformedCommunities);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching data:', error);
                    setError('Ошибка загрузки данных. Попробуйте позже.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            abortController.abort();
        };
    }, []);

    // Функция для форматирования даты юзаем при преобразовании данных на ивент из за даты 
    const formatEventDate = (dateTime: string): string => {
        try {
            const date = new Date(dateTime);
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long'
            });
        } catch (error) {
            return 'Дата не указана';
        }
    };

    const handleEventClick = (eventId: string | number) => {
        console.log('Event clicked:', eventId);
        navigate(`/events/${eventId}`);
    };

    const handleCommunityClick = (communityId: string | number) => {
        console.log('Community clicked:', communityId);
        navigate(`/communities/${communityId}`);
    };

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.loading}>
                    <p>Загрузка данных...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.error}>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <main>
                <HeroSection />
                <MapSection events={events} />
                <EventSection events={events} onEventClick={handleEventClick} />
                <CommunitySection communities={communities} onCommunityClick={handleCommunityClick} />

                {/* <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.guidelinesContainer}>
                            <div className={styles.guidelinesContent}>
                                <div className={styles.guidelinesText}>
                                    <h2 className={styles.guidelinesTitle}>Наши гайдлайны</h2>
                                    <p className={styles.guidelinesDescription}>
                                        Мы создали простые рекомендации, которые помогут вам организовать успешное мероприятие и привлечь максимальное количество участников.
                                    </p>
                                    <ul className={styles.guidelinesList}>
                                        <li className={styles.guidelinesItem}>
                                            <div className={styles.guidelinesIcon}>1</div>
                                            <p className={styles.guidelinesItemText}>
                                                Составьте подробное описание события, указав все детали и преимущества для посетителей.
                                            </p>
                                        </li>
                                        <li className={styles.guidelinesItem}>
                                            <div className={styles.guidelinesIcon}>2</div>
                                            <p className={styles.guidelinesItemText}>
                                                Выберите подходящую площадку с учетом формата мероприятия и ожидаемого количества гостей.
                                            </p>
                                        </li>
                                        <li className={styles.guidelinesItem}>
                                            <div className={styles.guidelinesIcon}>3</div>
                                            <p className={styles.guidelinesItemText}>
                                                Заранее анонсируйте событие и приглашайте участников через наши инструменты рассылки.
                                            </p>
                                        </li>
                                        <li className={styles.guidelinesItem}>
                                            <div className={styles.guidelinesIcon}>4</div>
                                            <p className={styles.guidelinesItemText}>
                                                Используйте фото и видео с предыдущих мероприятий для привлечения новых участников.
                                            </p>
                                        </li>
                                    </ul>
                                    <a href="/reference" className={styles.ctaButton}>
                                        Подробные гайдлайны
                                    </a>
                                </div>
                                <div className={styles.guidelinesImage}>
                                    <img 
                                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1" 
                                        alt="Guidelines Image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Преимущества нашей платформы</h2>
                            <p className={styles.sectionSubtitle}>
                                Почему сотни организаторов и тысячи участников выбирают Cityvora
                            </p>
                        </div>
                        <div className={styles.featuresWrapper}>
                            <div className={styles.featuresCards}>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>🔍</div>
                                    <h3 className={styles.featureTitle}>Удобный поиск</h3>
                                    <p className={styles.featureDescription}>
                                        Находите события и сообщества по интересам, местоположению и датам проведения в несколько кликов.
                                    </p>
                                </div>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>📱</div>
                                    <h3 className={styles.featureTitle}>Мобильное веб приложение</h3>
                                    <p className={styles.featureDescription}>
                                        Все функции платформы доступны в нашем мобильном веб приложении.
                                    </p>
                                </div>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>💬</div>
                                    <h3 className={styles.featureTitle}>Коммуникация</h3>
                                    <p className={styles.featureDescription}>
                                        Чаты, форумы и уведомления помогут вам быть в курсе всех изменений и новостей.
                                    </p>
                                </div>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>📊</div>
                                    <h3 className={styles.featureTitle}>Аналитика</h3>
                                    <p className={styles.featureDescription}>
                                        Подробные отчеты и статистика по посещаемости и активности участников.
                                    </p>
                                </div>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>🎟️</div>
                                    <h3 className={styles.featureTitle}>Билетная система</h3>
                                    <p className={styles.featureDescription}>
                                        Продавайте билеты и управляйте регистрацией участников через нашу платформу.
                                    </p>
                                </div>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>⭐</div>
                                    <h3 className={styles.featureTitle}>Рейтинги и отзывы</h3>
                                    <p className={styles.featureDescription}>
                                        Система рейтингов помогает выбирать лучшие события и надежных организаторов.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MainPage;