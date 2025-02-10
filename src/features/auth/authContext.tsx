// src/features/auth/authContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    // Здесь должен быть запрос к API. Для демонстрации:
    // Допустим, пароль должен быть "password", иначе ошибка.
    if (password === 'password') {
      // Симулируем получение данных пользователя
      setUser({ id: 1, username });
    } else {
      throw new Error('Неверный пароль');
    }
  };

  const register = async (username: string, password: string) => {
    // Здесь должен быть запрос на регистрацию.
    // Симулируем успешную регистрацию:
    setUser({ id: 1, username });
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = { user, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
