import React from 'react';
import styles from '../../features/Main/mainStyle.module.css';
import { EventDetails } from '../../types/event';

interface EventSectionProps {
    events: EventDetails[];
    onEventClick: (eventId: string | number) => void;
    maxItems?: number; 
}

const EventSection: React.FC<EventSectionProps> = ({ events, onEventClick, maxItems = 3 }) => {
    const displayedEvents = events.slice(0, maxItems);

    if (events.length === 0) {
        return (
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Популярные события</h2>
                        <p className={styles.sectionSubtitle}>
                            Присоединяйтесь к самым интересным мероприятиям в вашем городе
                        </p>
                    </div>
                    <div className={styles.emptyState}>
                        <p>Пока нет доступных событий</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Популярные события</h2>
                    <p className={styles.sectionSubtitle}>
                        Присоединяйтесь к самым интересным мероприятиям в вашем городе
                    </p>
                </div>
                <div className={styles.eventCards}>
                    {displayedEvents.map((event) => (
                        <div key={event.id} className={styles.eventCard}>
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className={styles.eventImage}
                                onError={(e) => {
                                    e.currentTarget.src = '/api/placeholder/600/400';
                                }}
                            />
                            <div className={styles.eventDetails}>
                                <div className={styles.eventMeta}>
                                    <span className={styles.eventDate}>{event.date}</span>
                                    <span className={styles.eventLocation}>
                                        {event.metadata?.address || event.city}
                                    </span>
                                </div>
                                <h3 className={styles.eventTitle}>{event.title}</h3>
                                <p className={styles.eventDescription}>
                                    {typeof event.description === 'string' 
                                        ? event.description 
                                        : Array.isArray(event.description) 
                                            ? event.description.join(' ') 
                                            : 'Описание события'}
                                </p>
                                <button 
                                    onClick={() => onEventClick(event.id)}
                                    className={styles.eventButton}
                                >
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <a href="/events" className={styles.viewAll}>
                    Смотреть все события
                </a>
            </div>
        </section>
    );
};

export default EventSection;