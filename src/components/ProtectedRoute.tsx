import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Это заглушка для проверки аутентификации.
// Замените это на вашу реальную логику проверки авторизации
const useAuth = () => {
  // Здесь должна быть ваша логика проверки авторизации
  // Например, проверка токена в localStorage или в состоянии Redux/Context
  // const isAuthenticated = localStorage.getItem('token') !== null;
  const isAuthenticated= true
  return isAuthenticated;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Перенаправление на страницу логина с сохранением пути,
    // на который пользователь пытался попасть
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;