import React, { useState } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import ProfilePhotoUpload from '../../components/ProfileEdit/ProfilePhotoUpload';
import ProfileForm from '../../components/ProfileEdit/ProfileForm';
import { ProfileFormData, FullProfile } from '../../types/profile';
import styles from './ProfileEditPage.module.css';

interface ProfileEditPageProps {
  initialData: ProfileFormData;
  currentProfile: FullProfile;
  onClose: () => void;
  onSubmit: (updatedProfile: FullProfile) => Promise<void>;
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ 
  initialData, 
  currentProfile, 
  onClose, 
  onSubmit 
}) => {
  const { user, isLoading } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string>(initialData.imageUrl || '');
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Проверка уникальности username
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (username === currentProfile.username) {
      return true; // Текущий username всегда доступен
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://localhost:8090/api/users/get-by-username/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        const userData = await response.json();
        // Если userData не null и не пустой, значит username занят
        return userData === null || userData === undefined;
      } else if (response.status === 404) {
        // 404 означает, что пользователь не найден - username свободен
        return true;
      } else {
        // Другие ошибки - считаем username недоступным для безопасности
        return false;
      }
    } catch (error) {
      console.error('Ошибка проверки username:', error);
      return false;
    }
  };

  // Валидация формы
  const validateForm = async (data: ProfileFormData): Promise<Record<string, string>> => {
    const errors: Record<string, string> = {};

    // Проверка username
    if (!data.username.trim()) {
      errors.username = 'Username обязателен для заполнения';
    } else if (data.username.length < 3) {
      errors.username = 'Username должен содержать минимум 3 символа';
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      errors.username = 'Username может содержать только буквы, цифры и подчеркивания';
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Некорректный формат email';
    }

    // Проверка телефона (если заполнен)
    if (data.phoneNumber) {
      const phoneRegex = /^\+?[1-9]\d{10,14}$/;
      if (!phoneRegex.test(data.phoneNumber.replace(/\s/g, ''))) {
        errors.phoneNumber = 'Некорректный формат телефона';
      }
    }

    // Проверка паролей
    if (data.newPassword) {
      if (data.newPassword.length < 6) {
        errors.newPassword = 'Пароль должен содержать минимум 6 символов';
      }
      if (data.newPassword !== data.confirmNewPassword) {
        errors.confirmNewPassword = 'Пароли не совпадают';
      }
      if (!data.currentPassword) {
        errors.currentPassword = 'Введите текущий пароль для смены';
      }
    }

    // Проверка имени
    if (!data.firstName.trim()) {
      errors.firstName = 'Имя обязательно для заполнения';
    }

    // Проверка города
    if (!data.city.trim()) {
      errors.city = 'Город обязателен для заполнения';
    }

    return errors;
  };

  // Загрузка фото
  const handlePhotoChange = async (file: File): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    const fd = new FormData();
    fd.append('file', file);
    
    try {
      const res = await fetch('http://localhost:8090/api/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Неизвестная ошибка');
        throw new Error(`Ошибка загрузки изображения: ${res.status} - ${errorText}`);
      }
      
      // API возвращает строку с URL, а не JSON
      const responseText = await res.text();
      console.log('Response from API:', responseText); // Для отладки
      
      // Если ответ уже содержит полный URL
      let fullUrl = responseText;
      
      // Если ответ содержит только ID файла, формируем полный URL
      if (!responseText.startsWith('http')) {
        fullUrl = `http://localhost:8090/api/media/${responseText}`;
      }
      
      setPhotoUrl(fullUrl);
      setFormData(prev => ({ ...prev, imageUrl: fullUrl }));
      
      // Показываем уведомление об успешной загрузке
      const notification = document.createElement('div');
      notification.textContent = 'Фото успешно загружено!';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 1001;
        font-size: 14px;
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);
      
    } catch (err: any) {
      console.error('Ошибка загрузки фото:', err);
      
      // Показываем уведомление об ошибке
      const errorNotification = document.createElement('div');
      errorNotification.textContent = err.message || 'Не удалось загрузить фото';
      errorNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 1001;
        font-size: 14px;
      `;
      document.body.appendChild(errorNotification);
      
      setTimeout(() => {
        if (document.body.contains(errorNotification)) {
          document.body.removeChild(errorNotification);
        }
      }, 3000);
      
      throw err; // Пробрасываем ошибку для обработки в ProfilePhotoUpload
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) onClose();
  };

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Валидация
      const errors = await validateForm(data);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      // Проверка уникальности username (если изменился)
      if (data.username !== currentProfile.username) {
        const isAvailable = await checkUsernameAvailability(data.username);
        if (!isAvailable) {
          setValidationErrors({ username: 'Этот username уже занят' });
          return;
        }
      }

      // Формируем данные для API
      const updateData = {
        id: currentProfile.id,
        username: data.username, // Теперь username можно изменять
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        password: data.newPassword || currentProfile.password, // Если пароль не меняется, отправляем текущий
        role: currentProfile.role, // Не меняется
        city: data.city,
        imageUrl: photoUrl || currentProfile.imageUrl,
        phoneNumber: data.phoneNumber || null,
        registrationDate: currentProfile.registrationDate, // Не меняется
        metadata: {
          ...currentProfile.metadata,
          lastProfileUpdate: new Date().toISOString()
        },
        subscriber: currentProfile.subscriber // Меняется только при покупке подписки
      };

      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8090/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
      }

      const updatedProfile = await response.json() as FullProfile;
      await onSubmit(updatedProfile);
      onClose();
      
    } catch (err: any) {
      console.error('Ошибка обновления профиля:', err);
      alert(err.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Загрузка данных...</div>;

  return (
    <div className={styles.profileContainer}>
      <button
        type="button"
        className={styles.closeButton}
        aria-label="Закрыть"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        &times;
      </button>
      
      <h1>Редактирование профиля</h1>
      
      <div className={styles.content}>
        <ProfilePhotoUpload 
          photoUrl={photoUrl} 
          onPhotoChange={handlePhotoChange} 
        />
        
        <ProfileForm
          initialData={formData}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          validationErrors={validationErrors}
        />
      </div>
      
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}>Обновление профиля...</div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditPage;