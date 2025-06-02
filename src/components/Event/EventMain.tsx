import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackendEventData, BackendUserData } from '../../types/event';
import { useAuth } from '../../components/auth/AuthContext';

// Интерфейс для данных сообщества
interface CommunityData {
  id: string;
  name: string;
  description?: string;
  imageUrls?: string[]; // Массив изображений
  // Добавьте другие поля сообщества по необходимости
}

interface EventMainProps {
  event: BackendEventData;
  styles: any
}

const EventMain: React.FC<EventMainProps> = ({ event, styles }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [authorData, setAuthorData] = useState<BackendUserData | null>(null);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Проверяем, является ли событие событием сообщества
  const isCommunityEvent = event.metadata?.isCommunity === "true" || event.metadata?.isCommunity === true;
  const communityId = event.metadata?.communityId;

  // Загружаем данные автора или сообщества
  useEffect(() => {
    const fetchAuthorOrCommunityData = async () => {
      try {
        if (isCommunityEvent && communityId) {
          // Загружаем данные сообщества
          console.log(`Загружаем данные сообщества: ${communityId}`);
          
          // Попробуем разные возможные эндпоинты
          let response;
          const possibleEndpoints = [
            `http://localhost:8090/api/community/${communityId}`,
          ];

          for (const endpoint of possibleEndpoints) {
            try {
              response = await fetch(endpoint);
              if (response.ok) {
                console.log(`Успешный эндпоинт: ${endpoint}`);
                break;
              }
            } catch (error) {
              console.log(`Эндпоинт ${endpoint} не работает`);
            }
          }
          
          if (response && response.ok) {
            const community: CommunityData = await response.json();
            console.log('Получены данные сообщества:', community);
            setCommunityData(community);
          } else {
            console.log('Не удалось загрузить данные сообщества со всех эндпоинтов');
            // Устанавливаем fallback данные с именем из author поля
            setCommunityData({
              id: communityId,
              name: event.author, // Используем author как fallback название
              description: 'Сообщество'
            });
          }
        } else {
          // Загружаем данные автора-пользователя
          console.log(`Загружаем данные автора: ${event.author}`);
          
          const response = await fetch(`http://localhost:8090/api/users/get-by-username/${event.author}`);
          
          if (response.ok) {
            const userData: BackendUserData = await response.json();
            console.log('Получены данные автора:', userData);
            setAuthorData(userData);
          } else {
            console.log('Не удалось загрузить данные автора');
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных автора/сообщества:', error);
      } finally {
        setLoadingAuthor(false);
      }
    };

    fetchAuthorOrCommunityData();
  }, [event.author, isCommunityEvent, communityId]);

  // Функции для работы с оценками
  const getScores = () => {
    if (!event.score) return [];
    if (Array.isArray(event.score)) return event.score;
    return [];
  };

  const getAverageScore = () => {
    const scores = getScores();
    if (scores.length === 0) return 0;
    
    const total = scores.reduce((sum, score) => {
      // Поддержка разных форматов: {username: rating} или {username: "name", rating: number}
      const rating = score.rating || Object.values(score).find(val => typeof val === 'number') || 0;
      return sum + rating;
    }, 0);
    
    return total / scores.length;
  };

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

  // Функция для отображения рейтинга
  const renderStars = () => {
    const stars = [];
    const averageRating = getAverageScore();
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={styles.star} style={{ color: i <= averageRating ? '#FFD700' : '#E0E0E0' }}>
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
    const lng = event.location.x;
    const lat = event.location.y;
    return `https://2gis.kz/almaty/directions/points/%2C${lng}%2C${lat}`;
  };

  // Проверяем, является ли текущий пользователь владельцем события
  const isOwner = currentUser?.username === event.author;

  // Обработчик перехода на страницу сообщества
  const handleCommunityClick = () => {
    if (isCommunityEvent && communityId) {
      navigate(`/communities/${communityId}`);
    }
  };

  // Обработчик редактирования события
  const handleEditEvent = () => {
    navigate(`/events/${event.id}/edit`);
  };
  const getMediaUrls = (): string[] => {
    if (Array.isArray(event.mediaUrl)) {
      return event.mediaUrl;
    }
    return event.mediaUrl ? [event.mediaUrl] : [];
  };

  // Функции для навигации по изображениям
  const nextImage = () => {
    const mediaUrls = getMediaUrls();
    setCurrentImageIndex((prev) => (prev + 1) % mediaUrls.length);
  };

  const prevImage = () => {
    const mediaUrls = getMediaUrls();
    setCurrentImageIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  };

  // Функция для получения отображаемого имени автора
  const getDisplayAuthorName = () => {
    if (isCommunityEvent && communityData) {
      return communityData.name; // Название сообщества
    }
    if (authorData?.firstName && authorData?.lastName) {
      return `${authorData.firstName} ${authorData.lastName}`; // Полное имя пользователя
    }
    return event.author; // Username как fallback
  };

  // Функция для получения роли автора
  const getAuthorRole = () => {
    if (isCommunityEvent) {
      return 'Сообщество';
    }
    return 'Организатор события';
  };

  // Функция для получения аватара автора
  const getAuthorAvatar = () => {
    if (isCommunityEvent && communityData?.imageUrls && communityData.imageUrls.length > 0) {
      return communityData.imageUrls[0]; // Первое изображение из массива
    }
    if (authorData?.imageUrl) {
      return authorData.imageUrl;
    }
    return null;
  };

  // Функция для получения заглавной буквы для аватара-плейсхолдера
  const getAvatarPlaceholderLetter = () => {
    if (isCommunityEvent && communityData) {
      return communityData.name.charAt(0).toUpperCase();
    }
    return event.author.charAt(0).toUpperCase();
  };

  const mediaUrls = getMediaUrls();
  const averageScore = getAverageScore();
  const scoresCount = getScores().length;

  return (
    <section className={styles.eventMain}>
      {/* Изображения события с поддержкой галереи */}
      {mediaUrls.length > 0 && (
        <div className={styles.eventPhoto}>
          <img 
            src={mediaUrls[currentImageIndex]} 
            alt={event.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/api/placeholder/600/400';
            }}
          />
          
          {/* Навигация по изображениям (если их несколько) */}
          {mediaUrls.length > 1 && (
            <>
              <button 
                className={styles.imageNavButton + ' ' + styles.prevButton}
                onClick={prevImage}
                aria-label="Предыдущее изображение"
              >
                ❮
              </button>
              <button 
                className={styles.imageNavButton + ' ' + styles.nextButton}
                onClick={nextImage}
                aria-label="Следующее изображение"
              >
                ❯
              </button>
              
              {/* Индикаторы изображений */}
              <div className={styles.imageIndicators}>
                {mediaUrls.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.imageIndicator} ${index === currentImageIndex ? styles.active : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Изображение ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Счетчик изображений */}
              <div className={styles.imageCounter}>
                {currentImageIndex + 1} / {mediaUrls.length}
              </div>
            </>
          )}
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
            <span className={styles.metaIcon}>
              {isCommunityEvent ? '👥' : '👤'}
            </span>
            <span 
              style={isCommunityEvent ? { cursor: 'pointer', color: 'var(--primary-pink)' } : {}}
              onClick={isCommunityEvent ? handleCommunityClick : undefined}
            >
              {getDisplayAuthorName()}
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
                ({averageScore > 0 ? averageScore.toFixed(1) : '0.0'})
              </span>
            </div>
            {scoresCount > 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--dark-gray)', marginTop: '3px' }}>
                {scoresCount} оценок
              </p>
            )}
          </div>
          
          <div className={styles.eventParticipants}>
            <h3>👥 Участники</h3>
            <p>{event.usersIds.length} человек</p>
          </div>
        </div>
        
        {/* Информация об авторе/сообществе */}
        <div className={styles.authorInfo}>
          {isCommunityEvent ? (
            // Отображение для сообщества - вся секция как кнопка
            <div 
              className={styles.communityButton}
              onClick={handleCommunityClick}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
                border: 'none',
                background: 'transparent',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className={styles.authorAvatar}>
                {loadingAuthor ? (
                  <div className={styles.avatarPlaceholder}>
                    <div className={styles.avatarLoader}>⏳</div>
                  </div>
                ) : getAuthorAvatar() ? (
                  <img 
                    src={getAuthorAvatar()!} 
                    alt={getDisplayAuthorName()}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove(styles.hidden);
                    }}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {getAvatarPlaceholderLetter()}
                  </div>
                )}
                {getAuthorAvatar() && (
                  <div className={`${styles.avatarPlaceholder} ${styles.hidden}`}>
                    {getAvatarPlaceholderLetter()}
                  </div>
                )}
              </div>
              <div className={styles.authorDetails}>
                <div className={styles.authorName}>
                  <strong>{getDisplayAuthorName()}</strong>
                </div>
                <div className={styles.authorRole}>{getAuthorRole()}</div>
                <div className={styles.authorUsername}>@{event.author}</div>
                <div className={styles.eventCreated}>
                  Создано: {formatDate(event.dateTime)}
                </div>
              </div>
            </div>
          ) : (
            // Отображение для обычного пользователя - без кнопки
            <>
              <div className={styles.authorAvatar}>
                {loadingAuthor ? (
                  <div className={styles.avatarPlaceholder}>
                    <div className={styles.avatarLoader}>⏳</div>
                  </div>
                ) : getAuthorAvatar() ? (
                  <img 
                    src={getAuthorAvatar()!} 
                    alt={getDisplayAuthorName()}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove(styles.hidden);
                    }}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {getAvatarPlaceholderLetter()}
                  </div>
                )}
                {getAuthorAvatar() && (
                  <div className={`${styles.avatarPlaceholder} ${styles.hidden}`}>
                    {getAvatarPlaceholderLetter()}
                  </div>
                )}
              </div>
              <div className={styles.authorDetails}>
                <div className={styles.authorName}>
                  <strong>{getDisplayAuthorName()}</strong>
                </div>
                <div className={styles.authorRole}>{getAuthorRole()}</div>
                <div className={styles.authorUsername}>@{event.author}</div>
                {authorData?.bio && (
                  <div className={styles.authorBio}>{authorData.bio}</div>
                )}

              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventMain;