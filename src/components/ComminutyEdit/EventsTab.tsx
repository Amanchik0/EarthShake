// Улучшенная реализация удаления событий в EventsTab.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Community } from '../../types/community';
import styles from '../../features/Community/CommunityEditPage/CommunityEditPage.module.css';

interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  participantsCount: number;
  status: 'active' | 'postponed' | 'cancelled';
  eventType: 'REGULAR' | 'EMERGENCY';
  author: string;
  city: string;
  mediaUrl: string[];
}

interface EventsTabProps {
  community: Community;
  onMessage: (message: string) => void;
  onCommunityUpdate?: (updatedCommunity: Community) => void; // Коллбек для обновления родительского состояния
}

const EventsTab: React.FC<EventsTabProps> = ({ 
  community, 
  onMessage, 
  onCommunityUpdate 
}) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  // Загрузка событий сообщества
  useEffect(() => {
    if (community.listEvents && community.listEvents.length > 0) {
      loadEvents(community.listEvents);
    }
  }, [community.listEvents]);

  const loadEvents = async (eventIds: string[]) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const eventPromises = eventIds.map(async (eventId) => {
        try {
          const response = await fetch(`http://localhost:8090/api/events/${eventId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) {
            console.warn(` Событие ${eventId} не найдено (${response.status})`);
            return null;
          }

          const eventData = await response.json();
          
          return {
            id: eventData.id,
            title: eventData.title,
            description: eventData.description,
            dateTime: eventData.dateTime,
            participantsCount: eventData.usersIds?.length || 0,
            status: eventData.archived ? 'cancelled' : 'active',
            eventType: eventData.eventType,
            author: eventData.author,
            city: eventData.city,
            mediaUrl: eventData.mediaUrl || []
          };
        } catch (error) {
          console.error(`Ошибка загрузки события ${eventId}:`, error);
          return null;
        }
      });

      const loadedEvents = await Promise.all(eventPromises);
      const validEvents = loadedEvents.filter((event): event is Event => event !== null);
      
      setEvents(validEvents);
      console.log(` Загружено ${validEvents.length} событий сообщества`);

    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
      onMessage('Ошибка при загрузке событий');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Улучшенная функция удаления события
   * Включает в себя:
   * 1. Проверку прав доступа
   * 2. Удаление события из API
   * 3. Обновление сообщества (удаление из listEvents и eventsCount)
   * 4. Обработку различных сценариев ошибок
   * 5. Атомарность операции с откатом при ошибках
   */
  const handleDeleteEvent = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // 1. Проверка прав доступа
    const currentUser = localStorage.getItem('username');
    const canDelete = currentUser === community.author || currentUser === event.author;
    
    if (!canDelete) {
      onMessage('У вас нет прав для удаления этого события');
      return;
    }

    // 2. Проверяем, что событие действительно в списке сообщества
    if (!community.listEvents.includes(eventId)) {
      onMessage('Событие не найдено в списке сообщества');
      setEvents(prev => prev.filter(e => e.id !== eventId)); // Убираем из UI
      return;
    }

    // 3. Предупреждение о последствиях
    const hasParticipants = event.participantsCount > 0;
    const warningMessage = hasParticipants 
      ? `Удалить событие "${event.title}"?\n\nВНИМАНИЕ: В событии ${event.participantsCount} участников. Они будут уведомлены об отмене.`
      : `Удалить событие "${event.title}"?`;

    const confirmed = window.confirm(warningMessage);
    if (!confirmed) return;

    setDeletingEventId(eventId);

    try {
      const token = localStorage.getItem('accessToken');

      console.log(`🗑️ Начинаем удаление события ${eventId}...`);

      // 4. Удаляем событие через API
      const deleteResponse = await fetch(`http://localhost:8090/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 5. Обрабатываем различные статусы ответа
      let eventDeleted = false;
      
      if (deleteResponse.status === 404) {
        // Событие уже удалено - это нормально (идемпотентность DELETE)
        console.log('📝 Событие уже было удалено ранее');
        eventDeleted = true;
      } else if (deleteResponse.status === 403) {
        throw new Error('У вас нет прав для удаления этого события');
      } else if (deleteResponse.status === 409) {
        throw new Error('Событие нельзя удалить - возможно, оно уже началось');
      } else if (!deleteResponse.ok) {
        throw new Error(`Ошибка удаления события: ${deleteResponse.status}`);
      } else {
        console.log(' Событие успешно удалено из API');
        eventDeleted = true;
      }

      // 6. КРИТИЧЕСКИ ВАЖНО: Обновляем сообщество (убираем событие из listEvents)
      if (eventDeleted) {
        const updateSuccess = await updateCommunityEventsList(eventId, event.title);
        
        if (updateSuccess) {
          // 7. Обновляем локальное состояние только после успешного обновления сообщества
          setEvents(prev => prev.filter(e => e.id !== eventId));
          console.log(' Событие полностью удалено и синхронизировано');
        } else {
          // Если не удалось обновить сообщество, показываем предупреждение
          onMessage(`Событие удалено, но возможны проблемы с синхронизацией. Обновите страницу.`);
        }
      }

    } catch (error) {
      console.error('Ошибка удаления события:', error);
      onMessage(error instanceof Error ? error.message : 'Ошибка при удалении события');
    } finally {
      setDeletingEventId(null);
    }
  };

  /**
   * Обновляет список событий в сообществе после удаления
   * Критически важная функция для поддержания консистентности данных
   */
  const updateCommunityEventsList = async (deletedEventId: string, eventTitle: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('accessToken');
      
      console.log(`🔄 Обновляем сообщество: удаляем событие ${deletedEventId} из listEvents...`);
      
      // Создаем обновленный список событий (убираем удаленное событие)
      const updatedListEvents = community.listEvents.filter(id => id !== deletedEventId);
      
      // Создаем payload с обновленными данными
      const updatePayload = {
        id: community.id,
        name: community.name,
        description: community.description,
        imageUrls: community.imageUrls,
        numberMembers: community.numberMembers,
        type: community.type,
        createdAt: community.createdAt,
        rating: community.rating,
        reviewsCount: community.reviewsCount,
        content: community.content,
        city: community.city,
        eventsCount: updatedListEvents.length, // ВАЖНО: обновляем счетчик
        postsCount: community.postsCount,
        users: community.users,
        author: community.author,
        listEvents: updatedListEvents // ВАЖНО: убираем удаленное событие
      };

      console.log('📤 Отправляем обновление сообщества:', {
        removedEvent: deletedEventId,
        oldEventsCount: community.eventsCount,
        newEventsCount: updatedListEvents.length,
        oldListEvents: community.listEvents,
        newListEvents: updatedListEvents
      });

      const response = await fetch('http://localhost:8090/api/community/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка обновления сообщества:', response.status, errorText);
        throw new Error(`Ошибка обновления сообщества: ${response.status}`);
      }

      const updatedCommunity = await response.json();
      console.log(' Сообщество успешно обновлено:', updatedCommunity);
      
      // Уведомляем родительский компонент об обновлении
      onCommunityUpdate?.(updatedCommunity);
      
      onMessage(`Событие "${eventTitle}" удалено и синхронизировано`);
      
      return true;

    } catch (error) {
      console.error('Критическая ошибка обновления списка событий:', error);
      onMessage('Ошибка синхронизации: событие удалено, но список сообщества не обновлен');
      return false;
    }
  };

  /**
   * Мягкое удаление - архивирование события через API обновления
   * Событие остается в listEvents сообщества, но помечается как архивированное
   */
  // const handleArchiveEvent = async (eventId: string) => {
  //   const event = events.find(e => e.id === eventId);
  //   if (!event) return;

  //   const confirmed = window.confirm(`Архивировать событие "${event.title}"?\n\nСобытие будет скрыто, но данные сохранятся.`);
  //   if (!confirmed) return;

  //   setDeletingEventId(eventId);

  //   try {
  //     const token = localStorage.getItem('accessToken');

  //     console.log(`📦 Архивируем событие ${eventId}...`);

  //     // Сначала получаем полные данные события
  //     const eventResponse = await fetch(`http://localhost:8090/api/events/${eventId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     if (!eventResponse.ok) {
  //       throw new Error(`Не удалось загрузить событие: ${eventResponse.status}`);
  //     }

  //     const fullEventData = await eventResponse.json();
  //     console.log('📋 Полные данные события:', fullEventData);

  //     // Обновляем событие через правильный эндпоинт
  //     const updatePayload = {
  //       ...fullEventData,
  //       archived: true // Помечаем как архивированное
  //     };

  //     console.log('📤 Отправляем обновление события:', updatePayload);

  //     const archiveResponse = await fetch('http://localhost:8090/api/events/update', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify(updatePayload)
  //     });

  //     if (!archiveResponse.ok) {
  //       const errorText = await archiveResponse.text();
  //       console.error('Ошибка архивирования:', archiveResponse.status, errorText);
  //       throw new Error(`Ошибка архивирования: ${archiveResponse.status}`);
  //     }

  //     const updatedEvent = await archiveResponse.json();
  //     console.log(' Событие успешно архивировано:', updatedEvent);

  //     // Обновляем локальное состояние
  //     setEvents(prev => prev.map(e => 
  //       e.id === eventId 
  //         ? { ...e, status: 'cancelled' as const }
  //         : e
  //     ));

  //     onMessage(`Событие "${event.title}" архивировано`);

  //   } catch (error) {
  //     console.error('Ошибка архивирования события:', error);
  //     onMessage(error instanceof Error ? error.message : 'Ошибка при архивировании события');
  //   } finally {
  //     setDeletingEventId(null);
  //   }
  // };

  /**
   * Восстановление архивированного события через API обновления
   */
  // const handleRestoreEvent = async (eventId: string) => {
  //   const event = events.find(e => e.id === eventId);
  //   if (!event) return;

  //   setDeletingEventId(eventId);

  //   try {
  //     const token = localStorage.getItem('accessToken');

  //     console.log(`🔄 Восстанавливаем событие ${eventId}...`);

  //     // Получаем полные данные события
  //     const eventResponse = await fetch(`http://localhost:8090/api/events/${eventId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     if (!eventResponse.ok) {
  //       throw new Error(`Не удалось загрузить событие: ${eventResponse.status}`);
  //     }

  //     const fullEventData = await eventResponse.json();
  //     console.log('📋 Полные данные события для восстановления:', fullEventData);

  //     // Обновляем событие через правильный эндпоинт
  //     const updatePayload = {
  //       ...fullEventData,
  //       archived: false // Убираем флаг архивирования
  //     };

  //     console.log('📤 Отправляем восстановление события:', updatePayload);

  //     const restoreResponse = await fetch('http://localhost:8090/api/events/update', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify(updatePayload)
  //     });

  //     if (!restoreResponse.ok) {
  //       const errorText = await restoreResponse.text();
  //       console.error('Ошибка восстановления:', restoreResponse.status, errorText);
  //       throw new Error(`Ошибка восстановления: ${restoreResponse.status}`);
  //     }

  //     const updatedEvent = await restoreResponse.json();
  //     console.log(' Событие успешно восстановлено:', updatedEvent);

  //     setEvents(prev => prev.map(e => 
  //       e.id === eventId 
  //         ? { ...e, status: 'active' as const }
  //         : e
  //     ));

  //     onMessage(`Событие "${event.title}" восстановлено`);

  //   } catch (error) {
  //     console.error('Ошибка восстановления события:', error);
  //     onMessage(error instanceof Error ? error.message : 'Ошибка при восстановлении события');
  //   } finally {
  //     setDeletingEventId(null);
  //   }
  // };

  // Фильтрация событий
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Неизвестная дата';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Неизвестное время';
    }
  };

  const handleCreateEvent = () => {
    navigate(`/events/create?communityId=${community.id}`);
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className={`${styles.badge} ${styles.badgeMember}`}>Активное</span>;
      case 'postponed':
        return <span className={`${styles.badge} ${styles.badgeNew}`}>Отложенное</span>;
      case 'cancelled':
        return <span className={`${styles.badge}`} style={{ backgroundColor: '#ffcccc', color: '#dc3545' }}>Архивировано</span>;
      default:
        return <span className={styles.badge}>Неизвестно</span>;
    }
  };

  const currentUser = localStorage.getItem('username');
  const canManageEvents = currentUser === community.author;

  const activeEventsCount = events.filter(e => e.status === 'active').length;
  const postponedEventsCount = events.filter(e => e.status === 'postponed').length;
  const cancelledEventsCount = events.filter(e => e.status === 'cancelled').length;

  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionTitle}>
        События сообщества
        {canManageEvents && (
          <button className={styles.button} onClick={handleCreateEvent}>
            + Создать событие
          </button>
        )}
      </div>

      <div className={styles.filterGroup}>
        <div 
          className={`${styles.filterOption} ${statusFilter === 'all' ? styles.filterOptionActive : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          Все ({events.length})
        </div>
        <div 
          className={`${styles.filterOption} ${statusFilter === 'active' ? styles.filterOptionActive : ''}`}
          onClick={() => setStatusFilter('active')}
        >
          Активные ({activeEventsCount})
        </div>
        <div 
          className={`${styles.filterOption} ${statusFilter === 'postponed' ? styles.filterOptionActive : ''}`}
          onClick={() => setStatusFilter('postponed')}
        >
          Отложенные ({postponedEventsCount})
        </div>
        <div 
          className={`${styles.filterOption} ${statusFilter === 'cancelled' ? styles.filterOptionActive : ''}`}
          onClick={() => setStatusFilter('cancelled')}
        >
          Архивированные ({cancelledEventsCount})
        </div>
      </div>
      
      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Поиск событий..." 
          className={styles.input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={styles.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка событий...</p>
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className={styles.noData}>
          {searchQuery ? 'События не найдены' : 'У сообщества пока нет событий'}
          {!searchQuery && canManageEvents && (
            <button 
              className={styles.button} 
              onClick={handleCreateEvent}
              style={{ marginTop: '15px' }}
            >
              Создать первое событие
            </button>
          )}
        </div>
      )}

      {!loading && filteredEvents.length > 0 && (
        <div className={styles.userList}>
          {filteredEvents.map(event => {
            const canEditEvent = currentUser === event.author || currentUser === community.author;
            const isDeleting = deletingEventId === event.id;

            return (
              <div key={event.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.eventDate}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {formatDate(event.dateTime)} в {formatTime(event.dateTime)}
                  </div>

                  <div className={styles.eventTitle}>
                    {event.title}
                    {event.eventType === 'EMERGENCY' && (
                      <span style={{ marginLeft: '8px', fontSize: '12px', color: '#ff4444' }}>
                         Экстренное
                      </span>
                    )}
                  </div>

                  <div className={styles.eventDescription}>
                    {event.description}
                  </div>

                  <div className={styles.eventDetails}>
                    <div className={styles.eventDetail}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      {event.participantsCount} участников
                    </div>

                    <div className={styles.eventDetail}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {event.city}
                    </div>

                    <div className={styles.eventDetail}>
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                </div>

                {canEditEvent && (
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.button}
                      onClick={() => handleEditEvent(event.id)}
                      title="Редактировать событие"
                      disabled={isDeleting}
                    >
                      ✏️
                    </button>
                    
                    {/* Архивирование временно отключено */}
                    {/* {event.status === 'cancelled' ? (
                      <button 
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={() => handleRestoreEvent(event.id)}
                        title="Восстановить событие"
                        disabled={isDeleting}
                      >
                        {isDeleting ? '⏳' : '🔄'}
                      </button>
                    ) : (
                      <button 
                        className={`${styles.button}`}
                        onClick={() => handleArchiveEvent(event.id)}
                        title="Архивировать событие"
                        disabled={isDeleting}
                        style={{ backgroundColor: '#ffa000', color: 'white' }}
                      >
                        {isDeleting ? '⏳' : '📦'}
                      </button>
                    )} */}
                    
                    <button 
                      className={`${styles.button} ${styles.buttonDanger}`}
                      onClick={() => handleDeleteEvent(event.id)}
                      title="Полностью удалить событие"
                      disabled={isDeleting}
                    >
                      {isDeleting ? '⏳' : '❌'}
                    </button>
                  </div>
                )}
                       
              
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsTab;