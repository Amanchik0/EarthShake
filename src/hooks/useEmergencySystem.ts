// src/hooks/useEmergencySystem.ts
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { EmergencyResponse, EmergencyEvent, ReferenceInfo } from '../types/emergencyTypes';
import { kazakhstanCities } from '../data/cities';

const EMERGENCY_CHECK_INTERVAL = 15000; // 15 секунд
const EMERGENCY_API_BASE_URL = 'http://localhost:8090/api/events/emergency';

export function useEmergencySystem() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState<EmergencyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Функция для конвертации русского названия города в английское
  const convertCityToEnglish = (russianCityName: string): string => {
    if (!russianCityName) {
      return 'Almaty'; // fallback по умолчанию
    }

    // Поиск города по русскому названию
    const city = kazakhstanCities.find(city => 
      city.name.toLowerCase() === russianCityName.toLowerCase()
    );

    if (city) {
      console.log(`Конвертация города: ${russianCityName} → ${city.nameEn}`);
      return city.nameEn;
    }

    // Если город не найден, пытаемся найти похожий
    const similarCity = kazakhstanCities.find(city => 
      city.name.toLowerCase().includes(russianCityName.toLowerCase()) ||
      russianCityName.toLowerCase().includes(city.name.toLowerCase())
    );

    if (similarCity) {
      console.log(`Найден похожий город: ${russianCityName} → ${similarCity.nameEn}`);
      return similarCity.nameEn;
    }

    // Если ничего не найдено, проверяем не английское ли уже название
    const englishCity = kazakhstanCities.find(city => 
      city.nameEn.toLowerCase() === russianCityName.toLowerCase()
    );

    if (englishCity) {
      console.log(`Город уже на английском: ${russianCityName}`);
      return englishCity.nameEn;
    }

    console.warn(`Город не найден в списке: ${russianCityName}, используем Almaty по умолчанию`);
    return 'Almaty';
  };

  const checkEmergencyStatus = useCallback(async () => {
    // Получаем город пользователя и конвертируем в английский
    const userCityRussian = user?.city || 'Алматы';
    const cityEnglish = convertCityToEnglish(userCityRussian);
    const apiUrl = `${EMERGENCY_API_BASE_URL}/${cityEnglish}`;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Проверка статуса экстренной ситуации для города: ${userCityRussian} (${cityEnglish})`);
      console.log(`API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Добавляем таймаут для запроса
        signal: AbortSignal.timeout(10000), // 10 секунд таймаут
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Получаем текст ответа для проверки
      const responseText = await response.text();
      console.log('Сырой ответ сервера:', responseText);

      let data: EmergencyResponse;
      
      // Если ответ пустой - создаем пустую структуру
      if (!responseText || responseText.trim() === '') {
        console.log('Получен пустой ответ от сервера - ЧС отсутствуют');
        data = {
          event: [],
          referenceInfo: []
        };
      } else {
        // Пытаемся распарсить JSON
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Ошибка парсинга JSON:', parseError);
          throw new Error('Неверный формат ответа сервера');
        }
      }

      // Нормализуем данные - если поля отсутствуют или не массивы, создаем пустые массивы
      const normalizedData: EmergencyResponse = {
        event: Array.isArray(data.event) ? data.event : [],
        referenceInfo: Array.isArray(data.referenceInfo) ? data.referenceInfo : []
      };

      console.log('Обработанные данные о ЧС:', {
        eventsCount: normalizedData.event.length,
        referenceInfoCount: normalizedData.referenceInfo.length,
        rawData: normalizedData
      });
      
      // Проверяем, есть ли активные чрезвычайные ситуации
      const hasActiveEmergency = normalizedData.event.length > 0;
      
      console.log(`Статус ЧС: ${hasActiveEmergency ? 'АКТИВНЫ' : 'ОТСУТСТВУЮТ'} (событий: ${normalizedData.event.length})`);
      
      setIsEmergency(hasActiveEmergency);
      setEmergencyData(hasActiveEmergency ? normalizedData : null);
      setLastChecked(new Date());

      // Если обнаружена ЧС и пользователь не на разрешенных страницах - перенаправляем
      const allowedPaths = ['/emergency', '/reference', '/evacuation', '/support'];
      const isOnAllowedPath = allowedPaths.some(path => location.pathname.startsWith(path));
      
      if (hasActiveEmergency && !isOnAllowedPath) {
        console.log('ЧС обнаружена, перенаправление на /emergency');
        navigate('/emergency', { replace: true });
      }
      
      // Если ЧС закончилась и пользователь на emergency-страницах - перенаправляем на главную
      if (!hasActiveEmergency && isOnAllowedPath && isEmergency) {
        console.log('ЧС завершена, перенаправление на главную');
        navigate('/', { replace: true });
      }

    } catch (err) {
      console.error('Ошибка при проверке статуса ЧС:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      
      // При ошибке API отключаем режим ЧС
      if (isEmergency) {
        console.log('Ошибка API, отключение режима ЧС');
        setIsEmergency(false);
        setEmergencyData(null);
        
        // Если пользователь на emergency-страницах, перенаправляем на главную
        const allowedPaths = ['/emergency', '/reference', '/evacuation', '/support'];
        const isOnAllowedPath = allowedPaths.some(path => location.pathname.startsWith(path));
        if (isOnAllowedPath) {
          navigate('/', { replace: true });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.pathname, isEmergency, user?.city]);

  // Запускаем периодическую проверку
  useEffect(() => {
    // Проверяем сразу при загрузке
    checkEmergencyStatus();

    // Устанавливаем интервал
    const interval = setInterval(checkEmergencyStatus, EMERGENCY_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [checkEmergencyStatus]);

  // Принудительная проверка (для кнопки обновления и т.д.)
  const forceCheck = useCallback(() => {
    console.log('Принудительная проверка статуса ЧС');
    checkEmergencyStatus();
  }, [checkEmergencyStatus]);

  // Получить следующее время проверки
  const getNextCheckTime = useCallback(() => {
    if (!lastChecked) return null;
    return new Date(lastChecked.getTime() + EMERGENCY_CHECK_INTERVAL);
  }, [lastChecked]);

  return {
    isEmergency,
    emergencyData,
    isLoading,
    error,
    lastChecked,
    forceCheck,
    getNextCheckTime,
  };
}