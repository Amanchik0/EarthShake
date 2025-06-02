// src/services/emergencyService.ts
import { EmergencyResponse } from '../../types/emergencyTypes';

class EmergencyService {
  private baseUrl = 'http://localhost:8090/api/events/emergency';
  private controller: AbortController | null = null;
  
  // Отменяем предыдущий запрос если он еще выполняется
  private cancelPreviousRequest() {
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();
  }
  
  async getEmergencyStatus(city: string = 'Almaty'): Promise<EmergencyResponse> {
    this.cancelPreviousRequest();
    
    try {
      console.log(`Запрос статуса ЧС для города: ${city}`);
      
      const response = await fetch(`${this.baseUrl}/${city}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: this.controller!.signal,
        // Таймаут 10 секунд
        ...{ signal: AbortSignal.timeout(10000) }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: EmergencyResponse = await response.json();
      
      console.log('Получены данные ЧС:', {
        eventsCount: data.event?.length || 0,
        referenceInfoCount: data.referenceInfo?.length || 0,
        events: data.event,
        referenceInfo: data.referenceInfo
      });
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Запрос был отменен');
          throw new Error('Запрос был отменен');
        }
        if (error.name === 'TimeoutError') {
          console.error('Таймаут запроса к серверу ЧС');
          throw new Error('Превышено время ожидания ответа сервера');
        }
      }
      
      console.error('Ошибка сервиса экстренных ситуаций:', error);
      throw error;
    }
  }

  async getAllEmergencies(): Promise<EmergencyResponse> {
    this.cancelPreviousRequest();
    
    try {
      console.log('Запрос всех активных ЧС');
      
      const response = await fetch(`${this.baseUrl}/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: this.controller!.signal,
        ...{ signal: AbortSignal.timeout(10000) }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: EmergencyResponse = await response.json();
      
      console.log('Получены данные всех ЧС:', {
        eventsCount: data.event?.length || 0,
        referenceInfoCount: data.referenceInfo?.length || 0
      });
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Запрос был отменен');
          throw new Error('Запрос был отменен');
        }
        if (error.name === 'TimeoutError') {
          console.error('Таймаут запроса к серверу ЧС');
          throw new Error('Превышено время ожидания ответа сервера');
        }
      }
      
      console.error('Ошибка сервиса экстренных ситуаций:', error);
      throw error;
    }
  }

  // Метод для получения статуса по координатам
  async getEmergencyByCoordinates(lat: number, lng: number, radius: number = 10000): Promise<EmergencyResponse> {
    this.cancelPreviousRequest();
    
    try {
      console.log(`Запрос ЧС по координатам: ${lat}, ${lng} (радиус: ${radius}м)`);
      
      const response = await fetch(`${this.baseUrl}/coordinates?lat=${lat}&lng=${lng}&radius=${radius}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: this.controller!.signal,
        ...{ signal: AbortSignal.timeout(10000) }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: EmergencyResponse = await response.json();
      
      console.log('Получены данные ЧС по координатам:', {
        eventsCount: data.event?.length || 0,
        referenceInfoCount: data.referenceInfo?.length || 0
      });
      
      return data;
    } catch (error) {
      console.error('Ошибка получения ЧС по координатам:', error);
      throw error;
    }
  }

  // Очистка ресурсов
  cleanup() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  // Проверка доступности сервера
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Экспортируем синглтон
export const emergencyService = new EmergencyService();

// Экспортируем класс для тестирования
export { EmergencyService };