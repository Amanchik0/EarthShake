import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  city: string;
  password: string;
  confirmPassword: string;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    city: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Имя обязательно';
    if (!formData.lastName) newErrors.lastName = 'Фамилия обязательна';
    if (!formData.username) newErrors.username = 'Имя пользователя обязательно';
    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Введите корректный email';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Телефон обязателен';
    if (!formData.city) newErrors.city = 'Город обязателен';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    else if (formData.password.length < 8) newErrors.password = 'Минимум 8 символов';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      city: formData.city,
      role: 'USER',
      phoneNumber: formData.phoneNumber,
      fistName: formData.firstName,   // backend field spelled "fistName"
      lastName: formData.lastName
    };

    try {
      const response = await fetch('http://localhost:8090/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Пример обработки ошибок из ответа сервера
        alert(errorData.message || 'Ошибка при регистрации');
        return;
      }

      // При успешной регистрации переходим на страницу входа
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Сетевая ошибка. Попробуйте позже.');
    }
  };
    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className={styles.registrationPage}>
      <div className={styles.container}>
        <div className={styles.registrationCard}>
          <div className={styles.logo}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" rx="12" fill="#FF6B98"/>
              <path d="M20 30C20 24.477 24.477 20 30 20V40C24.477 40 20 35.523 20 30Z" fill="white"/>
              <path d="M30 20C35.523 20 40 24.477 40 30C40 35.523 35.523 40 30 40V20Z" fill="white" fillOpacity="0.5"/>
            </svg>
          </div>
          
          <h1 className={styles.heading}>Создайте аккаунт</h1>
          <p className={styles.subtitle}>Заполните форму регистрации для начала работы</p>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="firstName">Имя</label>
                <input
                  className={styles.input}
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Введите имя"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && <div className={styles.errorMessage}>{errors.firstName}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="lastName">Фамилия</label>
                <input
                  className={styles.input}
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Введите фамилию"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && <div className={styles.errorMessage}>{errors.lastName}</div>}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="username">Имя пользователя</label>
              <div className={styles.inputWithIcon}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  className={styles.input}
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Выберите имя пользователя"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.username && <div className={styles.errorMessage}>{errors.username}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <div className={styles.inputWithIcon}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  className={styles.input}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phoneNumber">Номер телефона</label>
              <div className={styles.inputWithIcon}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <input
                  className={styles.input}
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.phoneNumber && <div className={styles.errorMessage}>{errors.phoneNumber}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="city">Город</label>
              <div className={styles.inputWithIcon}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <input
                  className={styles.input}
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Введите город"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.city && <div className={styles.errorMessage}>{errors.city}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="password">Пароль</label>
              <div className={styles.passwordInput}>
                <input
                  className={styles.input}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Минимум 8 символов"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className={styles.passwordToggle} onClick={togglePasswordVisibility}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"></path>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"></path>
                  </svg>
                </button>
              </div>
              <div className={styles.passwordRequirements}>
                Пароль должен содержать:
                <ul>
                  <li className={`${styles.passwordRequirement} ${formData.password.length >= 8 ? styles.valid : ''}`}>
                    Минимум 8 символов
                  </li>
                  <li className={`${styles.passwordRequirement} ${/[A-Z]/.test(formData.password) ? styles.valid : ''}`}>
                    Хотя бы одну заглавную букву
                  </li>
                  <li className={`${styles.passwordRequirement} ${/\d/.test(formData.password) ? styles.valid : ''}`}>
                    Хотя бы одну цифру
                  </li>
                  <li className={`${styles.passwordRequirement} ${/[!@#$%^&*]/.test(formData.password) ? styles.valid : ''}`}>
                    Хотя бы один специальный символ
                  </li>
                </ul>
              </div>
              {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="confirmPassword">Подтверждение пароля</label>
              <div className={styles.passwordInput}>
                <input
                  className={styles.input}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Повторите пароль"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button type="button" className={styles.passwordToggle} onClick={toggleConfirmPasswordVisibility}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"></path>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"></path>
                  </svg>
                </button>
              </div>
              {errors.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>}
            </div>
            
            <button type="submit" className={styles.registerButton}>Зарегистрироваться</button>
            
            <div className={styles.divider}>
              <span>или</span>
            </div>
            

            <div className={styles.loginLink}>
              Уже есть аккаунт? <a href="#">Войти</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;