import React, { useState, useEffect } from 'react';
import { ProfileFormData } from '../../types/profile';
import CitySelect from '../../components/CitySelect/CitySelect';
import styles from './ProfileForm.module.css';

interface ProfileFormProps {
  initialData: ProfileFormData;
  onCancel: () => void;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isSubmitting?: boolean;
  validationErrors?: Record<string, string>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onCancel,
  onSubmit,
  isSubmitting = false,
  validationErrors = {}
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Обновляем форму при изменении initialData
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Функция проверки доступности username
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (!username.trim() || username === initialData.username) {
      return true; // Пустой username или тот же что и был - не проверяем
    }

    try {
      const response = await fetch(`http://localhost:8090/api/users/get-by-username/${encodeURIComponent(username)}`);
      
      if (response.status === 404) {
        // Пользователь не найден - username доступен
        return true;
      } else if (response.ok) {
        // Пользователь найден - username занят
        return false;
      } else {
        // Ошибка сервера - считаем что доступен
        console.error('Ошибка при проверке username:', response.statusText);
        return true;
      }
    } catch (error) {
      console.error('Ошибка при проверке username:', error);
      return true; // При ошибке сети считаем что доступен
    }
  };

  // Обработчик изменения полей
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Ограничение для телефона
    if (name === 'phoneNumber' && value.length > 12) {
      return; // Не обновляем значение если превышает лимит
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку для этого поля
    if (localErrors[name] || validationErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Специальный обработчик для города
  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({ ...prev, city: cityName }));
    
    // Очищаем ошибку для города при выборе
    if (localErrors.city || validationErrors.city) {
      setLocalErrors(prev => ({ ...prev, city: '' }));
    }
  };

  // Локальная валидация в реальном времени
  const validateField = (field: string, value: string | undefined): string => {
    const v = value ?? '';

    switch (field) {
      case 'username':
        if (!v.trim()) return 'Username обязателен для заполнения';
        if (v.length < 3) return 'Username должен содержать минимум 3 символа';
        if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'Username может содержать только буквы, цифры и подчеркивания';
        return '';
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(v) ? 'Некорректный формат email' : '';
      
      case 'phoneNumber':
        if (v && !/^\+77\d{9}$/.test(v)) {
          return 'Формат: +77XXXXXXXXX (12 символов)';
        }
        return '';
      
      case 'firstName':
        return !v.trim() ? 'Имя обязательно для заполнения' : '';
      
      case 'newPassword':
        if (v && v.length < 6) {
          return 'Пароль должен содержать минимум 6 символов';
        }
        return '';
      
      case 'confirmNewPassword':
        if (formData.newPassword && v !== formData.newPassword) {
          return 'Пароли не совпадают';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleBlur = async (field: string) => {
    const error = validateField(field, formData[field as keyof ProfileFormData]);
    
    // Специальная проверка для username
    if (field === 'username' && !error && formData.username !== initialData.username) {
      setIsCheckingUsername(true);
      const isAvailable = await checkUsernameAvailability(formData.username);
      setIsCheckingUsername(false);
      
      if (!isAvailable) {
        setLocalErrors(prev => ({ ...prev, username: 'Этот username уже занят' }));
        return;
      }
    }
    
    setLocalErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидируем все поля перед отправкой
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const field = key as keyof ProfileFormData;
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    // Дополнительная проверка паролей
    if (formData.newPassword && !formData.currentPassword) {
      errors.currentPassword = 'Введите текущий пароль для смены';
    }

    // Проверяем username если он изменился
    if (formData.username !== initialData.username && !errors.username) {
      setIsCheckingUsername(true);
      const isAvailable = await checkUsernameAvailability(formData.username);
      setIsCheckingUsername(false);
      
      if (!isAvailable) {
        errors.username = 'Этот username уже занят';
      }
    }

    setLocalErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      await onSubmit(formData);
    }
  };

  // Объединяем локальные ошибки с ошибками от сервера
  const getFieldError = (field: string): string => {
    return validationErrors[field] || localErrors[field] || '';
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.profileForm} onSubmit={handleSubmit}>
        {/* Поле Username */}
        <div className={styles.formGroup}>
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => handleBlur('username')}
            className={getFieldError('username') ? styles.inputError : ''}
            disabled={isSubmitting || isCheckingUsername}
            required
            placeholder="Уникальное имя пользователя"
          />
          {isCheckingUsername && (
            <span className={styles.checkingText}>Проверяем доступность...</span>
          )}
          {getFieldError('username') && (
            <span className={styles.errorText}>{getFieldError('username')}</span>
          )}
        </div>

        {/* Поле Имя */}
        <div className={styles.formGroup}>
          <label htmlFor="firstName">Имя *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={() => handleBlur('firstName')}
            className={getFieldError('firstName') ? styles.inputError : ''}
            disabled={isSubmitting}
            required
          />
          {getFieldError('firstName') && (
            <span className={styles.errorText}>{getFieldError('firstName')}</span>
          )}
        </div>

        {/* Поле Фамилия */}
        <div className={styles.formGroup}>
          <label htmlFor="lastName">Фамилия</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Поле Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            className={getFieldError('email') ? styles.inputError : ''}
            disabled={isSubmitting}
            required
          />
          {getFieldError('email') && (
            <span className={styles.errorText}>{getFieldError('email')}</span>
          )}
        </div>

        {/* Поле Телефон */}
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Телефон</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={() => handleBlur('phoneNumber')}
            className={getFieldError('phoneNumber') ? styles.inputError : ''}
            placeholder="+77712575704"
            disabled={isSubmitting}
            maxLength={12}
          />
          {getFieldError('phoneNumber') && (
            <span className={styles.errorText}>{getFieldError('phoneNumber')}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="city">Город</label>
          <CitySelect
            value={formData.city}
            onChange={handleCityChange}
            placeholder="Выберите город"
            error={getFieldError('city')}
          />
        </div>

        {/* Секция смены пароля */}
        <div className={styles.passwordSection}>
          <button
            type="button"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className={styles.togglePasswordButton}
            disabled={isSubmitting}
          >
            {showPasswordFields ? 'Скрыть поля пароля' : 'Изменить пароль'}
          </button>
        </div>

        {showPasswordFields && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">Текущий пароль *</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={getFieldError('currentPassword') ? styles.inputError : ''}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              {getFieldError('currentPassword') && (
                <span className={styles.errorText}>{getFieldError('currentPassword')}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword">Новый пароль</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('newPassword')}
                className={getFieldError('newPassword') ? styles.inputError : ''}
                disabled={isSubmitting}
                autoComplete="new-password"
                minLength={6}
              />
              {getFieldError('newPassword') && (
                <span className={styles.errorText}>{getFieldError('newPassword')}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmNewPassword">Подтвердите новый пароль</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmNewPassword')}
                className={getFieldError('confirmNewPassword') ? styles.inputError : ''}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {getFieldError('confirmNewPassword') && (
                <span className={styles.errorText}>{getFieldError('confirmNewPassword')}</span>
              )}
            </div>
          </>
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={isSubmitting || isCheckingUsername}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;