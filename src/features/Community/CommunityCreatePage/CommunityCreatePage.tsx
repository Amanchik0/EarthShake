// CommunityCreatePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/auth/AuthContext';
import { useCommunityAPI } from '../../../hooks/useCommunityApi';
import CitySelect from '../../../components/CitySelect/CitySelect';
import { CommunityFormData } from '../../../types/community';
import styles from './CommunityCreatePage.module.css';

const CommunityCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, error, createCommunity, uploadCommunityImage, clearError } = useCommunityAPI();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<CommunityFormData>({
    name: '',
    description: '',
    content: '',
    category: '',
    city: '',
    location: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Проверка авторизации
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.profileSection}>
          <div className={styles.error}>
            <h2>Требуется авторизация</h2>
            <p>Для создания сообщества необходимо войти в систему</p>
            <button 
              className={styles.button}
              onClick={() => navigate('/login')}
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Очищаем ошибки при редактировании поля
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Очищаем общую ошибку API
    if (error) {
      clearError();
    }
  };

  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({ ...prev, city: cityName }));
    
    if (errors.city) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.city;
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setUploading(true);
      try {
        const imageUrl = await uploadCommunityImage(file);
        if (imageUrl) {
          setFormData((prev) => ({ ...prev, imageUrl }));
          
          // Очищаем ошибку изображения
          if (errors.imageUrl) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.imageUrl;
              return newErrors;
            });
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Название сообщества обязательно';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Название должно содержать минимум 3 символа';
    }
    
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Описание сообщества обязательно';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    }
    
    if (!formData.content || formData.content.trim() === '') {
      newErrors.content = 'Подробное описание обязательно';
    }
    
    if (!formData.category) {
      newErrors.category = 'Выберите категорию сообщества';
    }
    
    if (!formData.city) {
      newErrors.city = 'Выберите город';
    }
    
    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Загрузите изображение сообщества';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'Необходимо согласиться с условиями';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotificationMessage('Пожалуйста, исправьте ошибки в форме', 'error');
      return;
    }
    
    if (!user?.username) {
      showNotificationMessage('Ошибка авторизации', 'error');
      return;
    }
    
    try {
      const communityData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        imageUrls: [formData.imageUrl],
        type: formData.category,
        city: formData.city,
        author: user.username,
      };
      
      console.log('📤 Создаем сообщество:', communityData);
      
      const createdCommunity = await createCommunity(communityData);
      
      if (createdCommunity) {
        console.log(' Сообщество создано:', createdCommunity);
        showNotificationMessage('Сообщество успешно создано!', 'success');
        
        // Переходим на страницу созданного сообщества через 1.5 секунды
        setTimeout(() => {
          navigate(`/community/${createdCommunity.id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Ошибка создания сообщества:', error);
      showNotificationMessage('Не удалось создать сообщество. Попробуйте еще раз.', 'error');
    }
  };

  const showNotificationMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.sectionTitle}>Создание сообщества</div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            {/* Заголовок с изображением */}
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                <img 
                  src={formData.imageUrl || "/api/placeholder/150/150"} 
                  alt="Изображение сообщества" 
                  className={styles.profileImage} 
                />
                <label htmlFor="imageUpload" className={styles.imageUpload}>
                  {uploading ? (
                    <div className={styles.uploadingSpinner}></div>
                  ) : (
                    <i className="fas fa-camera"></i>
                  )}
                </label>
                <input 
                  type="file" 
                  id="imageUpload" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                {errors.imageUrl && <div className={styles.errorText}>{errors.imageUrl}</div>}
              </div>
              
              <div className={styles.profileInfo}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Название сообщества *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Введите название сообщества"
                    maxLength={100}
                  />
                  {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <label htmlFor="category" className={styles.label}>Категория *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                    >
                      <option value="">Выберите категорию</option>
                      <option value="технологии">Технологии</option>
                      <option value="искусство">Искусство и культура</option>
                      <option value="спорт">Спорт и фитнес</option>
                      <option value="образование">Образование</option>
                      <option value="социальное">Социальное</option>
                      <option value="бизнес">Бизнес и нетворкинг</option>
                      <option value="хобби">Хобби и развлечения</option>
                      <option value="другое">Другое</option>
                    </select>
                    {errors.category && <div className={styles.errorText}>{errors.category}</div>}
                  </div>
                  
                  <div className={styles.formCol}>
                    <label htmlFor="city" className={styles.label}>Город *</label>
                    <CitySelect
                      value={formData.city}
                      onChange={handleCityChange}
                      placeholder="Выберите город"
                      required
                    />
                    {errors.city && <div className={styles.errorText}>{errors.city}</div>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="location" className={styles.label}>Местоположение</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Район, улица (необязательно)"
                  />
                </div>
              </div>
            </div>
            
            {/* Описания */}
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Краткое описание *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                placeholder="Кратко расскажите о вашем сообществе (будет отображаться в карточке)"
                maxLength={500}
                rows={3}
              />
              <div className={styles.charCount}>
                {formData.description.length}/500
              </div>
              {errors.description && <div className={styles.errorText}>{errors.description}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="content" className={styles.label}>Подробное описание *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
                placeholder="Детально опишите ваше сообщество: цели, деятельность, правила участия, планы"
                rows={6}
                maxLength={2000}
              />
              <div className={styles.charCount}>
                {formData.content.length}/2000
              </div>
              {errors.content && <div className={styles.errorText}>{errors.content}</div>}
            </div>
            
            {/* Условия */}
            <div className={styles.checkboxGroup}>
              <input 
                type="checkbox" 
                id="terms" 
                name="terms"
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  if (errors.terms && e.target.checked) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.terms;
                      return newErrors;
                    });
                  }
                }}
              />
              <label htmlFor="terms">
                Я согласен с правилами сообщества и условиями использования платформы *
              </label>
              {errors.terms && <div className={styles.errorText}>{errors.terms}</div>}
            </div>
            
            {/* Ошибка API */}
            {error && (
              <div className={styles.apiError}>
                <strong>Ошибка:</strong> {error}
              </div>
            )}
            
            {/* Кнопки */}
            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={handleCancel}
                disabled={loading}
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className={styles.button}
                disabled={loading || uploading}
              >
                {loading ? 'Создание...' : 'Создать сообщество'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Уведомления */}
      {showNotification && (
        <div className={`${styles.notification} ${
          notificationType === 'success' ? styles.notificationSuccess : styles.notificationError
        }`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default CommunityCreatePage;