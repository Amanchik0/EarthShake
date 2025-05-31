import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/EventEdit/PageHeader';
import FormSection from '../../../components/EventEdit/FormSection';
import FormButtons from '../../../components/EventEdit/FormButtons';
import FormRow from '../../../components/EventEdit/FormRow';
import EventPhoto from '../../../components/EventEdit/EventPhoto';
import FormGroup from '../../../components/EventEdit/FormGroup';
import CitySelect from '../../../components/CitySelect/CitySelect';
import { useEventAPI } from '../../../hooks/useEventApi';
import { useAuth } from '../../../components/auth/AuthContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './EventEditPage.module.css';
import { BackendEventData, EventUpdateData } from '../../../types/event';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW56b24iLCJhIjoiY202cWFhNW5qMGViaDJtc2J2eXhtZTdraCJ9.V7DT16ZhFkjt88aEWYRNiw';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface EventFormData {
  eventName: string;
  description: string;
  content: string;
  eventType: 'REGULAR' | 'EMERGENCY';
  emergencyType: string | null;
  eventDate: string;
  eventTime: string;
  location: string;
  city: string;
  coordinates: { x: number; y: number };
  tags: string[];
  mediaUrl: string;
}

const EventEditPage: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, error, loadEvent, updateEvent, uploadMedia, clearError } = useEventAPI();

  // Карта
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapError, setMapError] = useState<string>('');
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  
  const [uploading, setUploading] = useState(false);
  const [originalEvent, setOriginalEvent] = useState<BackendEventData | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    eventName: '',
    description: '',
    content: '',
    eventType: 'REGULAR',
    emergencyType: null,
    eventDate: '',
    eventTime: '',
    location: '',
    city: '',
    coordinates: { x: 76.9050, y: 43.2370 }, // Алматы по умолчанию
    tags: [],
    mediaUrl: ''
  });

  // Cleanup карты при размонтировании
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Загрузка данных события
  useEffect(() => {
    if (eventId) {
      console.log('🔄 Загружаем событие с ID:', eventId);
      loadEventData(eventId);
    }
  }, [eventId]);

  // Отслеживаем загрузку события для инициализации карты
  useEffect(() => {
    if (originalEvent && formData.coordinates.x && formData.coordinates.y) {
      console.log('🗺️ Данные события загружены, инициализируем карту');
      // Небольшая задержка для того чтобы DOM элемент успел создаться
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  }, [originalEvent]);

  const loadEventData = async (id: string) => {
    console.log('🔍 Загружаем событие с ID:', id);
    const eventData = await loadEvent(id);
    
    if (eventData) {
      console.log('✅ Данные события получены:', eventData);
      
      // Проверяем авторство
      const currentUser = user?.username || 'anonymous';
      if (eventData.author !== currentUser) {
        console.warn('❌ Пользователь не является автором события');
        navigate('/events', { replace: true });
        return;
      }

      setOriginalEvent(eventData);
      
      // Преобразуем данные в формат формы
      const scheduledDate = eventData.metadata?.scheduledDate 
        ? new Date(eventData.metadata.scheduledDate) 
        : new Date(eventData.dateTime);
      
      const imageUrl = Array.isArray(eventData.mediaUrl) 
        ? (eventData.mediaUrl[0] || '') 
        : (eventData.mediaUrl || '');
      
      const formDataToSet: EventFormData = {
        eventName: eventData.title,
        description: eventData.description,
        content: eventData.content,
        eventType: eventData.eventType,
        emergencyType: eventData.emergencyType || null,
        eventDate: scheduledDate.toISOString().split('T')[0],
        eventTime: scheduledDate.toTimeString().slice(0, 5),
        location: eventData.metadata?.address || '',
        city: eventData.city,
        coordinates: {
          x: eventData.location.x,
          y: eventData.location.y
        },
        tags: eventData.tags || [],
        mediaUrl: imageUrl
      };
      
      console.log('📝 Устанавливаем данные формы:', formDataToSet);
      setFormData(formDataToSet);
    } else {
      console.error('❌ Не удалось загрузить данные события');
    }
  };

  // Инициализация карты
  const initializeMap = () => {
    if (mapRef.current || !formData.coordinates.x || !formData.coordinates.y) return;

    const mapContainer = document.getElementById('event-edit-map');
    if (!mapContainer) {
      console.error('❌ Контейнер карты не найден');
      return;
    }

    try {
      console.log('🗺️ Инициализируем карту с координатами:', formData.coordinates);
      
      mapRef.current = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [formData.coordinates.x, formData.coordinates.y],
        zoom: 12,
        attributionControl: false
      });

      mapRef.current.on('load', () => {
        console.log('✅ Карта загружена');
        setMapError('');
        setMapLoading(false);
      });

      mapRef.current.on('error', (e) => {
        console.error('❌ Ошибка карты:', e);
        setMapError('Ошибка загрузки карты');
        setMapLoading(false);
      });

      // Добавляем элементы управления
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Создаем маркер
      markerRef.current = new mapboxgl.Marker({ 
        draggable: true,
        color: '#FF6B98'
      })
        .setLngLat([formData.coordinates.x, formData.coordinates.y])
        .addTo(mapRef.current);

      // Обработчик перетаскивания маркера
      markerRef.current.on('dragend', async () => {
        if (markerRef.current) {
          const lngLat = markerRef.current.getLngLat();
          console.log('🗺️ Маркер перетащен:', lngLat);
          await updateLocationFromCoordinates(lngLat.lng, lngLat.lat);
        }
      });

      // Обработчик клика по карте
      mapRef.current.on('click', async (e) => {
        if (markerRef.current) {
          console.log('🗺️ Клик по карте:', e.lngLat);
          markerRef.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
          await updateLocationFromCoordinates(e.lngLat.lng, e.lngLat.lat);
        }
      });

    } catch (error) {
      console.error('❌ Ошибка инициализации карты:', error);
      setMapError('Ошибка инициализации карты');
      setMapLoading(false);
    }
  };

  // Обновление координат с получением адреса
  const updateLocationFromCoordinates = async (lng: number, lat: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: { x: lng, y: lat },
      location: '🔄 Получение адреса...'
    }));
    
    try {
      // Простое обратное геокодирование через Mapbox
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=ru&limit=1&country=KZ`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const address = data.features[0].place_name || `${lng.toFixed(6)}, ${lat.toFixed(6)}`;
          setFormData(prev => ({
            ...prev,
            coordinates: { x: lng, y: lat },
            location: address
          }));
          return;
        }
      }
      
      // Fallback - показываем координаты
      setFormData(prev => ({
        ...prev,
        coordinates: { x: lng, y: lat },
        location: `${lng.toFixed(6)}, ${lat.toFixed(6)}`
      }));
    } catch (error) {
      console.error('❌ Ошибка геокодирования:', error);
      setFormData(prev => ({
        ...prev,
        coordinates: { x: lng, y: lat },
        location: `${lng.toFixed(6)}, ${lat.toFixed(6)}`
      }));
    }
  };

  // Обработчики изменений формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  // Обработчик изменения города
  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({ ...prev, city: cityName }));
    
    if (cityName) {
      // Используем геокодирование Mapbox для получения координат города
      geocodeCity(cityName);
    }
  };

  // Геокодирование города через Mapbox API
  const geocodeCity = async (cityName: string) => {
    try {
      console.log('🌍 Геокодирование города:', cityName);
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityName)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=KZ&language=ru`
      );
      
      if (!response.ok) {
        throw new Error(`Ошибка геокодирования: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        console.log('📍 Найдены координаты:', { lng, lat });

        // Обновляем карту
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 12,
            duration: 2000
          });
        }

        // Перемещаем маркер
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        }

        // Обновляем координаты и получаем адрес
        await updateLocationFromCoordinates(lng, lat);
      } else {
        console.warn('🤷 Город не найден через геокодирование');
      }
    } catch (error) {
      console.error('❌ Ошибка геокодирования города:', error);
    }
  };

  // Загрузка фото
  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const mediaUrl = await uploadMedia(file);
      if (mediaUrl) {
        setFormData(prev => ({
          ...prev,
          mediaUrl
        }));
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки фото:', error);
    } finally {
      setUploading(false);
    }
  };

  // Удаление фото (простое - просто очищаем поле)
  const handlePhotoDelete = async () => {
    setFormData(prev => ({
      ...prev,
      mediaUrl: ''
    }));
  };

  // Сохранение события
// Исправленный метод handleSubmit в EventEditPage.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!originalEvent || !eventId) {
    console.error('❌ Отсутствуют данные события');
    return;
  }
  
  // Создаем дату события в правильном формате
  const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`);
  
  // Формируем данные для обновления в соответствии со схемой API
  const updateData: EventUpdateData = {
    // Обязательные поля
    eventType: formData.eventType,
    emergencyType: formData.emergencyType,
    title: formData.eventName,
    description: formData.description,
    content: formData.content,
    author: originalEvent.author,
    city: formData.city,
    location: {
      x: formData.coordinates.x,
      y: formData.coordinates.y
    },
    mediaUrl: formData.mediaUrl ? [formData.mediaUrl] : [],
    dateTime: eventDateTime.toISOString(),
    tags: formData.tags,
    usersIds: originalEvent.usersIds || [],
    
    // Дополнительные поля из оригинального события
    score: originalEvent.score || [],
    eventStatus: originalEvent.eventStatus || null,
    metadata: {
      address: formData.location,
      scheduledDate: eventDateTime.toISOString(),
      createdAt: originalEvent.metadata?.createdAt || new Date().toISOString(),
      isCommunity: originalEvent.metadata?.isCommunity || "false",
      // Сохраняем другие поля metadata
      ...originalEvent.metadata
    },
    comments: originalEvent.comments || [],
    archived: originalEvent.archived || false
  };

  console.log('📤 Отправляем данные обновления:', updateData);
  
  // Передаем eventId как первый параметр
  const success = await updateEvent(eventId, updateData);
  if (success) {
    console.log('✅ Событие обновлено');
    navigate(`/events/${eventId}`);
  }
};

  // Удаление события (заглушка)
  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить это событие?')) {
      return;
    }
    
    // Поскольку у нас нет API для удаления, просто переходим к списку
    console.log('🗑️ Удаление события (заглушка)');
    navigate('/events');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Проверки
  if (!eventId) {
    return (
      <div className={styles.eventEditPage}>
        <div className={styles.mainContainer}>
          <div className={styles.error}>
            <h2>Ошибка</h2>
            <p>ID события не найден</p>
            <button onClick={() => navigate('/events')}>К списку событий</button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.eventEditPage}>
        <div className={styles.mainContainer}>
          <div className={styles.error}>
            <h2>Требуется авторизация</h2>
            <p>Для редактирования события необходимо войти в систему</p>
            <button onClick={() => navigate('/login')}>Войти</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !originalEvent) {
    return (
      <div className={styles.eventEditPage}>
        <div className={styles.mainContainer}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка события...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.eventEditPage}>
        <div className={styles.mainContainer}>
          <div className={styles.error}>
            <h2>Ошибка</h2>
            <p>{error}</p>
            <button onClick={() => navigate(-1)}>Назад</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventEditPage}>
      <div className={styles.mainContainer}>
        <PageHeader 
          title="Редактирование события" 
          subtitle="Обновите информацию о вашем событии" 
        />

        <div className={styles.eventFormContainer}>
          <form onSubmit={handleSubmit}>
            
            {/* Основная информация */}
            <FormSection title="Основная информация">
              <FormGroup fullWidth>
                <label htmlFor="eventName">Название события *</label>
                <input 
                  type="text" 
                  id="eventName" 
                  name="eventName" 
                  value={formData.eventName} 
                  onChange={handleChange}
                  required 
                  className={styles.input}
                />
                <div className={styles.hints}>Краткое и понятное название события</div>
              </FormGroup>
              
              <EventPhoto 
                imageUrl={formData.mediaUrl}
                onPhotoUpload={handlePhotoUpload}
                onPhotoDelete={handlePhotoDelete}
                uploading={uploading}
              />
              
              <FormGroup fullWidth>
                <label htmlFor="description">Краткое описание *</label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={3} 
                  value={formData.description} 
                  onChange={handleChange}
                  required 
                  className={styles.textarea}
                />
                <div className={styles.hints}>Краткое описание для карточки события</div>
              </FormGroup>

              <FormGroup fullWidth>
                <label htmlFor="content">Подробное описание *</label>
                <textarea 
                  id="content" 
                  name="content" 
                  rows={6} 
                  value={formData.content} 
                  onChange={handleChange}
                  required 
                  className={styles.textarea}
                />
                <div className={styles.hints}>Детальное описание: программа, правила, требования</div>
              </FormGroup>
            </FormSection>

            {/* Детали события */}
            <FormSection title="Детали события">
              <FormRow>
                <FormGroup>
                  <label htmlFor="eventType">Тип события</label>
                  <select 
                    id="eventType" 
                    name="eventType" 
                    value={formData.eventType} 
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="REGULAR">Обычное</option>
                    <option value="EMERGENCY">Экстренное</option>
                  </select>
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="city">Город *</label>
                  <CitySelect
                    value={formData.city}
                    onChange={handleCityChange}
                    placeholder="Выберите город"
                    required
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <label htmlFor="eventDate">Дата *</label>
                  <input 
                    type="date" 
                    id="eventDate" 
                    name="eventDate" 
                    value={formData.eventDate} 
                    onChange={handleChange}
                    required 
                    className={styles.input}
                  />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="eventTime">Время *</label>
                  <input 
                    type="time" 
                    id="eventTime" 
                    name="eventTime" 
                    value={formData.eventTime} 
                    onChange={handleChange}
                    required 
                    className={styles.input}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup fullWidth>
                <label htmlFor="tags">Теги</label>
                <input 
                  type="text" 
                  id="tags" 
                  name="tags" 
                  value={formData.tags.join(', ')} 
                  onChange={handleTagsChange}
                  className={styles.input}
                  placeholder="спорт, футбол, командная игра"
                />
                <div className={styles.hints}>Теги через запятую для поиска и фильтрации</div>
              </FormGroup>
            </FormSection>

            {/* Локация */}
            <FormSection title="Место проведения">
              <FormGroup fullWidth>
                <label htmlFor="location">Адрес *</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                  required 
                  className={styles.input}
                  placeholder="Укажите точный адрес"
                />
                <div className={styles.hints}>Точный адрес поможет участникам найти место</div>
              </FormGroup>
              
              {/* Карта */}
              <div className={styles.mapSection}>
                <label className={styles.label}>Расположение на карте</label>
                
                {mapLoading && !mapError && (
                  <div className={styles.mapLoading}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка карты...</p>
                  </div>
                )}
                
                <div
                  id="event-edit-map"
                  className={styles.mapContainer}
                  style={{ 
                    display: mapError ? 'none' : 'block',
                    opacity: mapLoading ? 0.5 : 1
                  }}
                />
                
                {mapError && (
                  <div className={styles.mapError}>
                    <p>🗺️ {mapError}</p>
                    <p>Координаты: {formData.coordinates.x.toFixed(6)}, {formData.coordinates.y.toFixed(6)}</p>
                  </div>
                )}
                
                <div className={styles.mapHints}>
                  • Кликните по карте или перетащите маркер для выбора точного места
                  <br />
                  • Выбор города автоматически обновит положение карты
                </div>
              </div>
            </FormSection>

            <FormButtons
              onCancel={handleCancel}
              onDelete={handleDelete}
              loading={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventEditPage;