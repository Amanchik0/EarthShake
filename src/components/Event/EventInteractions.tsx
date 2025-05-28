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

  // Функция для обновления события через API
  const updateEvent = async (updates: Partial<BackendEventData>) => {
    try {
      const token = localStorage.getItem('accessToken');
      const updatedEventData = { ...event, ...updates };

      const response = await fetch('http://localhost:8090/api/events/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedEventData)
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
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
    if (!user || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newCommentId = `comment_${Date.now()}`;
      const newComment = {
        id: newCommentId,
        author: user.username,
        text: commentText.trim(),
        date: new Date().toISOString(),
        avatarUrl: ''
      };

      const updatedComments = {
        ...event.comments,
        [newCommentId]: newComment
      };

      await updateEvent({ comments: updatedComments });
      setCommentText('');
    } catch (error) {
      alert('Не удалось добавить комментарий');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Добавление/изменение оценки
  const handleRateEvent = async (rating: number) => {
    if (!user) return;

    setIsSubmittingRating(true);
    try {
      // Просто обновляем общий score события
      // В реальном приложении здесь была бы более сложная логика расчета среднего рейтинга
      await updateEvent({ score: rating });
      setUserRating(rating);
    } catch (error) {
      alert('Не удалось оценить событие');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Присоединение к событию / покинуть событие
  const handleToggleParticipation = async () => {
    if (!user) return;

    setIsJoiningEvent(true);
    try {
      let updatedUsersIds;
      if (isParticipant) {
        // Покинуть событие
        updatedUsersIds = event.usersIds.filter(id => id !== user.username);
      } else {
        // Присоединиться к событию
        updatedUsersIds = [...event.usersIds, user.username];
      }

      await updateEvent({ usersIds: updatedUsersIds });
    } catch (error) {
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