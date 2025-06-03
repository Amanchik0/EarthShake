import { EmergencyResponse } from '../../types/emergencyTypes';
import { kazakhstanCities } from '../../data/cities';

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
  
  // Функция для преобразования русского названия города в английское
  private getCityEnglishName(cityName: string): string {
    const city = kazakhstanCities.find(
      c => c.name.toLowerCase() === cityName.toLowerCase() || 
           c.nameEn.toLowerCase() === cityName.toLowerCase()
    );
    return city ? city.nameEn : cityName; // Если не найден, возвращаем как есть
  }
  
  async getEmergencyStatus(city?: string): Promise<EmergencyResponse> {
    this.cancelPreviousRequest();
    
    // Если город не указан, пытаемся получить из localStorage
    let targetCity = city || this.getCityFromStorage() || 'Алматы';
    
    // Преобразуем название города в английское для API
    const englishCityName = this.getCityEnglishName(targetCity);
    
    try {
      console.log(`Запрос статуса ЧС для города: ${targetCity} (API: ${englishCityName})`);
      
      const response = await fetch(`${this.baseUrl}/${englishCityName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // Исправлено: убрал дублирование сигналов
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Получаем текст ответа для проверки
      const responseText = await response.text();
      console.log('Сырой ответ сервера:', responseText);

      let data: any;

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
      
      // Проверяем структуру ответа и нормализуем данные
      if (!data || typeof data !== 'object') {
        console.warn('Неверная структура ответа, создаем пустую структуру');
        data = {
          event: [],
          referenceInfo: []
        };
      }
      
      // Нормализуем данные - если event отсутствует или не массив, создаем пустой массив
      const normalizedData: EmergencyResponse = {
        event: Array.isArray(data.event) ? data.event : [],
        referenceInfo: Array.isArray(data.referenceInfo) ? data.referenceInfo : []
      };
      
      console.log('Обработанные данные ЧС:', {
        eventsCount: normalizedData.event.length,
        referenceInfoCount: normalizedData.referenceInfo.length,
        events: normalizedData.event,
        referenceInfo: normalizedData.referenceInfo
      });
      
      return normalizedData;
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

  // Получение города из localStorage
  private getCityFromStorage(): string | null {
    try {
      return localStorage.getItem('city');
    } catch (error) {
      console.warn('Не удалось получить город из localStorage:', error);
      return null;
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
        signal: AbortSignal.timeout(10000) // Исправлено: убрал дублирование сигналов
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      
      let data: any;
      if (!responseText || responseText.trim() === '') {
        data = { event: [], referenceInfo: [] };
      } else {
        data = JSON.parse(responseText);
      }
      
      const normalizedData: EmergencyResponse = {
        event: Array.isArray(data.event) ? data.event : [],
        referenceInfo: Array.isArray(data.referenceInfo) ? data.referenceInfo : []
      };
      
      console.log('Получены данные всех ЧС:', {
        eventsCount: normalizedData.event.length,
        referenceInfoCount: normalizedData.referenceInfo.length
      });
      
      return normalizedData;
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
        signal: AbortSignal.timeout(10000) // Исправлено: убрал дублирование сигналов
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      
      let data: any;
      if (!responseText || responseText.trim() === '') {
        data = { event: [], referenceInfo: [] };
      } else {
        data = JSON.parse(responseText);
      }
      
      const normalizedData: EmergencyResponse = {
        event: Array.isArray(data.event) ? data.event : [],
        referenceInfo: Array.isArray(data.referenceInfo) ? data.referenceInfo : []
      };
      
      console.log('Получены данные ЧС по координатам:', {
        eventsCount: normalizedData.event.length,
        referenceInfoCount: normalizedData.referenceInfo.length
      });
      
      return normalizedData;
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