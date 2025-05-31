// hooks/useCommunityAPI.ts

import { useState, useCallback } from 'react';
import { CommunityCreateData, CommunityCreateResponse } from '../types/community';

interface UseCommunityAPIReturn {
  loading: boolean;
  error: string | null;
  createCommunity: (communityData: CommunityCreateData) => Promise<CommunityCreateResponse | null>;
  uploadCommunityImage: (file: File) => Promise<string | null>;
  clearError: () => void;
}

const API_BASE_URL = 'http://localhost:8090/api';

export const useCommunityAPI = (): UseCommunityAPIReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Создание сообщества
  const createCommunity = useCallback(async (communityData: CommunityCreateData): Promise<CommunityCreateResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('🏘️ Создаем сообщество:', communityData);

      const response = await fetch(`${API_BASE_URL}/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communityData),
      });

      console.log(`📡 Используем endpoint: /community, статус: ${response.status}`);

      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorText = await response.text();
          console.error('❌ Ошибка сервера:', errorText);
          errorDetails = errorText;
        } catch {}

        if (response.status === 400) {
          throw new Error(`Некорректные данные: ${errorDetails || 'проверьте заполнение полей'}`);
        }
        if (response.status === 401) {
          throw new Error('Необходима авторизация');
        }
        if (response.status === 403) {
          throw new Error('У вас нет прав для создания сообщества');
        }
        if (response.status === 500) {
          throw new Error('Ошибка сервера');
        }
        
        throw new Error(`Ошибка создания сообщества: ${response.status}`);
      }

      const createdCommunity: CommunityCreateResponse = await response.json();
      console.log('✅ Сообщество создано успешно:', createdCommunity);
      return createdCommunity;
    } catch (err) {
      console.error('❌ Ошибка создания сообщества:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания сообщества';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка изображения для сообщества
  const uploadCommunityImage = useCallback(async (file: File): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('📸 Загружаем изображение сообщества:', file.name, file.size);

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

      console.log('✅ Изображение загружено');
      return null;
    } catch (err) {
      console.error('❌ Ошибка загрузки изображения:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки изображения';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createCommunity,
    uploadCommunityImage,
    clearError,
  };
};