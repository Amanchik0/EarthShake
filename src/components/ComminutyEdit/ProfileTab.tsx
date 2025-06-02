// tabs/ProfileTab.tsx
import React, { useState, useEffect } from 'react';
import { Community } from '../../types/community';
import styles from '../../features/Community/CommunityEditPage/CommunityEditPage.module.css';

interface ProfileTabProps {
  community: Community;
  onSave: (updatedData: Partial<Community>) => void;
  onMessage: (message: string) => void;
  saving: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ 
  community, 
  onSave, 
  onMessage, 
  saving 
}) => {
  const [communityData, setCommunityData] = useState({
    name: '',
    description: '',
    content: '',
    type: '',
    city: '',
    imageUrls: ['']
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Инициализация данных при загрузке компонента
  useEffect(() => {
    if (community) {
      setCommunityData({
        name: community.name,
        description: community.description,
        content: community.content,
        type: community.type,
        city: community.city,
        imageUrls: community.imageUrls.length > 0 ? community.imageUrls : ['']
      });
      setImagePreview(community.imageUrls[0] || '/api/placeholder/150/150');
    }
  }, [community]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setCommunityData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      onMessage('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onMessage('Размер файла не должен превышать 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8090/api/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const imageUrl = await response.text(); // Предполагаем, что API возвращает URL как строку
      console.log('📸 Изображение загружено:', imageUrl);

      // Обновляем URL изображения
      const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8090${imageUrl}`;
      
      setCommunityData(prev => ({
        ...prev,
        imageUrls: [fullImageUrl, ...prev.imageUrls.slice(1)]
      }));
      
      setImagePreview(fullImageUrl);
      onMessage('Изображение успешно загружено!');

    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
      onMessage('Ошибка при загрузке изображения');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = () => {
    // Валидация
    if (!communityData.name.trim()) {
      onMessage('Название сообщества обязательно для заполнения');
      return;
    }

    if (!communityData.description.trim()) {
      onMessage('Описание сообщества обязательно для заполнения');
      return;
    }

    if (!communityData.city.trim()) {
      onMessage('Город обязателен для заполнения');
      return;
    }

    // Подготавливаем данные для сохранения
    const updatedData: Partial<Community> = {
      name: communityData.name.trim(),
      description: communityData.description.trim(),
      content: communityData.content.trim(),
      type: communityData.type,
      city: communityData.city.trim(),
      imageUrls: communityData.imageUrls.filter(url => url.trim() !== '')
    };

    onSave(updatedData);
  };

  const handleCancel = () => {
    // Восстанавливаем оригинальные данные
    setCommunityData({
      name: community.name,
      description: community.description,
      content: community.content,
      type: community.type,
      city: community.city,
      imageUrls: community.imageUrls.length > 0 ? community.imageUrls : ['']
    });
    setImagePreview(community.imageUrls[0] || '/api/placeholder/150/150');
    onMessage('Изменения отменены');
  };

  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionTitle}>Редактирование профиля</div>
      
      <div className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          <img 
            src={imagePreview} 
            alt="Логотип сообщества" 
            className={styles.profileImage} 
          />
          <label className={styles.imageUpload} title="Загрузить новое фото">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={uploadingImage}
            />
            {uploadingImage ? (
              <div className={styles.spinner} style={{ width: '16px', height: '16px' }}></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            )}
          </label>
        </div>
        
        <div className={styles.profileInfo}>
          <label htmlFor="name" className={styles.label}>
            Название сообщества *
          </label>
          <input 
            type="text" 
            id="name" 
            value={communityData.name} 
            onChange={handleChange}
            className={styles.input}
            maxLength={100}
            required
          />
          
          <label htmlFor="city" className={styles.label}>
            Город *
          </label>
          <input 
            type="text" 
            id="city" 
            value={communityData.city} 
            onChange={handleChange}
            className={styles.input}
            maxLength={50}
            required
          />
        </div>
      </div>
      
      <label htmlFor="description" className={styles.label}>
        Описание сообщества *
      </label>
      <textarea 
        id="description" 
        value={communityData.description} 
        onChange={handleChange}
        className={styles.textarea}
        maxLength={500}
        required
        placeholder="Опишите ваше сообщество, его цели и активности..."
      />
      
      <label htmlFor="content" className={styles.label}>
        Подробное описание
      </label>
      <textarea 
        id="content" 
        value={communityData.content} 
        onChange={handleChange}
        className={styles.textarea}
        maxLength={2000}
        placeholder="Дополнительная информация о сообществе..."
        style={{ minHeight: '120px' }}
      />
      
      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <label htmlFor="type" className={styles.label}>
            Категория *
          </label>
          <select 
            id="type" 
            value={communityData.type} 
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Выберите категорию</option>
            <option value="искусство">Искусство и творчество</option>
            <option value="спорт">Спорт и активный отдых</option>
            <option value="технологии">Технологии и IT</option>
            <option value="образование">Образование</option>
            <option value="социальное">Социальное</option>
            <option value="hobby">Хобби</option>
            <option value="бизнес">Бизнес</option>
            <option value="здоровье">Здоровье</option>
            <option value="другое">Другое</option>
          </select>
        </div>
      </div>
      
      <div className={styles.communityStats}>
        <div className={styles.sectionSubtitle}>Статистика сообщества</div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{community.numberMembers}</div>
            <div className={styles.statText}>Участников</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{community.eventsCount}</div>
            <div className={styles.statText}>События</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{community.rating.toFixed(1)}</div>
            <div className={styles.statText}>Рейтинг</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{community.reviewsCount}</div>
            <div className={styles.statText}>Отзывов</div>
          </div>
        </div>
      </div>
      
      <div className={styles.buttonGroup}>
        <button 
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={handleCancel}
          disabled={saving}
        >
          Отменить
        </button>
        <button 
          className={styles.button} 
          onClick={handleSave}
          disabled={saving || uploadingImage}
        >
          {saving ? (
            <>
              <div className={styles.spinner} style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
              Сохранение...
            </>
          ) : (
            'Сохранить изменения'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;