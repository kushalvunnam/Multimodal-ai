const fs = require('fs');
let auth = fs.readFileSync('frontend/src/context/AuthContext.jsx', 'utf8');

auth = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signin, signup as apiSignup, signout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('omnisense_token');
        const res = await getCurrentUser();
        if (mounted) {
          if (res?.success && res.data?.user) {
            setUser(res.data.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('omnisense_token');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        if (mounted) {
          localStorage.removeItem('omnisense_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchUser();
    return () => { mounted = false; };
  }, []);

  const login = async (credentials) => {
    const res = await signin(credentials);
    if (res?.success) {
      if (res.token) localStorage.setItem('omnisense_token', res.token);
      setUser(res.data?.user || res.user || null);
      setIsAuthenticated(true);
    }
    return res;
  };

  const signup = async (userData) => {
    const res = await apiSignup(userData);
    if (res?.success) {
      if (res.token) localStorage.setItem('omnisense_token', res.token);
      setUser(res.data?.user || res.user || null);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async () => {
    try {
      await signout();
    } catch (e) {}
    localStorage.removeItem('omnisense_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
`;

fs.writeFileSync('frontend/src/context/AuthContext.jsx', auth);
