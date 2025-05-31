import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Интерфейс для данных создания события (согласно API)
interface EventCreateData {
  eventType: 'REGULAR' | 'EMERGENCY';
  emergencyType?: string | null;
  title: string;
  description: string;
  content: string;
  author: string; // Всегда username создателя
  city: string;
  location: {
    x: number;
    y: number;
  };
  mediaUrl: string[]; // Массив URL изображений
  tags: string[];
  metadata: {
    address?: string | undefined;
    scheduledDate?: string;
    // Информация о создании от имени сообщества
    createdForCommunity?: boolean;
    communityId?: string;
    communityName?: string;
    [key: string]: any;
  };
}

// Интерфейс для формы создания события
interface EventCreateForm {
  title: string;
  description: string;
  content: string;
  city: string;
  eventType: 'REGULAR' | 'EMERGENCY';
  tags: string[];
  location: {
    x: number;
    y: number;
    address?: string;
  };
  mediaFile?: File | null;
  dateTime: string;
  // Информация о том, создается ли событие от имени сообщества
  isForCommunity: boolean;
  communityId?: string | undefined;
  communityName?: string | undefined;
}

const EventCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Получаем параметры из URL
  const searchParams = new URLSearchParams(location.search);
  const communityId = searchParams.get('communityId');
  const authorType = searchParams.get('authorType');

  const [communityInfo, setCommunityInfo] = useState<{ id: string; name: string } | null>(null);

  // Используем callback ref вместо useRef для контейнера
  const mapCallbackRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node && !map.current) {
      console.log('📦 Callback ref: контейнер карты готов', node);
      
      // Инициализируем карту сразу, как только контейнер готов
      setTimeout(() => {
        initializeMapFromCallback(node);
      }, 100);
    }
  }, []);

  const initializeMapFromCallback = (container: HTMLDivElement) => {
    if (map.current) return;

    console.log('🚀 Инициализация карты через callback ref');
    
    try {
      // Принудительно задаем размеры
      container.style.width = '100%';
      container.style.height = '350px';
      container.style.minHeight = '350px';
      container.style.display = 'block';

      const rect = container.getBoundingClientRect();
      console.log('📏 Размеры контейнера (callback):', rect.width, 'x', rect.height);
      
      if (rect.width === 0 || rect.height === 0) {
        console.error('❌ Нулевые размеры в callback ref');
        setMapError('Контейнер карты имеет нулевые размеры');
        setMapLoading(false);
        return;
      }

      map.current = new mapboxgl.Map({
        container: container,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: DEFAULT_CENTER,
        zoom: 10,
        attributionControl: false
      });

      console.log('✅ Карта создана через callback ref');
      
      // Добавляем все обработчики
      setupMapHandlers();
      
    } catch (error) {
      console.error('❌ Ошибка в callback ref:', error);
      setMapError(`Ошибка callback ref: ${error instanceof Error ? error.message : String(error)}`);
      setMapLoading(false);
    }
  };

  const setupMapHandlers = () => {
    if (!map.current) return;

    // Обработчик загрузки
    map.current.on('load', () => {
      console.log('✅ Карта загружена (callback)');
      setMapError('');
      setMapLoading(false);
    });

    // Обработчик ошибок
    map.current.on('error', (e) => {
      console.error('❌ Ошибка карты (callback):', e);
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
    tags: [],
    location: {
      x: DEFAULT_CENTER[0],
      y: DEFAULT_CENTER[1],
      address: ''
    },
    mediaFile: null,
    dateTime: '',
    isForCommunity: false,
    communityId: undefined,
    communityName: undefined
  });

  const [mapError, setMapError] = useState<string>('');
  const [mapLoading, setMapLoading] = useState<boolean>(true);

  // Загружаем информацию о сообществе, если событие создается от его имени
  useEffect(() => {
    if (communityId && authorType === 'community') {
      fetchCommunityInfo(communityId);
    }
  }, [communityId, authorType]);

  const fetchCommunityInfo = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8090/api/community/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const communityData = await response.json();
        setCommunityInfo({
          id: communityData.id,
          name: communityData.name
        });

        // Обновляем форму для создания от имени сообщества
        setFormData(prev => ({
          ...prev,
          isForCommunity: true,
          communityId: communityData.id,
          communityName: communityData.name,
          city: communityData.city || prev.city
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки информации о сообществе:', error);
    }
  };

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

  // Функция обратного геокодирования через 2GIS API
  const reverseGeocode2GIS = async (lng: number, lat: number): Promise<string> => {
    try {
      console.log(`🌍 Получаем адрес через 2GIS для координат: ${lng}, ${lat}`);
      
      const response = await fetch(
        `https://catalog.api.2gis.com/3.0/items/geocode?lat=${lat}&lon=${lng}&key=${TWOGIS_API_KEY}&fields=items.address_name,items.full_name,items.point&radius=1000`
      );
      
      if (!response.ok) {
        console.error('❌ Ошибка запроса к 2GIS API:', response.status, response.statusText);
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
          console.log('✅ Адрес получен через 2GIS:', address);
          return address;
        }
      }
      
      console.log('❌ Адрес не найден в ответе 2GIS API');
      throw new Error('No address found in 2GIS response');
    } catch (error) {
      console.error('❌ Ошибка 2GIS геокодирования:', error);
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
        
        console.log('✅ Адрес получен через Mapbox (fallback):', finalAddress);
        return finalAddress;
      }
      
      throw new Error('No address found in Mapbox response');
    } catch (error) {
      console.error('❌ Ошибка Mapbox геокодирования:', error);
      throw error;
    }
  };

  // Основная функция обратного геокодирования с fallback
  const reverseGeocode = async (lng: number, lat: number): Promise<string> => {
    try {
      // Сначала пробуем 2GIS
      return await reverseGeocode2GIS(lng, lat);
    } catch (error) {
      console.log('⚠️ 2GIS не удался, используем Mapbox fallback');
      try {
        // Если 2GIS не сработал, используем Mapbox
        return await reverseGeocodeMapbox(lng, lat);
      } catch (fallbackError) {
        console.error('❌ Оба API не сработали');
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
          address: `❌ Координаты: ${lng.toFixed(6)}, ${lat.toFixed(6)}`
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

  // Обработчик загрузки изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, mediaFile: e.target.files![0] }));
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

    if (!formData.mediaFile) {
      newErrors.mediaFile = 'Изображение события обязательно';
    }

    if (formData.location.x === DEFAULT_CENTER[0] && formData.location.y === DEFAULT_CENTER[1]) {
      newErrors.location = 'Выберите место проведения события на карте';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      // 1. Загружаем изображение
      if (formData.mediaFile) {
        const token = localStorage.getItem('accessToken');
        const mediaFormData = new FormData();
        mediaFormData.append('file', formData.mediaFile);

        console.log('Загружаем изображение...');
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

        let mediaUrl = await uploadResponse.text();
        console.log('Изображение загружено:', mediaUrl);

        // Проверяем, нужно ли добавить базовый URL
        if (!mediaUrl.startsWith('http')) {
          mediaUrl = `http://localhost:8090/api/media/${mediaUrl}`;
        }
        
        mediaUrls = [mediaUrl];
      }

      // 2. Подготавливаем данные события согласно API
      const apiPayload: EventCreateData = {
        eventType: formData.eventType,
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim() || formData.description.trim(),
        author: user.username, // Всегда username создателя
        city: formData.city,
        location: {
          x: formData.location.x,
          y: formData.location.y,
        },
        mediaUrl: mediaUrls,
        tags: formData.tags.length > 0 ? formData.tags : ['event'],
        metadata: {
          address: formData.location.address || undefined,
          scheduledDate: formData.dateTime,
          // Если событие создается от имени сообщества
          ...(formData.isForCommunity && {
            createdForCommunity: true,
            communityId: formData.communityId,
            communityName: formData.communityName,
          })
        }
      };

      console.log('Отправляем на бэкенд:', JSON.stringify(apiPayload, null, 2));

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
      console.log('Ответ сервера:', responseText);

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
        console.log('Событие успешно создано:', result);
      } catch {
        result = { id: 'created' };
      }
      
      showNotificationMessage(
        `Событие успешно создано${formData.isForCommunity ? ` от имени сообщества "${formData.communityName}"` : ''}!`, 
        true
      );
      
      setTimeout(() => {
        if (formData.isForCommunity && formData.communityId) {
          navigate(`/communities/${formData.communityId}`);
        } else {
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

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.sectionTitle}>
          Создание нового события
          {formData.isForCommunity && (
            <div className={styles.communityBadge}>
              <span>От имени сообщества: <strong>{formData.communityName}</strong></span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            {/* Изображение события */}
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                <img
                  src={formData.mediaFile ? URL.createObjectURL(formData.mediaFile) : "/api/placeholder/150/150"}
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
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
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

                {/* Город */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Город *</label>
                  <CitySelect
                    value={formData.city}
                    onChange={handleCityChange}
                    placeholder="Выберите город"
                    error={errors.city}
                    required
                  />
                </div>
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
                className={styles.mapContainer}
                style={{ 
                  display: mapError ? 'none' : 'block',
                  opacity: mapLoading ? 0.5 : 1
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
                  // Возвращаемся в сообщество или назад
                  if (formData.isForCommunity && formData.communityId) {
                    navigate(`/communities/${formData.communityId}`);
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
                {isSubmitting ? 'Создание...' : 'Создать событие'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showNotification && (
        <div className={`${styles.notification} ${isSuccess ? styles.notificationSuccess : styles.notificationError}`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default EventCreatePage;