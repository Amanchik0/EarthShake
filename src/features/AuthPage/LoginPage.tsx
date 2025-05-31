import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { useAuth } from '../../components/auth/AuthContext';

type FormDataState = {
  readonly username: string;
  readonly password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormDataState>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Имя пользователя обязательно';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:8090/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Ошибка при входе');
        return;
      }

      const data = await response.json();
      // Сохраняем токены и данные пользователя
      login(data);

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Сетевая ошибка. Попробуйте позже.');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

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
          <h1 className={styles.heading}>Вход в аккаунт</h1>
          <p className={styles.subtitle}>Введите данные для входа в систему</p>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="username">Имя пользователя</label>
              <div className={styles.inputWithIcon}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  className={styles.input}
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  placeholder="Введите имя пользователя"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.username && <div className={styles.errorMessage}>{errors.username}</div>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="password">Пароль</label>
              <div className={styles.passwordInput}>
                <input
                  className={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className={styles.passwordToggle} onClick={togglePasswordVisibility}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"/>
                  </svg>
                </button>
              </div>
              {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
            </div>
            <button type="submit" className={styles.registerButton}>Войти</button>
            <div className={styles.divider}>
              <span>или</span>
            </div>
            <div className={styles.loginLink}>
              Нет аккаунта? <a href="#" onClick={() => navigate('/register')}>Зарегистрироваться</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
