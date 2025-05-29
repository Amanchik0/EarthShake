import React, { useState } from 'react';
import { BackendEventData, NewComment, NewRating } from '../../types/event';
import { useAuth } from '../../components/auth/AuthContext';

interface EventInteractionsProps {
  event: BackendEventData;
  styles: any;
  onEventUpdate: (updatedEvent: BackendEventData) => void;
}

const EventInteractions: React.FC<EventInteractionsProps> = ({ event, styles, onEventUpdate }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isJoiningEvent, setIsJoiningEvent] = useState(false);

  // Проверяем, участвует ли пользователь в событии
  const isParticipant = user ? event.usersIds.includes(user.username) : false;

  const updateEvent = async (updates: Partial<BackendEventData>) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Создаем структуру данных точно как в примере API
      const updatedEventData = {
        id: event.id,
        eventType: event.eventType,
        emergencyType: event.emergencyType,
        title: event.title,
        description: event.description,
        content: event.content,
        author: event.author,
        city: event.city,
        location: {
          x: event.location.x,
          y: event.location.y
          // Убираем coordinates и type, оставляем только x и y как в примере
        },
        mediaUrl: event.mediaUrl,
        score: event.score,
        dateTime: event.dateTime,
        eventStatus: event.eventStatus,
        tags: [...event.tags],
        usersIds: [...event.usersIds],
        metadata: {
          address: event.metadata.address,
          scheduledDate: event.metadata.scheduledDate,
          createdAt: event.metadata.createdAt
        },
        comments: { ...event.comments },
        archived: event.archived,
        // Применяем обновления
        ...updates
      };

      console.log('Отправляем данные для обновления:', JSON.stringify(updatedEventData, null, 2));

      const response = await fetch('http://localhost:8090/api/events/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(updatedEventData)
      });

      const responseText = await response.text();
      console.log('Ответ сервера:', responseText);

      if (!response.ok) {
        console.error('Ошибка сервера:', responseText);
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Не удалось парсить ответ как JSON:', responseText);
        throw new Error('Некорректный ответ сервера');
      }

      console.log('Событие обновлено:', result);
      onEventUpdate(result);
      return result;
    } catch (error) {
      console.error('Ошибка обновления события:', error);
      throw error;
    }
  };

  // Добавление комментария
  const handleAddComment = async () => {
    if (!user || !commentText.trim()) {
      console.log('Нет пользователя или пустой комментарий');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const newCommentId = `comment_${Date.now()}_${user.username}`;
      const newComment = {
        author: user.username,
        text: commentText.trim(),
        date: new Date().toISOString(),
        avatarUrl: ''
      };

      console.log('Добавляем комментарий:', newComment);

      const updatedComments = {
        ...event.comments,
        [newCommentId]: newComment
      };

      await updateEvent({ comments: updatedComments });
      setCommentText('');
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
      alert('Не удалось добавить комментарий');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Добавление/изменение оценки
  const handleRateEvent = async (rating: number) => {
    if (!user) {
      console.log('Нет пользователя для оценки');
      return;
    }

    console.log('Оцениваем событие:', rating);
    setIsSubmittingRating(true);
    try {
      await updateEvent({ score: rating });
      setUserRating(rating);
    } catch (error) {
      console.error('Ошибка оценки события:', error);
      alert('Не удалось оценить событие');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Присоединение к событию / покинуть событие
  const handleToggleParticipation = async () => {
    if (!user) {
      console.log('Нет пользователя для участия');
      return;
    }

    console.log('Текущий статус участия:', isParticipant);
    console.log('Текущие участники:', event.usersIds);

    setIsJoiningEvent(true);
    try {
      let updatedUsersIds;
      if (isParticipant) {
        // Покинуть событие
        updatedUsersIds = event.usersIds.filter(id => id !== user.username);
        console.log('Покидаем событие, новый список:', updatedUsersIds);
      } else {
        // Присоединиться к событию
        updatedUsersIds = [...event.usersIds, user.username];
        console.log('Присоединяемся к событию, новый список:', updatedUsersIds);
      }

      await updateEvent({ usersIds: updatedUsersIds });
    } catch (error) {
      console.error('Ошибка изменения участия:', error);
      alert('Не удалось изменить участие в событии');
    } finally {
      setIsJoiningEvent(false);
    }
  };

  // Рендер звезд для оценки
  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => handleRateEvent(i)}
          disabled={isSubmittingRating}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: isSubmittingRating ? 'not-allowed' : 'pointer',
            color: i <= (userRating || event.score || 0) ? 'gold' : 'var(--light-gray)',
            transition: 'color 0.2s',
            padding: '2px'
          }}
          onMouseEnter={(e) => {
            if (!isSubmittingRating) {
              e.currentTarget.style.color = 'gold';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmittingRating) {
              e.currentTarget.style.color = i <= (userRating || event.score || 0) ? 'gold' : 'var(--light-gray)';
            }
          }}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  if (!user) {
    return (
      <div className={styles.interactionsSection}>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--dark-gray)' }}>
          <p>Войдите в систему, чтобы взаимодействовать с событием</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.interactionsSection}>
      {/* Участие в событии */}
      <div className={styles.participationSection}>
        <button
          onClick={handleToggleParticipation}
          disabled={isJoiningEvent}
          className={`${styles.participationButton} ${isParticipant ? styles.leaveButton : styles.joinButton}`}
        >
          {isJoiningEvent ? '...' : isParticipant ? '❌ Покинуть событие' : '✅ Участвовать в событии'}
        </button>
        <span className={styles.participantsCount}>
          {event.usersIds.length} участник{event.usersIds.length === 1 ? '' : event.usersIds.length < 5 ? 'а' : 'ов'}
        </span>
      </div>

      {/* Оценка события */}
      <div className={styles.ratingSection}>
        <h3 className={styles.sectionTitle}>Оцените событие:</h3>
        <div className={styles.ratingStars}>
          {renderRatingStars()}
          <span className={styles.ratingText}>
            ({event.score ? event.score.toFixed(1) : '0.0'})
          </span>
        </div>
        {isSubmittingRating && <p style={{ fontSize: '0.8rem', color: 'var(--dark-gray)' }}>Сохранение оценки...</p>}
      </div>

      {/* Добавление комментария */}
      <div className={styles.addCommentSection}>
        <h3 className={styles.sectionTitle}>Добавить комментарий:</h3>
        <div className={styles.commentForm}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Напишите ваш комментарий..."
            className={styles.commentTextarea}
            rows={3}
            maxLength={500}
          />
          <div className={styles.commentActions}>
            <span className={styles.charCount}>
              {commentText.length}/500
            </span>
            <button
              onClick={handleAddComment}
              disabled={isSubmittingComment || !commentText.trim()}
              className={styles.submitCommentButton}
            >
              {isSubmittingComment ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInteractions;