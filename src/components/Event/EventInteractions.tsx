import React, { useState } from 'react';
import { BackendEventData } from '../../types/event';
import { useAuth } from '../auth/AuthContext';

interface EventInteractionsProps {
  event: BackendEventData;
  styles: any;
  onEventUpdate: (updatedEvent: BackendEventData) => void;
}

const EventInteractions: React.FC<EventInteractionsProps> = ({ event, styles, onEventUpdate }) => {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Проверяем, участвует ли пользователь в событии
  const isParticipating = user ? event.usersIds.includes(user.username) : false;

  // Функция для вычисления среднего рейтинга из массива
  const calculateAverageRating = (): number => {
    if (!event.score || !Array.isArray(event.score) || event.score.length === 0) {
      return 0;
    }
    const sum = event.score.reduce((acc, score) => acc + score, 0);
    return sum / event.score.length;
  };

  // Функция для отображения звезд рейтинга
  const renderRatingStars = (rating: number, interactive: boolean = false, onStarClick?: (star: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${styles.star} ${interactive ? styles.interactiveStar : ''}`}
          style={{ 
            color: i <= rating ? '#FFD700' : '#E0E0E0',
            cursor: interactive ? 'pointer' : 'default'
          }}
          onClick={() => interactive && onStarClick && onStarClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Обработчик участия/отмены участия в событии
  const handleJoinToggle = async () => {
    if (!user) {
      alert('Необходимо авторизоваться для участия в событии');
      return;
    }

    setIsJoining(true);

    try {
      const token = localStorage.getItem('accessToken');
      const action = isParticipating ? 'leave' : 'join';
      
      const response = await fetch(`http://localhost:8090/api/events/${event.id}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Обновляем список участников локально
        const updatedUsersIds = isParticipating 
          ? event.usersIds.filter(id => id !== user.username)
          : [...event.usersIds, user.username];

        const updatedEvent: BackendEventData = {
          ...event,
          usersIds: updatedUsersIds
        };

        onEventUpdate(updatedEvent);
        console.log(`${action === 'join' ? 'Присоединились' : 'Покинули'} событие`);
      } else {
        const errorText = await response.text();
        console.error(`Ошибка ${action}:`, errorText);
        alert(`Не удалось ${action === 'join' ? 'присоединиться к' : 'покинуть'} событие`);
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert('Ошибка соединения с сервером');
    } finally {
      setIsJoining(false);
    }
  };

  // Обработчик отправки рейтинга
  const handleRatingSubmit = async () => {
    if (!user || selectedRating === 0) {
      return;
    }

    setIsRating(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:8090/api/events/${event.id}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: selectedRating / 5 // Преобразуем из 1-5 в 0-1 для бэкенда
        })
      });

      if (response.ok) {
        // Обновляем рейтинг локально
        const normalizedRating = selectedRating / 5;
        const updatedScores = event.score || [];
        const newScores = [...updatedScores, normalizedRating];

        const updatedEvent: BackendEventData = {
          ...event,
          score: newScores
        };

        onEventUpdate(updatedEvent);
        setShowRatingModal(false);
        setSelectedRating(0);
        console.log('Рейтинг успешно отправлен');
      } else {
        const errorText = await response.text();
        console.error('Ошибка отправки рейтинга:', errorText);
        alert('Не удалось отправить рейтинг');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert('Ошибка соединения с сервером');
    } finally {
      setIsRating(false);
    }
  };

  const averageRating = calculateAverageRating();
  const displayRating = averageRating * 5; // Преобразуем для отображения в шкале 1-5

  return (
    <section className={styles.eventInteractions}>
      <div className={styles.interactionButtons}>
        {/* Кнопка участия */}
        <button
          className={`${styles.interactionBtn} ${isParticipating ? styles.participating : styles.joinBtn}`}
          onClick={handleJoinToggle}
          disabled={isJoining}
        >
          {isJoining ? (
            '⏳ Загрузка...'
          ) : isParticipating ? (
            '✅ Участвую'
          ) : (
            '🎯 Участвовать'
          )}
        </button>

        {/* Кнопка рейтинга */}
        <button
          className={`${styles.interactionBtn} ${styles.rateBtn}`}
          onClick={() => setShowRatingModal(true)}
          disabled={!user}
        >
          ⭐ Оценить
        </button>

        {/* Кнопка поделиться */}
        <button
          className={`${styles.interactionBtn} ${styles.shareBtn}`}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Ссылка скопирована в буфер обмена');
            }
          }}
        >
          📤 Поделиться
        </button>
      </div>

      {/* Информация о рейтинге */}
      <div className={styles.ratingInfo}>
        <div className={styles.currentRating}>
          <span className={styles.ratingLabel}>Рейтинг события:</span>
          <div className={styles.ratingStars}>
            {renderRatingStars(displayRating)}
            <span className={styles.ratingValue}>
              ({displayRating.toFixed(1)} из 5, {(event.score || []).length} оценок)
            </span>
          </div>
        </div>
      </div>

      {/* Информация об участниках */}
      <div className={styles.participantsInfo}>
        <span className={styles.participantsCount}>
          👥 Участников: <strong>{event.usersIds.length}</strong>
        </span>
      </div>

      {/* Модальное окно для оценки */}
      {showRatingModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRatingModal(false)}>
          <div className={styles.ratingModal} onClick={(e) => e.stopPropagation()}>
            <h3>Оцените событие</h3>
            <div className={styles.ratingInput}>
              {renderRatingStars(selectedRating, true, setSelectedRating)}
            </div>
            <div className={styles.modalButtons}>
              <button
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedRating(0);
                }}
              >
                Отмена
              </button>
              <button
                className={`${styles.modalBtn} ${styles.submitBtn}`}
                onClick={handleRatingSubmit}
                disabled={selectedRating === 0 || isRating}
              >
                {isRating ? 'Отправка...' : 'Оценить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventInteractions;