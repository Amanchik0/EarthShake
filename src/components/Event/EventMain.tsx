import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackendEventData, BackendUserData } from '../../types/event';
import { useAuth } from '../../components/auth/AuthContext';

interface EventMainProps {
  event: BackendEventData;
  styles: any
}

const EventMain: React.FC<EventMainProps> = ({ event, styles }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [authorData, setAuthorData] = useState<BackendUserData | null>(null);
  const [loadingAuthor, setLoadingAuthor] = useState(true);

  // Проверяем, создано ли событие от имени сообщества
  const isCreatedForCommunity = event.metadata?.createdForCommunity === true;
  const communityName = event.metadata?.communityName;
  const communityId = event.metadata?.communityId;

  // Загружаем данные автора события
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        console.log(`Загружаем данные автора: ${event.author}`);
        
        const response = await fetch(`http://localhost:8090/api/users/get-by-username/${event.author}`);
        
        if (response.ok) {
          const userData: BackendUserData = await response.json();
          console.log('Получены данные автора:', userData);
          setAuthorData(userData);
        } else {
          console.log('Не удалось загрузить данные автора');
        }
      } catch (error) {
        console.error('Ошибка загрузки данных автора:', error);
      } finally {
        setLoadingAuthor(false);
      }
    };

    fetchAuthorData();
  }, [event.author]);

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Функция для вычисления среднего рейтинга из массива
  const calculateAverageScore = (): number => {
    if (!event.score || !Array.isArray(event.score) || event.score.length === 0) {
      return 0;
    }
    const sum = event.score.reduce((acc, score) => acc + score, 0);
    return sum / event.score.length;
  };

  // Функция для отображения рейтинга
  const renderStars = () => {
    const stars = [];
    const averageScore = calculateAverageScore();
    // Преобразуем из 0-1 шкалы в 1-5 шкалу для отображения
    const rating = averageScore * 5;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={styles.star} style={{ color: i <= rating ? '#FFD700' : '#E0E0E0' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Функция для отображения тегов
  const renderTags = () => {
    return event.tags.map((tag, index) => (
      <span key={index} className={styles.tag}>
        #{tag}
      </span>
    ));
  };

  // Функция для создания ссылки на 2GIS
  const generate2GISLink = () => {
    const [lng, lat] = event.location.coordinates;
    return `https://2gis.kz/almaty/directions/points/%2C${lng}%2C${lat}`;
  };

  // Получаем первое изображение из массива mediaUrl
  const getImageUrl = () => {
    if (Array.isArray(event.mediaUrl) && event.mediaUrl.length > 0) {
      return event.mediaUrl[0];
    }
    return '';
  };

  // Проверяем, является ли текущий пользователь владельцем события
  const isOwner = currentUser?.username === event.author;

  // Обработчик редактирования события
  const handleEditEvent = () => {
    navigate(`/events/${event.id}/edit`);
  };

  // Обработчик перехода к сообществу
  const handleCommunityClick = () => {
    if (communityId) {
      navigate(`/communities/${communityId}`);
    }
  };

  return (
    <section className={styles.eventMain}>
      {/* Изображение события */}
      {getImageUrl() && (
        <div className={styles.eventPhoto}>
          <img 
            src={getImageUrl()} 
            alt={event.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/api/placeholder/600/400';
            }}
          />
        </div>
      )}
      
      <div className={styles.eventInfo}>
        {/* Заголовок и кнопка редактирования */}
        <div className={styles.titleSection}>
          <h1 className={styles.eventTitle}>{event.title}</h1>
          {isOwner && (
            <button 
              className={styles.editButton}
              onClick={handleEditEvent}
              title="Редактировать событие"
            >
              ✏️ Редактировать
            </button>
          )}
        </div>
        
        {/* Метаинформация */}
        <div className={styles.eventMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📅</span>
            <span>
              {event.metadata?.scheduledDate 
                ? formatDate(event.metadata.scheduledDate)
                : formatDate(event.dateTime)
              }
            </span>
          </div>
          
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📍</span>
            <span>{event.city}</span>
          </div>
          
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>👤</span>
            <span>
              {isCreatedForCommunity && communityName 
                ? `${communityName} • @${event.author}`
                : event.author
              }
            </span>
          </div>
        </div>
        
        {/* Описание */}
        <div className={styles.eventDescription}>
          <h3>Описание</h3>
          <p>{event.description}</p>
          {event.content && event.content !== event.description && (
            <>
              <h4>Дополнительная информация</h4>
              <p>{event.content}</p>
            </>
          )}
        </div>
        
        {/* Местоположение */}
        <div className={styles.eventLocation}>
          <h3>📍 Местоположение</h3>
          <div className={styles.locationInfo}>
            <p><strong>Город:</strong> {event.city}</p>
            {event.metadata?.address && (
              <p><strong>Адрес:</strong> {event.metadata.address}</p>
            )}
            <div className={styles.routeLink}>
              <a 
                href={generate2GISLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.routeButton}
              >
                🗺️ Построить маршрут в 2GIS
              </a>
            </div>
          </div>
        </div>
        
        {/* Теги */}
        {event.tags.length > 0 && (
          <div className={styles.eventTags}>
            <h3>🏷️ Теги</h3>
            <div className={styles.tagsContainer}>
              {renderTags()}
            </div>
          </div>
        )}
        
        {/* Рейтинг и участники */}
        <div className={styles.eventStats}>
          <div className={styles.eventRating}>
            <h3>⭐ Рейтинг</h3>
            <div className={styles.starsContainer}>
              {renderStars()}
              <span className={styles.ratingText}>
                ({calculateAverageScore().toFixed(1)})
              </span>
            </div>
          </div>
          
          <div className={styles.eventParticipants}>
            <h3>👥 Участники</h3>
            <p>{event.usersIds.length} человек</p>
          </div>
        </div>
        
        {/* Информация об авторе/организаторе */}
        <div className={styles.authorInfo}>
          <div className={styles.authorAvatar}>
            {loadingAuthor ? (
              <div className={styles.avatarPlaceholder}>
                <div className={styles.avatarLoader}>⏳</div>
              </div>
            ) : authorData?.imageUrl ? (
              <img 
                src={authorData.imageUrl} 
                alt={authorData.username}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove(styles.hidden);
                }}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {event.author.charAt(0).toUpperCase()}
              </div>
            )}
            {authorData?.imageUrl && (
              <div className={`${styles.avatarPlaceholder} ${styles.hidden}`}>
                {event.author.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.authorDetails}>
            {isCreatedForCommunity ? (
              // Отображение для событий от сообщества
              <>
                <div className={styles.authorName}>
                  <strong 
                    onClick={handleCommunityClick}
                    style={{ cursor: 'pointer', color: 'var(--primary-pink)' }}
                  >
                    {communityName}
                  </strong>
                </div>
                <div className={styles.authorRole}>Сообщество</div>
                <div className={styles.authorCreator}>
                  Создано пользователем: <strong>
                    {authorData?.firstName && authorData?.lastName 
                      ? `${authorData.firstName} ${authorData.lastName}`
                      : event.author
                    }
                  </strong>
                </div>
                <div className={styles.authorUsername}>@{event.author}</div>
                {authorData?.bio && (
                  <div className={styles.authorBio}>{authorData.bio}</div>
                )}
              </>
            ) : (
              // Отображение для событий от пользователя
              <>
                <div className={styles.authorName}>
                  <strong>
                    {authorData?.firstName && authorData?.lastName 
                      ? `${authorData.firstName} ${authorData.lastName}`
                      : event.author
                    }
                  </strong>
                </div>
                <div className={styles.authorRole}>Организатор события</div>
                <div className={styles.authorUsername}>@{event.author}</div>
                {authorData?.bio && (
                  <div className={styles.authorBio}>{authorData.bio}</div>
                )}
              </>
            )}
            <div className={styles.eventCreated}>
              Создано: {formatDate(event.dateTime)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventMain;