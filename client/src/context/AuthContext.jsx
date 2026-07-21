import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('career_token') || '');
  const [loading, setLoading] = useState(true);

  const syncSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) {
      localStorage.setItem('career_token', nextToken);
    } else {
      localStorage.removeItem('career_token');
    }
  };

  const fetchCurrentUser = async () => {
    if (!localStorage.getItem('career_token')) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setToken(localStorage.getItem('career_token') || '');
    } catch (error) {
      syncSession('', null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (nextToken, nextUser) => syncSession(nextToken, nextUser);
  const register = (nextToken, nextUser) => syncSession(nextToken, nextUser);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout API failures and clear the local session.
    } finally {
      syncSession('', null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setUser,
        refreshUser: fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
