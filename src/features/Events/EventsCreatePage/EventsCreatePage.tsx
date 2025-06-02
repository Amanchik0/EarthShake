import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../components/auth/AuthContext';
import CitySelect from '../../../components/CitySelect/CitySelect';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './EventCreatePage.module.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW56b24iLCJhIjoiY202cWFhNW5qMGViaDJtc2J2eXhtZTdraCJ9.V7DT16ZhFkjt88aEWYRNiw';
const TWOGIS_API_KEY = '8b4cc23d-1ab4-4868-a785-3c14a80ead0c';
const DEFAULT_CENTER: [number, number] = [76.886, 43.238]; // Алматы

// Устанавливаем токен СРАЗУ при импорте модуля
mapboxgl.accessToken = MAPBOX_TOKEN;

// Интерфейс для формы создания события
interface EventCreateForm {
  title: string;
  description: string;
  content: string;
  city: string;
  eventType: string;
  emergencyType: string;
  tags: string[];
  location: {
    x: number;
    y: number;
    address?: string;
  };
  mediaFiles: File[];
  dateTime: string;
  eventStatus: string;
  price: string;
}

// Интерфейс для отправки на API (упрощенная версия)
interface EventCreatePayload {
  eventType: string;
  emergencyType?: string;
  title: string;
  description: string;
  content: string;
  author: string;
  city: string;
  location: {
    x: number;
    y: number;
  };
  mediaUrl: string[];
  dateTime: string;
  tags: string[];
  usersIds: string[];
  metadata: {
    [key: string]: string;
  };
  comments: Array<any>;
  archived: boolean;
}

// Интерфейс для информации о сообществе
interface CommunityInfo {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  author: string;
  city: string;
}

const EventCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const communityId = searchParams.get('communityId');
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Состояние для информации о сообществе
  const [communityInfo, setCommunityInfo] = useState<CommunityInfo | null>(null);
  const [loadingCommunity, setLoadingCommunity] = useState<boolean>(!!communityId);

  // Используем callback ref вместо useRef для контейнера
  const mapCallbackRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node && !map.current) {
      console.log('📦 Callback ref: контейнер карты готов', node);
      console.log('📦 Родительские элементы:', node.parentElement, node.parentElement?.parentElement);
      
      // Увеличиваем задержку для лучшей инициализации
      setTimeout(() => {
        initializeMapFromCallback(node);
      }, 500);
    }
  }, []);

  // Загружаем информацию о сообществе при монтировании
  useEffect(() => {
    if (communityId) {
      loadCommunityInfo(communityId);
    }
  }, [communityId]);

  // Функция загрузки информации о сообществе
  const loadCommunityInfo = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('🔍 Загружаем сообщество:', id);
      
      // Пробуем разные возможные эндпоинты
      const possibleEndpoints = [
        `http://localhost:8090/api/communities/${id}`,
        `http://localhost:8090/api/community/${id}`,
        `http://localhost:8090/communities/${id}`,
        `http://localhost:8090/community/${id}`
      ];

      let community = null;
      let lastError = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔗 Пробуем эндпоинт: ${endpoint}`);
          const response = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.ok) {
            community = await response.json();
            console.log(' Информация о сообществе загружена:', community);
            break;
          } else {
            console.log(`${endpoint} вернул ${response.status}`);
            lastError = `${response.status}: ${response.statusText}`;
          }
        } catch (err) {
          console.log(`Ошибка запроса к ${endpoint}:`, err);
          lastError = err;
        }
      }

      if (community) {
        setCommunityInfo(community);
        
        // Автоматически устанавливаем город из сообщества
        if (community.city) {
          setFormData(prev => ({ ...prev, city: community.city }));
          // Отложим геокодирование до загрузки карты
          setTimeout(() => {
            geocodeCity(community.city);
          }, 1000);
        }
      } else {
        console.error('Все эндпоинты не сработали. Последняя ошибка:', lastError);
        showNotificationMessage(`Сообщество не найдено (ID: ${id}). Проверьте правильность ссылки.`, false);
        
        // Все равно позволяем создать событие, но без привязки к сообществу
        setTimeout(() => {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.delete('communityId');
          window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error('Общая ошибка при загрузке сообщества:', error);
      showNotificationMessage('Ошибка при загрузке сообщества', false);
    } finally {
      setLoadingCommunity(false);
    }
  };

  const initializeMapFromCallback = (container: HTMLDivElement) => {
    if (map.current) return;

    console.log('🚀 Инициализация карты через callback ref');
    
    try {
      // Принудительно задаем размеры и делаем контейнер видимым
      container.style.width = '100%';
      container.style.height = '350px';
      container.style.minHeight = '350px';
      container.style.display = 'block';
      container.style.position = 'relative';
      container.style.visibility = 'visible';

      // Дожидаемся пока контейнер получит правильные размеры
      const checkSizeAndInit = () => {
        const rect = container.getBoundingClientRect();
        console.log('📏 Размеры контейнера (callback):', rect.width, 'x', rect.height);
        
        if (rect.width === 0 || rect.height === 0) {
          console.log('⏳ Размеры еще не готовы, пробуем снова...');
          setTimeout(checkSizeAndInit, 200);
          return;
        }

        // Размеры готовы, создаем карту
        try {
          map.current = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: DEFAULT_CENTER,
            zoom: 10,
            attributionControl: false
          });

          console.log(' Карта создана через callback ref');
          
          // Добавляем все обработчики
          setupMapHandlers();
        } catch (mapError) {
          console.error('Ошибка создания карты:', mapError);
          setMapError(`Ошибка создания карты: ${mapError instanceof Error ? mapError.message : String(mapError)}`);
          setMapLoading(false);
        }
      };

      // Запускаем проверку размеров
      checkSizeAndInit();
      
    } catch (error) {
      console.error('Ошибка в callback ref:', error);
      setMapError(`Ошибка callback ref: ${error instanceof Error ? error.message : String(error)}`);
      setMapLoading(false);
    }
  };

  const setupMapHandlers = () => {
    if (!map.current) return;

    // Обработчик загрузки
    map.current.on('load', () => {
      console.log(' Карта загружена (callback)');
      setMapError('');
      setMapLoading(false);
    });

    // Обработчик ошибок
    map.current.on('error', (e) => {
      console.error('Ошибка карты (callback):', e);
      setMapError(`Ошибка карты: ${e.error?.message || 'Неизвестная ошибка'}`);
      setMapLoading(false);
    });

    // Контролы
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Маркер
    marker.current = new mapboxgl.Marker({ 
      draggable: true,
      color: '#FF6B98'
    })
      .setLngLat(DEFAULT_CENTER)
      .addTo(map.current);

    // События маркера
    marker.current.on('dragend', async () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        await updateLocationFromCoordinates(lngLat.lng, lngLat.lat);
      }
    });

    // Клик по карте
    map.current.on('click', async (e) => {
      if (marker.current) {
        marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        await updateLocationFromCoordinates(e.lngLat.lng, e.lngLat.lat);
      }
    });

    // Получаем изначальный адрес
    updateLocationFromCoordinates(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
  };

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<EventCreateForm>({
    title: '',
    description: '',
    content: '',
    city: '',
    eventType: 'REGULAR',
    emergencyType: '',
    tags: [],
    location: {
      x: DEFAULT_CENTER[0],
      y: DEFAULT_CENTER[1],
      address: ''
    },
    mediaFiles: [],
    dateTime: '',
    eventStatus: 'ACTIVE',
    price: ''
  });

  const [mapError, setMapError] = useState<string>('');
  const [mapLoading, setMapLoading] = useState<boolean>(true);

  // Cleanup при размонтировании компонента
  useEffect(() => {
    return () => {
      if (map.current) {
        console.log('🧹 Очистка карты при размонтировании');
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Резервная инициализация карты если callback ref не сработал
  useEffect(() => {
    if (!loadingCommunity && !map.current) {
      console.log('🔄 Попытка резервной инициализации карты через useEffect');
      setTimeout(() => {
        const mapContainer = document.querySelector('[data-map-container]') as HTMLDivElement;
        if (mapContainer && !map.current) {
          console.log('🎯 Найден контейнер карты через querySelector');
          initializeMapFromCallback(mapContainer);
        }
      }, 1000);
    }
  }, [loadingCommunity]);

  // Функция обратного геокодирования через 2GIS API
  const reverseGeocode2GIS = async (lng: number, lat: number): Promise<string> => {
    try {
      console.log(`🌍 Получаем адрес через 2GIS для координат: ${lng}, ${lat}`);
      
      const response = await fetch(
        `https://catalog.api.2gis.com/3.0/items/geocode?lat=${lat}&lon=${lng}&key=${TWOGIS_API_KEY}&fields=items.address_name,items.full_name,items.point&radius=1000`
      );
      
      if (!response.ok) {
        console.error('Ошибка запроса к 2GIS API:', response.status, response.statusText);
        throw new Error(`2GIS API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🗺️ Ответ 2GIS API:', data);

      if (data.result && data.result.items && data.result.items.length > 0) {
        const item = data.result.items[0];
        console.log('📍 Найденная локация через 2GIS:', item);
        
        // Пробуем получить наиболее подходящий адрес
        let address = '';
        if (item.address_name) {
          address = item.address_name;
        } else if (item.full_name) {
          address = item.full_name;
        } else if (item.name) {
          address = item.name;
        }
        
        if (address) {
          console.log(' Адрес получен через 2GIS:', address);
          return address;
        }
      }
      
      console.log('Адрес не найден в ответе 2GIS API');
      throw new Error('No address found in 2GIS response');
    } catch (error) {
      console.error('Ошибка 2GIS геокодирования:', error);
      throw error;
    }
  };

  // Fallback функция через Mapbox
  const reverseGeocodeMapbox = async (lng: number, lat: number): Promise<string> => {
    try {
      console.log(`🌍 Fallback: получаем адрес через Mapbox для координат: ${lng}, ${lat}`);
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=ru&types=address,poi,place,locality,neighborhood&limit=1&country=KZ`
      );
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🗺️ Ответ Mapbox API (fallback):', data);

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        
        let addressParts: string[] = [];
        let hasDetailedAddress = false;
        
        if (feature.address && feature.text) {
          addressParts.push(`${feature.text}, ${feature.address}`);
          hasDetailedAddress = true;
        } else if (feature.text && feature.place_type && feature.place_type.includes('address')) {
          addressParts.push(feature.text);
          hasDetailedAddress = true;
        } else if (feature.text && feature.place_type && feature.place_type.includes('poi')) {
          addressParts.push(feature.text);
          hasDetailedAddress = true;
        } else if (feature.text) {
          addressParts.push(feature.text);
        }
        
        if (feature.context && Array.isArray(feature.context)) {
          feature.context.forEach((ctx: any) => {
            if (ctx.id && ctx.id.includes('neighborhood') && !hasDetailedAddress) {
              addressParts.push(ctx.text);
            } else if (ctx.id && ctx.id.includes('locality') && !hasDetailedAddress) {
              addressParts.push(ctx.text);
            }
          });
          
          const city = feature.context.find((ctx: any) => ctx.id && ctx.id.includes('place'));
          if (city && city.text) {
            addressParts.push(city.text);
          }
        }
        
        const uniqueAddressParts = [...new Set(addressParts)];
        let finalAddress = uniqueAddressParts.join(', ');
        
        if (uniqueAddressParts.length === 1 || !hasDetailedAddress) {
          finalAddress += ` (${lng.toFixed(6)}, ${lat.toFixed(6)})`;
        }
        
        console.log(' Адрес получен через Mapbox (fallback):', finalAddress);
        return finalAddress;
      }
      
      throw new Error('No address found in Mapbox response');
    } catch (error) {
      console.error('Ошибка Mapbox геокодирования:', error);
      throw error;
    }
  };

  // Основная функция обратного геокодирования с fallback
  const reverseGeocode = async (lng: number, lat: number): Promise<string> => {
    try {
      // Сначала пробуем 2GIS
      return await reverseGeocode2GIS(lng, lat);
    } catch (error) {
      console.log(' 2GIS не удался, используем Mapbox fallback');
      try {
        // Если 2GIS не сработал, используем Mapbox
        return await reverseGeocodeMapbox(lng, lat);
      } catch (fallbackError) {
        console.error('Оба API не сработали');
        return `Координаты: ${lng.toFixed(6)}, ${lat.toFixed(6)}`;
      }
    }
  };

  // Обновление локации с получением адреса
  const updateLocationFromCoordinates = async (lng: number, lat: number) => {
    console.log(`📍 Обновляем локацию: ${lng}, ${lat}`);
    
    // Сначала обновляем координаты
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        x: lng,
        y: lat,
        address: '🔄 Получение адреса...'
      }
    }));
    
    // Затем получаем адрес
    try {
      const address = await reverseGeocode(lng, lat);
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          x: lng,
          y: lat,
          address: address
        }
      }));
    } catch (error) {
      console.error('Ошибка получения адреса:', error);
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          x: lng,
          y: lat,
          address: `Координаты: ${lng.toFixed(6)}, ${lat.toFixed(6)}`
        }
      }));
    }
  };

  // Геокодирование города (название -> координаты)
  const geocodeCity = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=KZ`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 12
          });
        }

        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        }

        await updateLocationFromCoordinates(lng, lat);
      }
    } catch (error) {
      console.error('Ошибка геокодирования города:', error);
    }
  };

  // Обработчик изменения города
  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({ ...prev, city: cityName }));
    if (cityName) {
      geocodeCity(cityName);
    }
    // Очищаем ошибку
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: '' }));
    }
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Обработчик изменения тегов
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, value]
        : prev.tags.filter(tag => tag !== value)
    }));
  };

  // Обработчик загрузки изображений (множественный выбор)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, mediaFiles: filesArray }));
      if (errors.mediaFile) {
        setErrors(prev => ({ ...prev, mediaFile: '' }));
      }
    }
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название события обязательно';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание события обязательно';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Город обязателен';
    }

    if (!formData.dateTime) {
      newErrors.dateTime = 'Дата и время события обязательны';
    } else {
      const eventDate = new Date(formData.dateTime);
      const now = new Date();
      if (eventDate <= now) {
        newErrors.dateTime = 'Дата события должна быть в будущем';
      }
    }

    if (!formData.mediaFiles || formData.mediaFiles.length === 0) {
      newErrors.mediaFile = 'Изображение события обязательно';
    }

    if (formData.location.x === DEFAULT_CENTER[0] && formData.location.y === DEFAULT_CENTER[1]) {
      newErrors.location = 'Выберите место проведения события на карте';
    }

    // Валидация для экстренных событий
    if (formData.eventType === 'EMERGENCY' && !formData.emergencyType.trim()) {
      newErrors.emergencyType = 'Для экстренных событий необходимо указать тип экстренной ситуации';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Функция обновления списка событий в сообществе
const updateCommunityEvents = async (eventId: string) => {
  if (!communityId || !communityInfo) return;

  try {
    const token = localStorage.getItem('accessToken');
    
    console.log('🔄 Обновляем список событий сообщества...');
    
    // Добавляем новое событие к списку
    const updatedListEvents = [...(communityInfo.listEvents || []), eventId];

    console.log(`🔗 Обновляем сообщество через: http://localhost:8090/api/community/update`);
    
    const updateResponse = await fetch('http://localhost:8090/api/community/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...communityInfo,
        listEvents: updatedListEvents,
        eventsCount: updatedListEvents.length
      })
    });

    if (updateResponse.ok) {
      console.log(' Список событий сообщества обновлен');
    } else {
      const errorText = await updateResponse.text();
      console.error(`Ошибка обновления сообщества:`, updateResponse.status, errorText);
      throw new Error(`Ошибка ${updateResponse.status}: ${errorText}`);
    }

  } catch (error) {
    console.error('Ошибка обновления сообщества:', error);
    // Не прерываем процесс, так как событие уже создано
    console.log(' Событие создано, но связь с сообществом может быть не установлена');
    showNotificationMessage('Событие создано, но может потребоваться ручное добавление в сообщество', true);
  }
};
  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showNotificationMessage('Необходимо авторизоваться для создания события', false);
      return;
    }

    if (!validateForm()) {
      showNotificationMessage('Пожалуйста, исправьте ошибки в форме', false);
      return;
    }

    setIsSubmitting(true);

    try {
      let mediaUrls: string[] = [];

      // 1. Загружаем изображения (массив)
      if (formData.mediaFiles && formData.mediaFiles.length > 0) {
        const token = localStorage.getItem('accessToken');
        
        console.log('📤 Загружаем изображения...');
        
        for (const file of formData.mediaFiles) {
          const mediaFormData = new FormData();
          mediaFormData.append('file', file);

          const uploadResponse = await fetch('http://localhost:8090/api/media/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: mediaFormData,
          });

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Ошибка загрузки изображения:', errorText);
            throw new Error('Ошибка загрузки изображения');
          }

          const mediaUrl = await uploadResponse.text();
          console.log(' Изображение загружено:', mediaUrl);

          // Проверяем, нужно ли добавить базовый URL
          const fullMediaUrl = mediaUrl.startsWith('http') 
            ? mediaUrl 
            : `http://localhost:8090/api/media/${mediaUrl}`;
          
          mediaUrls.push(fullMediaUrl);
        }
      }

      // 2. Подготавливаем данные события согласно рабочему API
      const apiPayload: EventCreatePayload = {
        eventType: formData.eventType,
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim() || formData.description.trim(),
        author: user.username,
        city: formData.city,
        location: {
          x: Number(formData.location.x),
          y: Number(formData.location.y),
        },
        mediaUrl: mediaUrls,
        dateTime: formData.dateTime,
        tags: formData.tags.length > 0 ? formData.tags : ['event'],
        usersIds: [user.username],
        metadata: {
          address: formData.location.address || '',
          scheduledDate: formData.dateTime,
          createdAt: new Date().toISOString(),
          // Устанавливаем isCommunity в зависимости от того, создается ли событие из сообщества
          isCommunity: communityId ? 'true' : 'false',
          // Добавляем communityId в метаданные если событие создается из сообщества
          ...(communityId && { communityId: communityId })
        },
        comments: [],
        archived: false
      };

      // Добавляем emergencyType только для экстренных событий
      if (formData.eventType === 'EMERGENCY' && formData.emergencyType.trim()) {
        apiPayload.emergencyType = formData.emergencyType.trim();
      }

      console.log('📦 Данные для отправки на API:');
      console.log('=====================================');
      console.log(JSON.stringify(apiPayload, null, 2));
      console.log('=====================================');

      // 3. Создаем событие
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8090/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(apiPayload),
      });

      const responseText = await response.text();
      console.log('📥 Ответ сервера:', responseText);

      if (!response.ok) {
        let errorMessage = 'Ошибка создания события';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Ошибка ${response.status}: ${responseText}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = JSON.parse(responseText);
        console.log(' Событие успешно создано:', result);
      } catch {
        result = { id: 'created' };
      }
      
      // 4. Если событие создается для сообщества, обновляем список событий
      if (communityId && result.id) {
        await updateCommunityEvents(result.id);
      }
      
      showNotificationMessage(
        communityId 
          ? 'Событие успешно создано и добавлено в сообщество!' 
          : 'Событие успешно создано!', 
        true
      );
      
      setTimeout(() => {
        if (communityId) {
          // Переходим обратно в сообщество
          navigate(`/communities/${communityId}`);
        } else {
          // Переходим к созданному событию
          navigate(`/events/${result.id || ''}`);
        }
      }, 1500);

    } catch (error: any) {
      console.error('Ошибка создания события:', error);
      showNotificationMessage(error.message || 'Не удалось создать событие', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Показ уведомления
  const showNotificationMessage = (message: string, success: boolean) => {
    setNotificationMessage(message);
    setIsSuccess(success);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Проверяем авторизацию
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Необходимо авторизоваться</h2>
          <p>Для создания события необходимо войти в систему</p>
          <button onClick={() => navigate('/login')} className={styles.button}>
            Войти
          </button>
        </div>
      </div>
    );
  }

  // Показываем загрузку если ждем информацию о сообществе
  if (loadingCommunity) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка информации о сообществе...</p>
          <small>ID: {communityId}</small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.sectionTitle}>
          {communityId ? (
            <div>
              <span>Создание события для сообщества</span>
              {communityInfo && (
                <div className={styles.communityInfo}>
                  <img 
                    src={communityInfo.imageUrls?.[0] || "/api/placeholder/40/40"} 
                    alt={communityInfo.name}
                    className={styles.communityImage}
                  />
                  <div>
                    <div className={styles.communityName}>{communityInfo.name}</div>
                    <div className={styles.communityCity}>{communityInfo.city}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            'Создание нового события'
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            {/* Изображение события */}
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                <img
                  src={formData.mediaFiles && formData.mediaFiles.length > 0 ? URL.createObjectURL(formData.mediaFiles[0]) : "/api/placeholder/150/150"}
                  alt="Обложка события"
                  className={styles.profileImage}
                />
                <label htmlFor="imageUpload" className={styles.imageUpload}>
                  📷
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  multiple // Добавляем поддержку множественного выбора
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {formData.mediaFiles && formData.mediaFiles.length > 1 && (
                  <div className={styles.multipleFilesIndicator}>
                    +{formData.mediaFiles.length - 1} файл(ов)
                  </div>
                )}
                {errors.mediaFile && <div className={styles.errorText}>{errors.mediaFile}</div>}
              </div>

              <div className={styles.profileInfo}>
                {/* Название события */}
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>Название события *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                    placeholder="Введите название события"
                  />
                  {errors.title && <div className={styles.errorText}>{errors.title}</div>}
                </div>

                {/* Дата и тип события */}
                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <label htmlFor="dateTime" className={styles.label}>Дата и время *</label>
                    <input
                      type="datetime-local"
                      id="dateTime"
                      name="dateTime"
                      value={formData.dateTime}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.dateTime ? styles.inputError : ''}`}
                    />
                    {errors.dateTime && <div className={styles.errorText}>{errors.dateTime}</div>}
                  </div>

                  <div className={styles.formCol}>
                    <label htmlFor="eventType" className={styles.label}>Тип события *</label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="REGULAR">Обычное</option>
                      <option value="EMERGENCY">Экстренное</option>
                    </select>
                  </div>
                </div>

                {/* Тип экстренной ситуации (показывается только для экстренных событий) */}
                {formData.eventType === 'EMERGENCY' && (
                  <div className={styles.formGroup}>
                    <label htmlFor="emergencyType" className={styles.label}>Тип экстренной ситуации *</label>
                    <input
                      type="text"
                      id="emergencyType"
                      name="emergencyType"
                      value={formData.emergencyType}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.emergencyType ? styles.inputError : ''}`}
                      placeholder="Например: пожар, авария, стихийное бедствие"
                    />
                    {errors.emergencyType && <div className={styles.errorText}>{errors.emergencyType}</div>}
                  </div>
                )}

                {/* Город */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Город *</label>
                  <CitySelect
                    value={formData.city}
                    onChange={handleCityChange}
                    placeholder="Выберите город"
                    error={errors.city}
                    required
                    disabled={!!communityInfo?.city} // Отключаем если город установлен из сообщества
                  />
                  {communityInfo?.city && (
                    <div className={styles.infoText}>
                      Город автоматически установлен из сообщества
                    </div>
                  )}
                </div>

                {/* Цена (опционально) - закомментировано */}
                {/* <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>Цена участия</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Например: Бесплатно, 1000 ₸, 50$"
                  />
                </div> */}
              </div>
            </div>

            {/* Описание */}
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Описание события *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                placeholder="Опишите ваше событие подробно"
                rows={4}
              />
              {errors.description && <div className={styles.errorText}>{errors.description}</div>}
            </div>

            {/* Дополнительная информация */}
            <div className={styles.formGroup}>
              <label htmlFor="content" className={styles.label}>Дополнительная информация</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Дополнительные детали события"
                rows={3}
              />
            </div>

            {/* Теги */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Теги события</label>
              <div className={styles.tagsContainer}>
                {['спорт', 'музыка', 'образование', 'технологии', 'искусство', 'еда', 'развлечения'].map(tag => (
                  <label key={tag} className={styles.tagLabel}>
                    <input
                      type="checkbox"
                      value={tag}
                      checked={formData.tags.includes(tag)}
                      onChange={handleTagsChange}
                    />
                    <span className={styles.tagText}>#{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Карта */}
            <div className={styles.mapSection}>
              <label className={styles.label}>Место проведения события *</label>
              
              {/* Индикатор загрузки карты */}
              {mapLoading && !mapError && (
                <div className={styles.mapLoading}>
                  <div className={styles.spinner}></div>
                  <p>Загрузка карты...</p>
                </div>
              )}
              
              {/* Контейнер карты */}
              <div
                ref={mapCallbackRef}
                data-map-container
                className={styles.mapContainer}
                style={{ 
                  display: mapError ? 'none' : 'block',
                  opacity: mapLoading ? 0.5 : 1,
                  width: '100%',
                  height: '350px',
                  minHeight: '350px',
                  position: 'relative'
                }}
              />
              
              {/* Ошибка карты */}
              {mapError && (
                <div className={styles.mapError}>
                  <p>🗺️ {mapError}</p>
                  <p>Координаты можно ввести вручную:</p>
                  <div className={styles.coordinatesInput}>
                    <input
                      type="number"
                      placeholder="Долгота (lng)"
                      step="any"
                      value={formData.location.x}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, x: parseFloat(e.target.value) || 0 }
                      }))}
                      className={styles.input}
                    />
                    <input
                      type="number"
                      placeholder="Широта (lat)"
                      step="any"
                      value={formData.location.y}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, y: parseFloat(e.target.value) || 0 }
                      }))}
                      className={styles.input}
                    />
                  </div>
                </div>
              )}
              
              {/* Выбранный адрес */}
              {formData.location.address && (
                <div className={styles.selectedAddress}>
                  📍 {formData.location.address}
                </div>
              )}
              
              {/* Ошибка валидации */}
              {errors.location && <div className={styles.errorText}>{errors.location}</div>}
            </div>

            {/* Кнопки */}
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={() => {
                  if (communityId) {
                    navigate(`/communities/${communityId}`);
                  } else {
                    navigate(-1);
                  }
                }}
                disabled={isSubmitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Создание...' : (communityId ? 'Создать для сообщества' : 'Создать событие')}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Уведомления */}
      {showNotification && (
        <div className={`${styles.notification} ${isSuccess ? styles.notificationSuccess : styles.notificationError}`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default EventCreatePage;