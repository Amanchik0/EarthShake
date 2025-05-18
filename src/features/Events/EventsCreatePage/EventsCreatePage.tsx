import React, { useState, useEffect, useRef } from 'react';
import { EventDetails } from '../../../types/event';
import styles from './EventCreatePage.module.css';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW56b24iLCJhIjoiY202cWFhNW5qMGViaDJtc2J2eXhtZTdraCJ9.V7DT16ZhFkjt88aEWYRNiw';
mapboxgl.accessToken = MAPBOX_TOKEN;
const DEFAULT_CENTER: [number, number] = [73.3673, 48.0196];

const EventCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const [formData, setFormData] = useState<Partial<EventDetails>>({
    title: '',
    description: '',
    imageUrl: '',
    date: '',
    city: '',
    type: '',
    tag: 'regular',
    lat: 0,
    lng: 0,
    author: {
      name: '',
      role: '',
      avatarUrl: ''
    },
    price: '',
  });


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (map.current) return; // Инициализируем карту только один раз

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: DEFAULT_CENTER,
        zoom: 10
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Добавляем стандартную кнопку геолокации Mapbox (как в MapComponent)
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true
      });
      map.current.addControl(geolocate, 'top-right');

      // Маркер для выбора места события
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat(DEFAULT_CENTER)
        .addTo(map.current);

      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          setFormData(prev => ({
            ...prev,
            lat: lngLat.lat,
            lng: lngLat.lng
          }));
        }
      });

      map.current.on('click', (e) => {
        if (marker.current) {
          marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
          setFormData(prev => ({
            ...prev,
            lat: e.lngLat.lat,
            lng: e.lngLat.lng
          }));
        }
      });
    }
  }, []);

  const geocodeCity = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
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

        setFormData(prev => ({
          ...prev,
          lat: lat,
          lng: lng
        }));
      }
    } catch (error) {
      console.error('Error geocoding city:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      // Handle nested properties like 'author.name'
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear errors when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fakeUrl = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({ ...prev, imageUrl: fakeUrl }));
    }
  };

  const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fakeUrl = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({
        ...prev,
        author: {
          ...prev.author!,
          avatarUrl: fakeUrl
        }
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.city || formData.city.trim() === '') {
      newErrors.city = 'City is required';
    }

    if (!formData.type || formData.type.trim() === '') {
      newErrors.type = 'Event type is required';
    }

    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Event image is required';
    }

    if (!formData.author?.name || formData.author.name.trim() === '') {
      newErrors['author.name'] = 'Author name is required';
    }

    if (!formData.author?.avatarUrl) {
      newErrors['author.avatarUrl'] = 'Author avatar is required';
    }

    if (formData.lat === 0 && formData.lng === 0) {
      newErrors.location = 'Please select a location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotificationMessage('Please fix the errors before submitting', false);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Загружаем фото события
      let mediaId = '';
      if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
        const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const formDataImg = new FormData();
          formDataImg.append('file', fileInput.files[0]);
          const uploadRes = await fetch('http://localhost:8090/api/media/upload', {
            method: 'POST',
            body: formDataImg,
          });
          if (!uploadRes.ok) throw new Error('Ошибка загрузки фото');
          const imageUrl = await uploadRes.text();
          mediaId = imageUrl.split('/').pop() || '';
        }
      }

      // 2. Собираем данные для события
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        content: formData.description,
        author: formData.author?.name,
        city: formData.city,
        location: {
          x: formData.lng,
          y: formData.lat,
        },
        mediaUrl: mediaId ? `/api/media/${mediaId}` : '',
        eventStatus: 'RESOLVED',
        tags: [formData.type, formData.tag].filter(Boolean),
      };

      // 3. Отправляем событие
      const response = await fetch('http://localhost:8090/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) throw new Error('Ошибка создания события');
      const result = await response.json();

      showNotificationMessage('Event created successfully!', true);
      setTimeout(() => {
        navigate(`/events/${result.id || 'list'}`);
      }, 1500);

    } catch (error) {
      console.error('Error creating event:', error);
      showNotificationMessage('Failed to create event. Please try again.', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotificationMessage = (message: string, success: boolean) => {
    setNotificationMessage(message);
    setIsSuccess(success);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.sectionTitle}>Create New Event</div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                <img
                  src={formData.imageUrl || "/api/placeholder/150/150"}
                  alt="Event cover"
                  className={styles.profileImage}
                />
                <label htmlFor="imageUpload" className={styles.imageUpload}>
                  <i className="fas fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {errors.imageUrl && <div className={styles.errorText}>{errors.imageUrl}</div>}
              </div>

              <div className={styles.profileInfo}>
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>Event Title*</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                    placeholder="Enter event title"
                  />
                  {errors.title && <div className={styles.errorText}>{errors.title}</div>}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <label htmlFor="date" className={styles.label}>Event Date*</label>
                    <input
                      type="datetime-local"
                      id="date"
                      name="date"
                      value={formData.date || ''}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                    />
                    {errors.date && <div className={styles.errorText}>{errors.date}</div>}
                  </div>

                  <div className={styles.formCol}>
                    <label htmlFor="type" className={styles.label}>Event Type*</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type || ''}
                      onChange={handleInputChange}
                      className={`${styles.select} ${errors.type ? styles.inputError : ''}`}
                    >
                      <option value="">Select event type</option>
                      <option value="concert">Concert</option>
                      <option value="conference">Conference</option>
                      <option value="exhibition">Exhibition</option>
                      <option value="workshop">Workshop</option>
                      <option value="festival">Festival</option>
                      <option value="meetup">Meetup</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.type && <div className={styles.errorText}>{errors.type}</div>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <label htmlFor="city" className={styles.label}>City*</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                      placeholder="City name"
                    />
                    {errors.city && <div className={styles.errorText}>{errors.city}</div>}
                  </div>

                  <div className={styles.formCol}>
                    <label htmlFor="tag" className={styles.label}>Event Tag</label>
                    <select
                      id="tag"
                      name="tag"
                      value={formData.tag || 'regular'}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="regular">Regular</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>Price (optional)</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Free or price amount"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Description*</label>
              <textarea
                id="description"
                name="description"
                value={typeof formData.description === 'string' ? formData.description : ''}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                placeholder="Describe your event in detail"
              />
              {errors.description && <div className={styles.errorText}>{errors.description}</div>}
            </div>

            <div className={styles.mapSection}>
              <label className={styles.label}>Event Location*</label>
              <div
                ref={mapContainer}
                className={styles.mapContainer}
              />
              {errors.location && <div className={styles.errorText}>{errors.location}</div>}
              <div className={styles.mapInstructions}>
                Кликните по карте или перетащите маркер для выбора места события. Для показа своего положения используйте кнопку на карте.
              </div>
            </div>

            <div className={styles.authorSection}>
              <div className={styles.subsectionTitle}>Event Organizer Information</div>

              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <div className={styles.authorImageContainer}>
                    <img
                      src={formData.author?.avatarUrl || "/api/placeholder/80/80"}
                      alt="Author avatar"
                      className={styles.authorImage}
                    />
                    <label htmlFor="authorImageUpload" className={styles.imageUpload}>
                      <i className="fas fa-camera"></i>
                    </label>
                    <input
                      type="file"
                      id="authorImageUpload"
                      accept="image/*"
                      onChange={handleAuthorImageChange}
                      style={{ display: 'none' }}
                    />
                    {errors['author.avatarUrl'] && <div className={styles.errorText}>{errors['author.avatarUrl']}</div>}
                  </div>
                </div>

                <div className={styles.formCol}>
                  <div className={styles.formGroup}>
                    <label htmlFor="author.name" className={styles.label}>Organizer Name*</label>
                    <input
                      type="text"
                      id="author.name"
                      name="author.name"
                      value={formData.author?.name || ''}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors['author.name'] ? styles.inputError : ''}`}
                      placeholder="Enter organizer name"
                    />
                    {errors['author.name'] && <div className={styles.errorText}>{errors['author.name']}</div>}
                  </div>
                </div>

                <div className={styles.formCol}>
                  <div className={styles.formGroup}>
                    <label htmlFor="author.role" className={styles.label}>Organizer Role</label>
                    <input
                      type="text"
                      id="author.role"
                      name="author.role"
                      value={formData.author?.role || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter organizer role (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="terms" name="terms" />
              <label htmlFor="terms">I agree to the event guidelines and terms of service</label>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
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