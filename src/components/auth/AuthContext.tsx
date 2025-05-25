import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthUser {
  username: string;
  role: string;
  city: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: {
    accessToken: string;
    refreshToken: string;
    username: string;
    role: string;
    city: string;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // При монтировании проверяем данные в localStorage
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const city = localStorage.getItem('city');

    if (username && role && city) {
      setUser({ username, role, city });
    }
    setIsLoading(false);
  }, []);

  const login = ({ accessToken, refreshToken, username, role, city }: Parameters<AuthContextValue['login']>[0]) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    localStorage.setItem('city', city);
    setUser({ username, role, city });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
