// hooks/useCommunityDetail.ts

import { useState, useCallback } from 'react';
import { Community, CommunityDetails, CommunityUpdateData, toCommunityDetails, Member } from '../types/community';

interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string; // Исправляем поле для фотографии
  city?: string;
  registrationDate?: string;
  metadata?: {
    lastProfileUpdate?: string;
  };
}

interface UseCommunityDetailReturn {
  loading: boolean;
  error: string | null;
  community: CommunityDetails | null;
  members: Member[];
  loadCommunity: (id: string) => Promise<void>;
  joinCommunity: (id: string) => Promise<boolean>;
  leaveCommunity: (id: string) => Promise<boolean>;
  updateCommunity: (updateData: CommunityUpdateData) => Promise<boolean>;
  clearError: () => void;
}

const API_BASE_URL = 'http://localhost:8090/api';

export const useCommunityDetail = (currentUserId?: string): UseCommunityDetailReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Получение пользователя по username - используем правильный эндпоинт
  const getUserByUsername = useCallback(async (username: string): Promise<User | null> => {
    try {
      console.log(`👤 Получаем пользователя: ${username}`);

      const response = await fetch(`${API_BASE_URL}/users/get-by-username/${username}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Пользователь ${username} не найден`);
          return null;
        }
        throw new Error(`Ошибка получения пользователя: ${response.status}`);
      }

      const user: User = await response.json();
      console.log(' Пользователь получен:', user);
      
      return user;
    } catch (err) {
      console.error('Ошибка получения пользователя:', err);
      return null;
    }
  }, []);

  // Обновление сообщества в профиле пользователя
  const updateUserCommunity = useCallback(async (
    communityId: string, 
    userId: string, 
    action: 'insert' | 'delete'
  ): Promise<boolean> => {
    try {
      console.log(`🔄 Обновляем сообщества пользователя ${userId}: ${action} сообщество ${communityId}`);

      // Преобразуем action в булевое значение
      const flagValue = action === 'insert' ? 'true' : 'false';

      const response = await fetch(
        `${API_BASE_URL}/users/add-or-delete-community/${communityId}/${userId}/${flagValue}`, 
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`📡 Статус ответа PATCH: ${response.status}`);
      console.log(`🔗 URL запроса: ${API_BASE_URL}/users/add-or-delete-community/${communityId}/${userId}/${flagValue}`);

      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorText = await response.text();
          console.error('Ответ сервера PATCH:', errorText);
          errorDetails = errorText;
        } catch (e) {
          console.error('Не удалось прочитать ответ сервера');
        }

        console.warn(` PATCH запрос неудачен (${response.status}), но продолжаем`);
        return false; // Не критичная ошибка
      }

      console.log(' PATCH запрос выполнен успешно');
      return true;
    } catch (err) {
      console.error('Ошибка PATCH запроса:', err);
      return false; // Не критичная ошибка
    }
  }, []);

  // Загрузка участников с фотографиями
  const loadMembers = useCallback(async (usernames: string[]): Promise<void> => {
    if (!usernames || usernames.length === 0) {
      setMembers([]);
      return;
    }

    try {
      console.log('👥 Загружаем участников:', usernames);

      // Загружаем первых 10 участников (чтобы не перегружать)
      const membersToLoad = usernames.slice(0, 10);
      
      const memberPromises = membersToLoad.map(async (username) => {
        try {
          const user = await getUserByUsername(username);
          if (user) {
            return {
              id: user.id,
              name: user.firstName && user.lastName ? 
                `${user.firstName} ${user.lastName}` : 
                user.username,
              avatarUrl: user.imageUrl || '/api/placeholder/50/50' // Используем правильное поле
            };
          } else {
            // Fallback для пользователей, которых не удалось загрузить
            return {
              id: username,
              name: username,
              avatarUrl: '/api/placeholder/50/50'
            };
          }
        } catch (error) {
          console.warn(` Не удалось загрузить пользователя ${username}:`, error);
          // Возвращаем fallback данные
          return {
            id: username,
            name: username,
            avatarUrl: '/api/placeholder/50/50'
          };
        }
      });

      const loadedMembers = await Promise.all(memberPromises);
      console.log(' Участники загружены:', loadedMembers);
      setMembers(loadedMembers);
      
    } catch (err) {
      console.error('Ошибка загрузки участников:', err);
      
      // В случае ошибки показываем участников без фотографий
      const fallbackMembers = usernames.slice(0, 10).map((username) => ({
        id: username,
        name: username,
        avatarUrl: '/api/placeholder/50/50'
      }));
      setMembers(fallbackMembers);
    }
  }, [getUserByUsername]);

  // Загрузка сообщества по ID
  const loadCommunity = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Загружаем сообщество ID: ${id}`);
      
      const response = await fetch(`${API_BASE_URL}/community/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Сообщество не найдено');
        }
        if (response.status === 500) {
          throw new Error('Ошибка сервера');
        }
        throw new Error(`Ошибка загрузки сообщества: ${response.status}`);
      }

      const communityData: Community = await response.json();
      console.log(' Сообщество загружено:', communityData);
      
      // Преобразуем в формат для отображения
      const communityDetails = toCommunityDetails(communityData, currentUserId);
      setCommunity(communityDetails);
      
      // Загружаем участников
      await loadMembers(communityData.users);
      
    } catch (err) {
      console.error('Ошибка загрузки сообщества:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки сообщества';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, loadMembers]);

  // Универсальная функция обновления сообщества
  const updateCommunity = useCallback(async (updateData: CommunityUpdateData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Обновляем сообщество:', updateData);

      const response = await fetch(`${API_BASE_URL}/community/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log(`📡 Статус ответа PUT: ${response.status}`);

      if (!response.ok) {
        // Получаем детали ошибки
        let errorDetails = '';
        try {
          const errorText = await response.text();
          console.error('Ответ сервера:', errorText);
          errorDetails = errorText;
        } catch (e) {
          console.error('Не удалось прочитать ответ сервера');
        }

        if (response.status === 404) {
          throw new Error('Сообщество не найдено');
        }
        if (response.status === 400) {
          throw new Error(`Некорректные данные: ${errorDetails || 'проверьте отправляемые поля'}`);
        }
        if (response.status === 403) {
          throw new Error('У вас нет прав для изменения этого сообщества');
        }
        if (response.status === 401) {
          throw new Error('Необходима авторизация');
        }
        throw new Error(`Ошибка обновления: ${response.status} - ${errorDetails}`);
      }

      const updatedCommunity: Community = await response.json();
      console.log(' Сообщество обновлено:', updatedCommunity);
      
      // Обновляем локальное состояние
      const communityDetails = toCommunityDetails(updatedCommunity, currentUserId);
      setCommunity(communityDetails);
      
      // Обновляем список участников
      await loadMembers(updatedCommunity.users);
      
      return true;
    } catch (err) {
      console.error('Ошибка обновления сообщества:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления сообщества';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUserId, loadMembers]);

  // Вступление в сообщество
  const joinCommunity = useCallback(async (id: string): Promise<boolean> => {
    if (!community || !currentUserId) {
      console.warn('Нет данных сообщества или пользователя для вступления');
      return false;
    }

    console.log(`🤝 Вступаем в сообщество. Текущие пользователи:`, community.users);
    
    // Проверяем, не является ли пользователь уже участником
    if (community.users.includes(currentUserId)) {
      console.warn('Пользователь уже является участником сообщества');
      setError('Вы уже являетесь участником этого сообщества');
      return false;
    }

    try {
      // 1. Получаем ID пользователя по username
      const user = await getUserByUsername(currentUserId);
      if (!user) {
        throw new Error('Не удалось получить данные пользователя');
      }

      // 2. Обновляем сообщество (добавляем пользователя)
      const updatedUsers = [...community.users, currentUserId];
      const updateData: CommunityUpdateData = {
        id: community.id,
        name: community.name,
        description: community.description,
        imageUrls: community.imageUrls,
        numberMembers: community.numberMembers + 1,
        type: community.type,
        createdAt: community.createdAt,
        rating: community.rating,
        reviewsCount: community.reviewsCount,
        content: community.content,
        city: community.city,
        eventsCount: community.eventsCount,
        postsCount: community.postsCount,
        users: updatedUsers,
        author: community.author,
        listEvents: community.listEvents,
      };

      console.log('📤 Отправляем данные для вступления:', updateData);

      const communityUpdateSuccess = await updateCommunity(updateData);
      if (!communityUpdateSuccess) {
        throw new Error('Не удалось обновить сообщество');
      }

      // 3. Обновляем профиль пользователя (добавляем сообщество)
      console.log('👤 Обновляем профиль пользователя...');
      const userUpdateSuccess = await updateUserCommunity(community.id, user.id, 'insert');
      
      if (!userUpdateSuccess) {
        console.warn(' Сообщество обновлено, но не удалось обновить профиль пользователя');
        // Не считаем это критической ошибкой
      }

      console.log(' Успешно вступили в сообщество');
      return true;
    } catch (err) {
      console.error('Ошибка при вступлении:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка вступления в сообщество';
      setError(errorMessage);
      return false;
    }
  }, [community, currentUserId, updateCommunity, getUserByUsername, updateUserCommunity]);

  // Выход из сообщества
  const leaveCommunity = useCallback(async (id: string): Promise<boolean> => {
    if (!community || !currentUserId) {
      console.warn('Нет данных сообщества или пользователя для выхода');
      return false;
    }

    console.log(`👋 Покидаем сообщество. Текущие пользователи:`, community.users);

    // Проверяем, является ли пользователь участником
    if (!community.users.includes(currentUserId)) {
      console.warn('Пользователь не является участником сообщества');
      setError('Вы не являетесь участником этого сообщества');
      return false;
    }

    try {
      // 1. Получаем ID пользователя по username
      const user = await getUserByUsername(currentUserId);
      if (!user) {
        throw new Error('Не удалось получить данные пользователя');
      }

      // 2. Обновляем сообщество (убираем пользователя)
      const updatedUsers = community.users.filter(userId => userId !== currentUserId);
      const updateData: CommunityUpdateData = {
        id: community.id,
        name: community.name,
        description: community.description,
        imageUrls: community.imageUrls,
        numberMembers: Math.max(0, community.numberMembers - 1),
        type: community.type,
        createdAt: community.createdAt,
        rating: community.rating,
        reviewsCount: community.reviewsCount,
        content: community.content,
        city: community.city,
        eventsCount: community.eventsCount,
        postsCount: community.postsCount,
        users: updatedUsers,
        author: community.author,
        listEvents: community.listEvents,
      };

      console.log('📤 Отправляем данные для выхода:', updateData);

      const communityUpdateSuccess = await updateCommunity(updateData);
      if (!communityUpdateSuccess) {
        throw new Error('Не удалось обновить сообщество');
      }

      // 3. Обновляем профиль пользователя (убираем сообщество)
      console.log('👤 Обновляем профиль пользователя...');
      const userUpdateSuccess = await updateUserCommunity(community.id, user.id, 'delete');
      
      if (!userUpdateSuccess) {
        console.warn(' Сообщество обновлено, но не удалось обновить профиль пользователя');
        // Не считаем это критической ошибкой
      }

      console.log(' Успешно покинули сообщество');
      return true;
    } catch (err) {
      console.error('Ошибка при выходе:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка выхода из сообщества';
      setError(errorMessage);
      return false;
    }
  }, [community, currentUserId, updateCommunity, getUserByUsername, updateUserCommunity]);

  return {
    loading,
    error,
    community,
    members,
    loadCommunity,
    joinCommunity,
    leaveCommunity,
    updateCommunity,
    clearError,
  };
};