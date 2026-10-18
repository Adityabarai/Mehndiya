import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [artistProfile, setArtistProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { toastSuccess, toastError, toastInfo } = useToast();

  // Load current user on initial mount
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('mehndi_token');
    const cachedUser = localStorage.getItem('mehndi_user');

    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
        const cachedArtist = localStorage.getItem('mehndi_artist_profile');
        if (cachedArtist) setArtistProfile(JSON.parse(cachedArtist));
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }

    if (token) {
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('mehndi_user', JSON.stringify(res.user));
          if (res.artistProfile) {
            setArtistProfile(res.artistProfile);
            localStorage.setItem('mehndi_artist_profile', JSON.stringify(res.artistProfile));
          }
        }
      } catch {
        // If token expired or network failed, fallback gracefully
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch unread notifications count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications({
        role: user.role,
        userId: user.id
      });
      if (res.success) {
        setUnreadNotifications(res.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        localStorage.setItem('mehndi_token', res.token);
        localStorage.setItem('mehndi_user', JSON.stringify(res.user));
        setUser(res.user);
        if (res.artistProfile) {
          setArtistProfile(res.artistProfile);
          localStorage.setItem('mehndi_artist_profile', JSON.stringify(res.artistProfile));
        } else {
          setArtistProfile(null);
          localStorage.removeItem('mehndi_artist_profile');
        }
        toastSuccess(`Welcome back, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
    } catch (err) {
      toastError(err.message || 'Login failed');
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success) {
        localStorage.setItem('mehndi_token', res.token);
        localStorage.setItem('mehndi_user', JSON.stringify(res.user));
        setUser(res.user);
        if (res.artistProfile) {
          setArtistProfile(res.artistProfile);
          localStorage.setItem('mehndi_artist_profile', JSON.stringify(res.artistProfile));
        }
        toastSuccess(`Account created! Welcome to Mehndi, ${res.user.name}.`);
        return { success: true, user: res.user };
      }
    } catch (err) {
      toastError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    const name = user ? user.name : 'User';
    localStorage.removeItem('mehndi_token');
    localStorage.removeItem('mehndi_user');
    localStorage.removeItem('mehndi_artist_profile');
    setUser(null);
    setArtistProfile(null);
    setUnreadNotifications(0);
    toastInfo(`Logged out. See you soon, ${name}!`);
  };

  // Quick Test Login helpers
  const loginAsAdmin = () => login('admin@mehndi.com', 'admin123');
  const loginAsArtist = () => login('ayushi@mehndi.com', 'artist123');
  const loginAsUser = () => login('ananya@example.com', 'user123');

  return (
    <AuthContext.Provider
      value={{
        user,
        artistProfile,
        loading,
        unreadNotifications,
        fetchUnreadCount,
        login,
        register,
        logout,
        loginAsAdmin,
        loginAsArtist,
        loginAsUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isArtist: user?.role === 'ARTIST',
        isUser: user?.role === 'USER'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
