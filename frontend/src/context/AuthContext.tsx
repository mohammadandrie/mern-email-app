import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { User, AuthResponse } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authAPI.getMe()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const data: AuthResponse = res.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ _id: data._id, email: data.email }));
    setToken(data.token);
    setUser({ _id: data._id, email: data.email, createdAt: '' });
    toast.success('Login successful!');
  };

  const register = async (email: string, password: string) => {
    const res = await authAPI.register({ email, password });
    const data: AuthResponse = res.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ _id: data._id, email: data.email }));
    setToken(data.token);
    setUser({ _id: data._id, email: data.email, createdAt: '' });
    toast.success('Registration successful!');
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore error, still logout locally
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
