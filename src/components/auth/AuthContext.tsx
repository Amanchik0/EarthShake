import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthUser {
  username: string;
  role: string;
  city: string;
  isSubscriber: boolean; 
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
    isSubscriber: boolean; 
  }) => void;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const city = localStorage.getItem('city');
    const isSubscriber = localStorage.getItem('isSubscriber');

    if (username && role && city && isSubscriber !== null) {
      setUser({ 
        username, 
        role, 
        city, 
        isSubscriber: isSubscriber === 'true' 
      });
    }
    setIsLoading(false);
  }, []);

  const login = ({ accessToken, refreshToken, username, role, city, isSubscriber }: Parameters<AuthContextValue['login']>[0]) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    localStorage.setItem('city', city);
    localStorage.setItem('isSubscriber', isSubscriber.toString()); 
    
    setUser({ username, role, city, isSubscriber });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    
    if (userData.username !== undefined) {
      localStorage.setItem('username', userData.username);
    }
    if (userData.role !== undefined) {
      localStorage.setItem('role', userData.role);
    }
    if (userData.city !== undefined) {
      localStorage.setItem('city', userData.city);
    }
    if (userData.isSubscriber !== undefined) {
      localStorage.setItem('isSubscriber', userData.isSubscriber.toString());
    }
    
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
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