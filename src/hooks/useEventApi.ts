// hooks/useEventAPI.ts

import { useState, useCallback } from 'react';
import { BackendEventData, EventUpdateData } from '../types/event';

interface UseEventAPIReturn {
  loading: boolean;
  error: string | null;
  loadEvent: (id: string) => Promise<BackendEventData | null>;
  updateEvent: (eventData: EventUpdateData) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  uploadMedia: (file: File) => Promise<string | null>;
  deleteMedia: (fileName: string) => Promise<boolean>;
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

      const response = await fetch(`${API_BASE_URL}/events/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Событие не найдено');
        }
        if (response.status === 500) {
          throw new Error('Ошибка сервера');
        }
        throw new Error(`Ошибка загрузки события: ${response.status} ${response.statusText}`);
      }

      // Проверяем, что ответ действительно JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Server returned non-JSON response:', textResponse);
        throw new Error('Сервер вернул некорректный ответ');
      }

      const eventData: BackendEventData = await response.json();
      return eventData;
    } catch (err) {
      if (err instanceof SyntaxError) {
        // Ошибка парсинга JSON
        console.error('JSON parsing error:', err);
        setError('Ошибка обработки ответа сервера');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке события';
        setError(errorMessage);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление события
  const updateEvent = useCallback(async (eventData: EventUpdateData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      console.log('Отправляем PUT запрос с данными:', eventData);

      // Пробуем сначала PUT метод
      let response = await fetch(`${API_BASE_URL}/events/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      // Если PUT не работает, пробуем PATCH
      if (response.status === 405) {
        console.log('PUT не поддерживается, пробуем PATCH...');
        response = await fetch(`${API_BASE_URL}/events/update`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      }

      // Если и PATCH не работает, пробуем другой endpoint с PUT
      if (response.status === 405) {
        console.log('PATCH не поддерживается, пробуем другой endpoint...');
        response = await fetch(`${API_BASE_URL}/events/${eventData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        // Получаем детали ошибки
        let errorDetails = '';
        try {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          errorDetails = errorText;
        } catch {}

        if (response.status === 400) {
          throw new Error(`Некорректные данные: ${errorDetails || 'проверьте правильность заполнения полей'}`);
        }
        if (response.status === 403) {
          throw new Error('У вас нет прав для редактирования этого события');
        }
        if (response.status === 404) {
          throw new Error('Событие не найдено');
        }
        if (response.status === 405) {
          throw new Error('Метод обновления не поддерживается сервером');
        }
        if (response.status === 500) {
          throw new Error('Ошибка сервера');
        }
        
        throw new Error(`Ошибка обновления события: ${response.status} ${response.statusText}`);
      }

      console.log('Событие успешно обновлено');
      return true;
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error('JSON parsing error in updateEvent:', err);
        setError('Ошибка обработки ответа сервера при обновлении');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при обновлении события';
        setError(errorMessage);
        console.error('Update error:', err);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление события
  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('У вас нет прав для удаления этого события');
        }
        if (response.status === 404) {
          throw new Error('Событие не найдено');
        }
        throw new Error('Ошибка удаления события');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при удалении события';
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

      // Проверяем тип файла
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        throw new Error('Поддерживаются только изображения и видео');
      }

      // Проверяем размер файла (максимум 50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('Размер файла не должен превышать 50MB');
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
        
        try {
          const errorText = await response.text();
          console.error('Upload error response:', errorText);
        } catch {}
        
        throw new Error(`Ошибка загрузки файла: ${response.status} ${response.statusText}`);
      }

      // Получаем ответ как текст
      const responseText = await response.text();
      console.log('Upload response text:', responseText);

      // Проверяем, является ли ответ JSON
      let responseData: any;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed JSON response:', responseData);
        
        // Возвращаем полный URL из JSON
        if (responseData.url) {
          return responseData.url;
        } else if (responseData.fileName) {
          return `${API_BASE_URL}/media/${responseData.fileName}`;
        } else {
          throw new Error('JSON ответ не содержит url или fileName');
        }
      } catch (parseError) {
        // Если ответ не JSON, считаем что это URL
        console.log('Response is not JSON, treating as URL:', responseText);
        
        // Проверяем, что строка похожа на URL
        if (responseText.startsWith('http://') || responseText.startsWith('https://')) {
          return responseText.trim();
        } else {
          // Предполагаем, что это имя файла
          const fileName = responseText.trim();
          if (fileName) {
            return `${API_BASE_URL}/media/${fileName}`;
          } else {
            throw new Error('Пустой ответ от сервера');
          }
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке файла';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление медиафайла
  const deleteMedia = useCallback(async (fileName: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/media/${fileName}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 404) {
        throw new Error('Ошибка удаления файла');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при удалении файла';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    loadEvent,
    updateEvent,
    deleteEvent,
    uploadMedia,
    deleteMedia,
    clearError,
  };
};