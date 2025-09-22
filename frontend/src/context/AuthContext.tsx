'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authAPI, userAPI } from '@/lib/api';
import { enhancedAuthAPI, enhancedUserAPI } from '@/lib/apiWithRetry';
import socketManager from '@/lib/socket';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      socketManager.connect();
      if (user?.currentEvent) {
        socketManager.joinEvent(user.currentEvent);
      }
    } else {
      socketManager.disconnect();
    }
  }, [isAuthenticated, user?.currentEvent]);

  const checkAuthStatus = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const response = await enhancedUserAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await enhancedAuthAPI.login({ email, password });
      const { user: userData, tokens } = response.data;

      // Store tokens
      Cookies.set('accessToken', tokens.accessToken, { expires: 1 });
      Cookies.set('refreshToken', tokens.refreshToken, { expires: 7 });

      setUser(userData);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await enhancedAuthAPI.register(userData);
      const { user: newUser, tokens } = response.data;

      // Store tokens
      Cookies.set('accessToken', tokens.accessToken, { expires: 1 });
      Cookies.set('refreshToken', tokens.refreshToken, { expires: 7 });

      setUser(newUser);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        enhancedAuthAPI.logout(refreshToken).catch(console.error);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear tokens and user state
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setUser(null);
      socketManager.disconnect();
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await enhancedUserAPI.updateProfile(data);
      setUser(response.data.user);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Profile update failed';
      throw new Error(message);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await enhancedUserAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;