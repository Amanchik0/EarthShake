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
const TWOGIS_API_KEY = '8b4cc23d-1ab4-4868-a785-3c14a80ead0c';

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
  const { 
    loading, 
    error, 
    loadEvent, 
    updateEvent, 
    deleteEvent, 
    uploadMedia, 
    deleteMedia, 
    clearError 
  } = useEventAPI();

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
    coordinates: { x: 76.886, y: 43.238 }, // Алматы по умолчанию
    tags: [],
    mediaUrl: ''
  });

  // Cleanup при размонтировании
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
      console.log('🔄 useEffect: загружаем событие с ID:', eventId);
      loadEventData(eventId);
    }
  }, [eventId]);

  // Отслеживаем изменения formData для отладки
  useEffect(() => {
    console.log('📝 formData изменились:', formData);
  }, [formData]);

  const loadEventData = async (id: string) => {
    console.log('🔍 Загружаем событие с ID:', id);
    const eventData = await loadEvent(id);
    
    if (eventData) {
      console.log('✅ Полученные данные события:', eventData);
      
      // Проверяем, является ли текущий пользователь автором события
      const currentUser = user?.username || 'anonymous';
      console.log('👤 Текущий пользователь:', currentUser);
      console.log('✍️ Автор события:', eventData.author);
      
      if (eventData.author !== currentUser) {
        console.warn('❌ Пользователь не является автором события');
        navigate('/events', { replace: true });
        return;
      }

      setOriginalEvent(eventData);
      
      // Преобразуем данные с бэкенда в формат формы
      const scheduledDate = eventData.metadata?.scheduledDate 
        ? new Date(eventData.metadata.scheduledDate) 
        : new Date(eventData.dateTime);
      
      console.log('📅 Дата события:', scheduledDate);
      console.log('📍 Координаты:', eventData.location);
      console.log('🏙️ Город:', eventData.city);
      console.log('🖼️ MediaUrl:', eventData.mediaUrl);
      
      const formDataToSet = {
        eventName: eventData.title,
        description: eventData.description,
        content: eventData.content,
        eventType: eventData.eventType,
        emergencyType: eventData.emergencyType,
        eventDate: scheduledDate.toISOString().split('T')[0],
        eventTime: scheduledDate.toTimeString().slice(0, 5),
        location: eventData.metadata?.address || '',
        city: eventData.city,
        coordinates: {
          x: eventData.location.x,
          y: eventData.location.y
        },
        tags: eventData.tags,
        mediaUrl: Array.isArray(eventData.mediaUrl) ? eventData.mediaUrl[0] || '' : eventData.mediaUrl || ''
      };
      
      console.log('📝 Данные формы после преобразования:', formDataToSet);
      setFormData(formDataToSet);
    } else {
      console.error('❌ Не удалось загрузить данные события');
    }
  };

  // Callback ref для карты
  const mapCallbackRef = React.useCallback((node: HTMLDivElement | null) => {
    console.log('🗺️ Callback карты вызван:', { node: !!node, mapExists: !!mapRef.current, eventLoaded: !!originalEvent });
    if (node && !mapRef.current && formData.coordinates.x && formData.coordinates.y) {
      console.log('🗺️ Инициализируем карту с координатами:', formData.coordinates);
      setTimeout(() => {
        initializeMapFromCallback(node);
      }, 100);
    }
  }, [formData.coordinates, originalEvent]);

  // Инициализация карты
  const initializeMapFromCallback = (container: HTMLDivElement) => {
    if (mapRef.current) return;

    try {
      console.log('🗺️ Начинаем инициализацию карты...');
      console.log('🗺️ Координаты для карты:', formData.coordinates);
      
      container.style.width = '100%';
      container.style.height = '350px';
      container.style.minHeight = '350px';
      container.style.display = 'block';

      const rect = container.getBoundingClientRect();
      console.log('🗺️ Размеры контейнера:', rect);
      
      if (rect.width === 0 || rect.height === 0) {
        setMapError('Контейнер карты имеет нулевые размеры');
        setMapLoading(false);
        return;
      }

      mapRef.current = new mapboxgl.Map({
        container: container,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [formData.coordinates.x, formData.coordinates.y],
        zoom: 12,
        attributionControl: false
      });

      console.log('🗺️ Карта создана, настраиваем обработчики...');
      setupMapHandlers();
      
    } catch (error) {
      console.error('❌ Ошибка инициализации карты:', error);
      setMapError(`Ошибка карты: ${error instanceof Error ? error.message : String(error)}`);
      setMapLoading(false);
    }
  };

  const setupMapHandlers = () => {
    if (!mapRef.current) return;

    console.log('🗺️ Настраиваем обработчики карты...');

    mapRef.current.on('load', () => {
      console.log('✅ Карта загружена успешно');
      setMapError('');
      setMapLoading(false);
    });

    mapRef.current.on('error', (e) => {
      console.error('❌ Ошибка карты:', e);
      setMapError(`Ошибка карты: ${e.error?.message || 'Неизвестная ошибка'}`);
      setMapLoading(false);
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    console.log('🗺️ Создаем маркер на координатах:', [formData.coordinates.x, formData.coordinates.y]);
    markerRef.current = new mapboxgl.Marker({ 
      draggable: true,
      color: '#FF6B98'
    })
      .setLngLat([formData.coordinates.x, formData.coordinates.y])
      .addTo(mapRef.current);

    markerRef.current.on('dragend', async () => {
      if (markerRef.current) {
        const lngLat = markerRef.current.getLngLat();
        console.log('🗺️ Маркер перетащен на:', lngLat);
        await updateLocationFromCoordinates(lngLat.lng, lngLat.lat);
      }
    });

    mapRef.current.on('click', async (e) => {
      if (markerRef.current) {
        console.log('🗺️ Клик по карте:', e.lngLat);
        markerRef.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        await updateLocationFromCoordinates(e.lngLat.lng, e.lngLat.lat);
      }
    });
  };

  // Обратное геокодирование через 2GIS
  const reverseGeocode2GIS = async (lng: number, lat: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://catalog.api.2gis.com/3.0/items/geocode?lat=${lat}&lon=${lng}&key=${TWOGIS_API_KEY}&fields=items.address_name,items.full_name,items.point&radius=1000`
      );
      
      if (!response.ok) {
        throw new Error(`2GIS API error: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.result && data.result.items && data.result.items.length > 0) {
        const item = data.result.items[0];
        let address = '';
        if (item.address_name) {
          address = item.address_name;
        } else if (item.full_name) {
          address = item.full_name;
        } else if (item.name) {
          address = item.name;
        }
        
        if (address) {
          return address;
        }
      }
      
      throw new Error('No address found in 2GIS response');
    } catch (error) {
      throw error;
    }
  };

  // Fallback через Mapbox
  const reverseGeocodeMapbox = async (lng: number, lat: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=ru&types=address,poi,place,locality,neighborhood&limit=1&country=KZ`
      );
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        let addressParts: string[] = [];
        
        if (feature.address && feature.text) {
          addressParts.push(`${feature.text}, ${feature.address}`);
        } else if (feature.text) {
          addressParts.push(feature.text);
        }
        
        if (feature.context && Array.isArray(feature.context)) {
          const city = feature.context.find((ctx: any) => ctx.id && ctx.id.includes('place'));
          if (city && city.text) {
            addressParts.push(city.text);
          }
        }
        
        const uniqueAddressParts = [...new Set(addressParts)];
        return uniqueAddressParts.join(', ') || `Координаты: ${lng.toFixed(6)}, ${lat.toFixed(6)}`;
      }
      
      throw new Error('No address found in Mapbox response');
    } catch (error) {
      throw error;
    }
  };

  // Основная функция обратного геокодирования
  const reverseGeocode = async (lng: number, lat: number): Promise<string> => {
    try {
      return await reverseGeocode2GIS(lng, lat);
    } catch (error) {
      try {
        return await reverseGeocodeMapbox(lng, lat);
      } catch (fallbackError) {
        return `Координаты: ${lng.toFixed(6)}, ${lat.toFixed(6)}`;
      }
    }
  };

  // Обновление локации с получением адреса
  const updateLocationFromCoordinates = async (lng: number, lat: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: { x: lng, y: lat },
      location: '🔄 Получение адреса...'
    }));
    
    try {
      const address = await reverseGeocode(lng, lat);
      setFormData(prev => ({
        ...prev,
        coordinates: { x: lng, y: lat },
        location: address
      }));
    } catch (error) {
      console.error('Ошибка получения адреса:', error);
      setFormData(prev => ({
        ...prev,
        coordinates: { x: lng, y: lat },
        location: `Координаты: ${lng.toFixed(6)}, ${lat.toFixed(6)}`
      }));
    }
  };

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

  // Обработчик изменения города с геокодированием
  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({ ...prev, city: cityName }));
    if (cityName) {
      geocodeCity(cityName);
    }
  };

  // Геокодирование города
  const geocodeCity = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=KZ`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 12
          });
        }

        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        }

        await updateLocationFromCoordinates(lng, lat);
      }
    } catch (error) {
      console.error('Ошибка геокодирования города:', error);
    }
  };

  // Загрузка фото
  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    const mediaUrl = await uploadMedia(file);
    setUploading(false);
    
    if (mediaUrl) {
      setFormData(prev => ({
        ...prev,
        mediaUrl
      }));
    }
  };

  // Удаление фото
  const handlePhotoDelete = async () => {
    if (!formData.mediaUrl) return;

    // Извлекаем имя файла из URL
    const fileName = formData.mediaUrl.split('/').pop();
    if (!fileName) return;

    const success = await deleteMedia(fileName);
    if (success) {
      setFormData(prev => ({
        ...prev,
        mediaUrl: ''
      }));
    }
  };

  // Сохранение события
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalEvent || !eventId) {
      console.error('❌ Отсутствуют данные события или ID');
      return;
    }
    
    console.log('📤 Начинаем сохранение события...');
    console.log('📋 Исходные данные события:', originalEvent);
    console.log('📝 Данные формы:', formData);
    
    // Создаем дату и время события
    const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`);
    console.log('📅 Созданная дата/время:', eventDateTime.toISOString());
    
    // Формируем ПОЛНЫЙ объект с сохранением всех оригинальных данных
    const updateData: EventUpdateData = {
      // Берем все из оригинального события
      id: originalEvent.id,
      author: originalEvent.author,
      score: originalEvent.score,
      eventStatus: originalEvent.eventStatus,
      usersIds: originalEvent.usersIds || [],
      comments: originalEvent.comments || [],
      archived: originalEvent.archived,
      // Перезаписываем только изменяемые поля
      eventType: formData.eventType,
      emergencyType: formData.emergencyType,
      title: formData.eventName,
      description: formData.description,
      content: formData.content,
      city: formData.city,
      location: {
        x: formData.coordinates.x,
        y: formData.coordinates.y
      },
      mediaUrl: formData.mediaUrl || '', // Обеспечиваем строку
      dateTime: eventDateTime.toISOString(),
      tags: formData.tags,
      metadata: {
        ...originalEvent.metadata,
        address: formData.location,
        scheduledDate: eventDateTime.toISOString()
      }
    };

    console.log('📤 Отправляем ПОЛНЫЕ данные для обновления события:', JSON.stringify(updateData, null, 2));
    
    const success = await updateEvent(updateData);
    if (success) {
      console.log('✅ Событие успешно обновлено');
      navigate(`/events/${eventId}`);
    } else {
      console.error('❌ Не удалось обновить событие');
    }
  };

  // Удаление события
  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить это событие?')) {
      return;
    }

    if (!eventId) return;
    
    const success = await deleteEvent(eventId);
    if (success) {
      navigate('/events');
    }
  };

  const handleCancel = () => {
    navigate(-1); // Возвращаемся назад
  };

  // Проверяем наличие eventId и авторизации
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
            <h2>Ошибка</h2>
            <p>Для редактирования события необходимо войти в систему</p>
            <button onClick={() => navigate('/login')}>Войти</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.eventEditPage}>
        <div className={styles.mainContainer}>
          <div className={styles.loading}>Загрузка...</div>
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
          subtitle="Заполните все поля для обновления информации о событии" 
        />

        <div className={styles.eventFormContainer}>
          <form className="event-form" onSubmit={handleSubmit}>
            <FormSection title="Основная информация">
              <FormGroup fullWidth>
                <label htmlFor="eventName">Название события</label>
                <input 
                  type="text" 
                  id="eventName" 
                  name="eventName" 
                  value={formData.eventName} 
                  onChange={handleChange}
                  required 
                />
                <div className={styles.hints}>Укажите краткое и информативное название</div>
              </FormGroup>
              
              <EventPhoto 
                imageUrl={formData.mediaUrl}
                onPhotoUpload={handlePhotoUpload}
                onPhotoDelete={handlePhotoDelete}
                uploading={uploading}
              />
              
              <FormGroup fullWidth>
                <label htmlFor="description">Краткое описание</label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={3} 
                  value={formData.description} 
                  onChange={handleChange}
                  required 
                />
                <div className={styles.hints}>Краткое описание события для предварительного просмотра</div>
              </FormGroup>

              <FormGroup fullWidth>
                <label htmlFor="content">Подробное описание</label>
                <textarea 
                  id="content" 
                  name="content" 
                  rows={5} 
                  value={formData.content} 
                  onChange={handleChange}
                  required 
                />
                <div className={styles.hints}>Подробно опишите событие: что будет происходить, для кого оно предназначено</div>
              </FormGroup>
            </FormSection>

            <FormSection title="Детали события">
              <FormRow>
                <FormGroup>
                  <label htmlFor="eventType">Тип события</label>
                  <select 
                    id="eventType" 
                    name="eventType" 
                    value={formData.eventType} 
                    onChange={handleChange}
                  >
                    <option value="REGULAR">Обычное</option>
                    <option value="EMERGENCY">Экстренное</option>
                  </select>
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="city">Город</label>
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
                  <label htmlFor="eventDate">Дата</label>
                  <input 
                    type="date" 
                    id="eventDate" 
                    name="eventDate" 
                    value={formData.eventDate} 
                    onChange={handleChange}
                    required 
                  />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="eventTime">Время начала</label>
                  <input 
                    type="time" 
                    id="eventTime" 
                    name="eventTime" 
                    value={formData.eventTime} 
                    onChange={handleChange}
                    required 
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
                />
                <div className={styles.hints}>Введите теги через запятую (например: музыка, развлечения, концерт)</div>
              </FormGroup>
            </FormSection>

            <FormSection title="Локация">
              <FormGroup fullWidth>
                <label htmlFor="location">Адрес</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                  required 
                />
              </FormGroup>
              
              {/* Карта */}
              <div className={styles.mapSection}>
                <label className={styles.label}>Место проведения события</label>
                
                {/* Отладочная информация */}
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                  Debug: Координаты X={formData.coordinates.x}, Y={formData.coordinates.y}, 
                  Event loaded: {originalEvent ? 'да' : 'нет'}, 
                  Map loading: {mapLoading ? 'да' : 'нет'}
                </div>
                
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
                        value={formData.coordinates.x}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          coordinates: { ...prev.coordinates, x: parseFloat(e.target.value) || 0 }
                        }))}
                        className={styles.input}
                      />
                      <input
                        type="number"
                        placeholder="Широта (lat)"
                        step="any"
                        value={formData.coordinates.y}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          coordinates: { ...prev.coordinates, y: parseFloat(e.target.value) || 0 }
                        }))}
                        className={styles.input}
                      />
                    </div>
                  </div>
                )}
                
                {/* Выбранный адрес */}
                {formData.location && (
                  <div className={styles.selectedAddress}>
                    📍 {formData.location}
                  </div>
                )}
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