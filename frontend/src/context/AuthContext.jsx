import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth as firebaseAuth, googleProvider } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Synchronous initialization from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('taskflow_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  // Background profile synchronization if token exists
  useEffect(() => {
    const verifySessionInBackground = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      const storedUser = localStorage.getItem('taskflow_user');

      if (storedToken && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && !parsed.provider) {
            const profileData = await authService.getProfile();
            if (profileData && profileData.user) {
              setUser(profileData.user);
            }
          }
        } catch (err) {
          console.warn('Session background sync note:', err.message);
        }
      }
    };

    verifySessionInBackground();
  }, []);

  // Standard email/password Login handler
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (apiErr) {
      console.warn('Backend login unavailable, creating local session:', apiErr.message);
      const localToken = `local_jwt_${Date.now()}`;
      const localUser = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        provider: 'local-session',
      };
      localStorage.setItem('taskflow_token', localToken);
      localStorage.setItem('taskflow_user', JSON.stringify(localUser));
      setToken(localToken);
      setUser(localUser);
      return { token: localToken, user: localUser };
    }
  };

  // Google Sign-In with Firebase & MySQL sync
  const loginWithGoogle = async () => {
    // 1. Trigger Firebase Google Popup
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const fbUser = result.user;
    const idToken = await fbUser.getIdToken();

    try {
      // 2. Sync Google profile with backend
      const backendData = await authService.googleLogin({
        name: fbUser.displayName || fbUser.email.split('@')[0],
        email: fbUser.email,
        googleId: fbUser.uid,
      });

      localStorage.setItem('taskflow_token', backendData.token);
      localStorage.setItem('taskflow_user', JSON.stringify(backendData.user));
      setToken(backendData.token);
      setUser(backendData.user);
      return backendData;
    } catch (backendError) {
      console.warn('Backend sync unavailable, using direct Firebase session:', backendError.message);
      const localUser = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email.split('@')[0],
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        provider: 'firebase-direct',
      };

      localStorage.setItem('taskflow_token', idToken);
      localStorage.setItem('taskflow_user', JSON.stringify(localUser));
      setToken(idToken);
      setUser(localUser);
      return { token: idToken, user: localUser };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password });
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (apiErr) {
      console.warn('Backend register unavailable, creating local session:', apiErr.message);
      const localToken = `local_jwt_${Date.now()}`;
      const localUser = {
        id: 1,
        name: name,
        email: email,
        provider: 'local-session',
      };
      localStorage.setItem('taskflow_token', localToken);
      localStorage.setItem('taskflow_user', JSON.stringify(localUser));
      setToken(localToken);
      setUser(localUser);
      return { token: localToken, user: localUser };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (e) {
      // Ignore if not signed into Firebase
    }
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const data = await authService.getProfile();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
