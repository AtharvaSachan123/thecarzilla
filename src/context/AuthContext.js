import React, { createContext, useState, useContext, useEffect } from 'react';
import authApi from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = authApi.getAccessToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const result = await authApi.verifyToken();
      
      if (result.success && result.data.user) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        console.log('✅ [AUTH-CONTEXT] User authenticated:', result.data.user.email);
      } else {
        // Token is invalid
        authApi.signOut();
        setUser(null);
        setIsAuthenticated(false);
        console.log('❌ [AUTH-CONTEXT] Token verification failed');
      }
    } catch (error) {
      console.error('❌ [AUTH-CONTEXT] Auth check error:', error);
      authApi.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, tokens) => {
    setUser(userData);
    setIsAuthenticated(true);
    console.log('✅ [AUTH-CONTEXT] User logged in:', userData.email);
  };

  const logout = () => {
    authApi.signOut();
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ [AUTH-CONTEXT] User logged out');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
