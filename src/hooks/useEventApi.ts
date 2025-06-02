// hooks/useEventAPI.ts

import { useState, useCallback } from 'react';
import { BackendEventData, EventUpdateData } from '../types/event';

interface UseEventAPIReturn {
  loading: boolean;
  error: string | null;
  loadEvent: (id: string) => Promise<BackendEventData | null>;
  updateEvent: (id: string, eventData: EventUpdateData) => Promise<boolean>;
  uploadMedia: (file: File) => Promise<string | null>;
  clearError: () => void;
}

const API_BASE_URL = 'http://localhost:8090/api';

export const useEventAPI = (): UseEventAPIReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Загрузка события по ID
  const loadEvent = useCallback(async (id: string): Promise<BackendEventData | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Загружаем событие ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/events/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Событие не найдено');
        }
        if (response.status === 500) {
          throw new Error('Ошибка сервера');
        }
        throw new Error(`Ошибка загрузки события: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Сервер вернул не JSON:', textResponse);
        throw new Error('Сервер вернул некорректный ответ');
      }

      const eventData: BackendEventData = await response.json();
      console.log(' Событие загружено:', eventData);
      return eventData;
    } catch (err) {
      console.error('Ошибка загрузки события:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки события';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление события - ИСПРАВЛЕНО: ID в теле запроса
  const updateEvent = useCallback(async (id: string, eventData: EventUpdateData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📤 Отправляем обновление события ID: ${id}`, eventData);

      // Формируем данные с ID в теле запроса (как ожидает ваш сервер)
      const requestData = {
        id: id,
        ...eventData
      };

      console.log('📤 Полные данные запроса:', requestData);

      const response = await fetch(`${API_BASE_URL}/events/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorText = await response.text();
          console.error('Ошибка сервера:', errorText);
          errorDetails = errorText;
        } catch {}

        if (response.status === 400) {
          throw new Error(`Некорректные данные: ${errorDetails || 'проверьте заполнение полей'}`);
        }
        if (response.status === 403) {
          throw new Error('У вас нет прав для редактирования этого события');
        }
        if (response.status === 404) {
          throw new Error('Событие не найдено');
        }
        if (response.status === 500) {
          throw new Error('Ошибка сервера');
        }
        
        throw new Error(`Ошибка обновления: ${response.status}`);
      }

      console.log(' Событие обновлено успешно');
      return true;
    } catch (err) {
      console.error('Ошибка обновления события:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления события';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка медиафайла
  const uploadMedia = useCallback(async (file: File): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('📸 Загружаем файл:', file.name, file.size);

      // Проверки
      if (!file.type.startsWith('image/')) {
        throw new Error('Поддерживаются только изображения');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Размер файла не должен превышать 10MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('Файл слишком большой');
        }
        if (response.status === 415) {
          throw new Error('Неподдерживаемый тип файла');
        }
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('📸 Ответ сервера:', responseText);

      // Пробуем парсить как JSON
      try {
        const responseData = JSON.parse(responseText);
        if (responseData.url) {
          return responseData.url;
        } else if (responseData.fileName) {
          return `${API_BASE_URL}/media/${responseData.fileName}`;
        }
      } catch {
        // Если не JSON, считаем что это URL или имя файла
        if (responseText.startsWith('http')) {
          return responseText.trim();
        } else {
          return `${API_BASE_URL}/media/${responseText.trim()}`;
        }
      }

      console.log(' Файл загружен');
      return null;
    } catch (err) {
      console.error('Ошибка загрузки файла:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки файла';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    loadEvent,
    updateEvent,
    uploadMedia,
    clearError,
  };
};