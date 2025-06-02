import React, { useState } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import ProfilePhotoUpload from '../../components/ProfileEdit/ProfilePhotoUpload';
import ProfileForm from '../../components/ProfileEdit/ProfileForm';
import UsernameWarning from './UsernameWarning/UsernameWarning';
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
  const [showUsernameWarning, setShowUsernameWarning] = useState<boolean>(false);
  const [pendingFormData, setPendingFormData] = useState<ProfileFormData | null>(null);

  // Функция обновления username во всех сообществах
  const updateUsernameInAllCommunities = async (oldUsername: string, newUsername: string) => {
    const result = { success: true, updatedCount: 0, errors: [] as string[] };
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8090/api/community/get-all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Ошибка получения сообществ: ${response.status}`);
      }

      const data = await response.json();
      const communities = data.content || [];

      console.log(`🔍 Проверяем ${communities.length} сообществ для обновления username`);

      for (const community of communities) {
        let needsUpdate = false;
        const updatedCommunity = { ...community };

        // Обновляем автора
        if (community.author === oldUsername) {
          updatedCommunity.author = newUsername;
          needsUpdate = true;
        }

        // Обновляем участников
        if (community.users && community.users.includes(oldUsername)) {
          updatedCommunity.users = community.users.map((username: string) => 
            username === oldUsername ? newUsername : username
          );
          needsUpdate = true;
        }

        if (needsUpdate) {
          try {
            const updateResponse = await fetch('http://localhost:8090/api/community/update', {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedCommunity)
            });

            if (updateResponse.ok) {
              result.updatedCount++;
              console.log(` Сообщество "${community.name}" обновлено`);
            } else {
              const errorText = await updateResponse.text().catch(() => 'Неизвестная ошибка');
              result.errors.push(`Сообщество "${community.name}": ${errorText}`);
            }
          } catch (error) {
            result.errors.push(`Сообщество "${community.name}": ${error}`);
          }
        }
      }

      if (result.errors.length > 0) {
        result.success = false;
      }

    } catch (error) {
      console.error('Ошибка обновления сообществ:', error);
      result.success = false;
      result.errors.push(`Общая ошибка: ${error}`);
    }

    return result;
  };

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

      const usernameChanged = data.username !== currentProfile.username;

      // Проверка уникальности username (если изменился)
      if (usernameChanged) {
        const isAvailable = await checkUsernameAvailability(data.username);
        if (!isAvailable) {
          setValidationErrors({ username: 'Этот username уже занят' });
          return;
        }

        // Показываем предупреждение о смене username
        setPendingFormData(data);
        setShowUsernameWarning(true);
        return; // Останавливаем выполнение, ждем подтверждения
      }

      // Если username не изменился, продолжаем обычное сохранение
      await saveProfile(data);
      
    } catch (err: any) {
      console.error('Ошибка обновления профиля:', err);
      alert(err.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameWarningConfirm = async () => {
    if (!pendingFormData) return;
    
    setShowUsernameWarning(false);
    setIsSubmitting(true);
    
    try {
      await saveProfile(pendingFormData);
    } catch (err: any) {
      console.error('Ошибка обновления профиля:', err);
      alert(err.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setIsSubmitting(false);
      setPendingFormData(null);
    }
  };

  const handleUsernameWarningCancel = () => {
    setShowUsernameWarning(false);
    setPendingFormData(null);
    setIsSubmitting(false);
  };

  const saveProfile = async (data: ProfileFormData) => {
    const usernameChanged = data.username !== currentProfile.username;
    try {
      // Получаем актуальные данные профиля с сервера
      const token = localStorage.getItem('accessToken');
      const profileResponse = await fetch(
        `http://localhost:8090/api/users/get-by-username/${currentProfile.username}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (!profileResponse.ok) {
        throw new Error('Не удалось получить актуальные данные профиля');
      }
      
      const actualProfile = await profileResponse.json();

      // Формируем данные для API с актуальными eventIds и communityId
      const updateData = {
        id: actualProfile.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        password: data.newPassword || actualProfile.password, // Если пароль не меняется, отправляем текущий
        role: actualProfile.role,
        city: data.city,
        imageUrl: photoUrl || actualProfile.imageUrl,
        phoneNumber: data.phoneNumber || null,
        registrationDate: actualProfile.registrationDate,
        eventIds: actualProfile.eventIds || [], // Сохраняем актуальные eventIds
        communityId: actualProfile.communityId || [], // Сохраняем актуальные communityId
        metadata: {
          ...actualProfile.metadata,
          lastProfileUpdate: new Date().toISOString()
        },
        subscriber: actualProfile.subscriber // Сохраняем текущее состояние подписки
      };

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

      const updatedProfile = await response.json();
      
      // Если username изменился, обновляем все связанные записи
      if (usernameChanged) {
        console.log('🔄 Username изменился, обновляем связанные записи...');
        
        // Обновляем сообщества напрямую без импорта отдельного файла
        const updateResult = await updateUsernameInAllCommunities(
          currentProfile.username, 
          data.username
        );
        
        // Показываем результат обновления
        const notification = document.createElement('div');
        notification.textContent = updateResult.success 
          ? `Username успешно обновлен в ${updateResult.updatedCount} сообществах!`
          : `Username обновлен частично. Обновлено: ${updateResult.updatedCount} сообществ`;
        notification.style.cssText = `
          position: fixed;
          top: 70px;
          right: 20px;
          background: ${updateResult.success ? '#10b981' : '#f59e0b'};
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          z-index: 1002;
          font-size: 14px;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, updateResult.success ? 4000 : 6000);
      }
      
      // Преобразуем в FullProfile формат с сохранением загруженных событий и сообществ
      const fullProfileData: FullProfile = {
        id: updatedProfile.id,
        username: updatedProfile.username,
        email: updatedProfile.email,
        password: updatedProfile.password,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        role: updatedProfile.role,
        city: updatedProfile.city,
        imageUrl: updatedProfile.imageUrl,
        phoneNumber: updatedProfile.phoneNumber,
        registrationDate: updatedProfile.registrationDate,
        metadata: updatedProfile.metadata,
        subscriber: updatedProfile.subscriber,
        eventIds: updatedProfile.eventIds || [],
        communityIds: updatedProfile.communityId || []
      };

      await onSubmit(fullProfileData);
      onClose();
    } catch (err: any) {
      console.error('Ошибка обновления профиля:', err);
      throw err; // Пробрасываем ошибку для обработки в вызывающей функции
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
      
      <UsernameWarning
        currentUsername={currentProfile.username}
        newUsername={pendingFormData?.username || ''}
        onConfirm={handleUsernameWarningConfirm}
        onCancel={handleUsernameWarningCancel}
        isVisible={showUsernameWarning}
      />
    </div>
  );
};

export default ProfileEditPage;