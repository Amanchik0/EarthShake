// src/hooks/useEmergencySystem.ts
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EmergencyResponse, EmergencyEvent, ReferenceInfo } from '../types/emergency';

const EMERGENCY_CHECK_INTERVAL = 15000; 
const EMERGENCY_API_URL = 'http://localhost:8090/api/events/emergency/Almaty';

export function useEmergencySystem() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState<EmergencyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkEmergencyStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Проверка статуса экстренной ситуации...');
      
      const response = await fetch(EMERGENCY_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EmergencyResponse = await response.json();
      console.log('Получены данные о ЧС:', data);
      
      const hasActiveEmergency = data.event && data.event.length > 0;
      
      setIsEmergency(hasActiveEmergency);
      setEmergencyData(hasActiveEmergency ? data : null);
      setLastChecked(new Date());

      const allowedPaths = ['/emergency', '/reference', '/evacuation', '/support'];
      const isOnAllowedPath = allowedPaths.some(path => location.pathname.startsWith(path));
      
      if (hasActiveEmergency && !isOnAllowedPath) {
        console.log('ЧС обнаружена, перенаправление на /emergency');
        navigate('/emergency', { replace: true });
      }
      
      if (!hasActiveEmergency && isOnAllowedPath && isEmergency) {
        console.log('ЧС завершена, перенаправление на главную');
        navigate('/', { replace: true });
      }

    } catch (err) {
      console.error('Ошибка при проверке статуса ЧС:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.pathname, isEmergency]);

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