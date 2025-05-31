import React, { useState, useEffect } from 'react';
import { BackendEventData } from '../../types/event';
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

  // Функции для работы с оценками
  const getScores = () => {
    if (!event.score) return [];
    if (Array.isArray(event.score)) return event.score;
    return [];
  };

  const getUserScore = () => {
    if (!user) return 0;
    const scores = getScores();
    const userScore = scores.find(score => {
      // Поддерживаем разные форматы: {username: rating} или {username: "name", rating: number}
      return score.username === user.username || score[user.username] !== undefined;
    });
    
    if (userScore) {
      // Если есть поле rating, используем его, иначе ищем значение по username
      return userScore.rating || userScore[user.username] || 0;
    }
    return 0;
  };

  const getAverageScore = () => {
    const scores = getScores();
    if (scores.length === 0) return 0;
    
    const total = scores.reduce((sum, score) => {
      // Поддержка разных форматов
      const rating = score.rating || Object.values(score).find(val => typeof val === 'number') || 0;
      return sum + rating;
    }, 0);
    
    return total / scores.length;
  };

  // Устанавливаем пользовательский рейтинг при загрузке
  useEffect(() => {
    const currentUserScore = getUserScore();
    setUserRating(currentUserScore);
  }, [event.score, user]);

  const updateEvent = async (updates: Partial<BackendEventData>) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Создаем полную структуру данных для обновления
      const updatedEventData = {
        id: event.id, // Обязательно добавляем ID
        eventType: event.eventType,
        title: event.title,
        description: event.description,
        content: event.content,
        author: event.author,
        city: event.city,
        location: {
          x: event.location.x,
          y: event.location.y
        },
        mediaUrl: Array.isArray(event.mediaUrl) ? event.mediaUrl : [event.mediaUrl].filter(Boolean),
        dateTime: event.dateTime,
        tags: [...event.tags],
        usersIds: [...event.usersIds],
        metadata: {
          address: event.metadata?.address || '',
          scheduledDate: event.metadata?.scheduledDate || event.dateTime,
          createdAt: event.metadata?.createdAt || new Date().toISOString(),
          isCommunity: event.metadata?.isCommunity || 'true'
        },
        comments: [...event.comments],
        archived: event.archived || false,
        score: getScores(), // Текущие оценки
        // Применяем обновления поверх базовых данных
        ...updates
      };

      // Добавляем emergencyType если событие экстренное
      if (event.eventType === 'EMERGENCY' && event.emergencyType) {
        (updatedEventData as any).emergencyType = event.emergencyType;
      }

      console.log('🚀 Отправляем данные для обновления:', JSON.stringify(updatedEventData, null, 2));

      const response = await fetch('http://localhost:8090/api/events/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(updatedEventData)
      });

      const responseText = await response.text();
      console.log('📥 Ответ сервера (статус:', response.status, '):', responseText);

      if (!response.ok) {
        console.error('❌ Ошибка сервера:', response.status, responseText);
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      let result;
      try {
        result = responseText ? JSON.parse(responseText) : updatedEventData;
      } catch (e) {
        console.warn('⚠️ Не удалось парсить ответ как JSON, используем отправленные данные');
        result = updatedEventData;
      }

      console.log('✅ Событие обновлено:', result);
      onEventUpdate(result);
      return result;
    } catch (error) {
      console.error('💥 Ошибка обновления события:', error);
      throw error;
    }
  };

  // Добавление комментария
  const handleAddComment = async () => {
    if (!user || !commentText.trim()) {
      console.log('❌ Нет пользователя или пустой комментарий');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const newComment = {
        id: `comment_${Date.now()}_${user.username}`,
        author: user.username,
        text: commentText.trim(),
        date: new Date().toISOString(),
        avatarUrl: ''
      };

      console.log('💬 Добавляем комментарий:', newComment);

      const updatedComments = [...event.comments, newComment];

      await updateEvent({ comments: updatedComments });
      setCommentText('');
    } catch (error) {
      console.error('💥 Ошибка добавления комментария:', error);
      alert('Не удалось добавить комментарий');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Добавление/изменение оценки
  const handleRateEvent = async (rating: number) => {
    if (!user) {
      console.log('❌ Нет пользователя для оценки');
      return;
    }

    console.log('⭐ Оцениваем событие:', rating, 'от пользователя:', user.username);
    setIsSubmittingRating(true);
    try {
      const scores = getScores();
      console.log('📊 Текущие оценки:', scores);
      
      // Ищем существующую оценку пользователя
      const existingScoreIndex = scores.findIndex(score => {
        return score.username === user.username || score[user.username] !== undefined;
      });
      
      let updatedScores;
      if (existingScoreIndex !== -1) {
        // Обновляем существующую оценку пользователя
        console.log('🔄 Обновляем существующую оценку пользователя');
        updatedScores = [...scores];
        updatedScores[existingScoreIndex] = { [user.username]: rating };
      } else {
        // Добавляем новую оценку
        console.log('➕ Добавляем новую оценку пользователя');
        updatedScores = [...scores, { [user.username]: rating }];
      }

      console.log('📊 Обновленные оценки:', updatedScores);

      await updateEvent({ score: updatedScores });
      setUserRating(rating);
      console.log('✅ Оценка успешно сохранена');
    } catch (error) {
      console.error('💥 Ошибка оценки события:', error);
      alert('Не удалось оценить событие');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Присоединение к событию / покинуть событие с использованием PATCH API
  const handleToggleParticipation = async () => {
    if (!user) {
      console.log('❌ Нет пользователя для участия');
      return;
    }

    setIsJoiningEvent(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      // Определяем действие: true = присоединиться, false = покинуть
      const shouldJoin = !isParticipant;
      const actionText = shouldJoin ? 'присоединения к' : 'выхода из';
      
      console.log(`🎯 Начинаем процесс ${actionText} события для пользователя:`, user.username);

      // Сначала получаем ID пользователя по username
      console.log('🔍 Получаем ID пользователя...');
      const userResponse = await fetch(
        `http://localhost:8090/api/users/get-by-username/${user.username}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );

      if (!userResponse.ok) {
        throw new Error(`Не удалось получить данные пользователя: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      const userId = userData.id;
      
      console.log('✅ Получен ID пользователя:', userId);
      console.log(`🎯 Запрос ${actionText} события:`, { 
        eventId: event.id, 
        userId: userId,
        username: user.username,
        shouldJoin 
      });

      // Теперь отправляем PATCH запрос с правильным userId
      const response = await fetch(
        `http://localhost:8090/api/users/add-or-delete-event/${event.id}/${userId}/${shouldJoin}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );

      const responseText = await response.text();
      console.log(`📥 Ответ сервера (${actionText} события):`, response.status, responseText);

      if (!response.ok) {
        console.error(`❌ Ошибка ${actionText} события:`, response.status, responseText);
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      // Обновляем локальное состояние оптимистично
      let updatedUsersIds;
      if (shouldJoin) {
        // Присоединяемся к событию
        updatedUsersIds = event.usersIds.includes(user.username) 
          ? event.usersIds 
          : [...event.usersIds, user.username];
        console.log('✅ Успешно присоединились к событию');
      } else {
        // Покидаем событие
        updatedUsersIds = event.usersIds.filter(id => id !== user.username);
        console.log('✅ Успешно покинули событие');
      }

      // Обновляем событие в UI
      const updatedEvent = {
        ...event,
        usersIds: updatedUsersIds
      };
      
      onEventUpdate(updatedEvent);
      console.log('🔄 UI обновлен, новый список участников:', updatedUsersIds);

    } catch (error) {
      console.error('💥 Ошибка изменения участия:', error);
      alert(`Не удалось ${!isParticipant ? 'присоединиться к' : 'покинуть'} событие: ${error.message}`);
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
            color: i <= userRating ? 'gold' : 'var(--light-gray)',
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
              e.currentTarget.style.color = i <= userRating ? 'gold' : 'var(--light-gray)';
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

  const averageScore = getAverageScore();
  const scoresCount = getScores().length;

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
            Средняя: {averageScore > 0 ? averageScore.toFixed(1) : '0.0'} ({scoresCount} оценок)
          </span>
        </div>
        {userRating > 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--primary-pink)', marginTop: '5px' }}>
            Ваша оценка: {userRating} ★
          </p>
        )}
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