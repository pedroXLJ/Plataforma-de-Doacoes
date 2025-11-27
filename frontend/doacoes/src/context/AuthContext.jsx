import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import Toast from '../components/Toast';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escapedDecode(decoded)));
  } catch (e) {
    try {
      // fallback simple decode
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (err) {
      return null;
    }
  }
}

// helper for unicode-safe decode
function escapedDecode(str) {
  return str.split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join('');
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const setUserFromToken = (token) => {
    if (!token) return setUser(null);
    const parsed = parseJwt(token);
    if (parsed) {
      // try to guess common claim names
      const name = parsed.name || parsed.nome || parsed.sub || parsed.user || parsed.preferred_username || null;
      const email = parsed.email || parsed.mail || parsed.preferred_username || null;
      setUser({ name, email, raw: parsed });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const token = authService.getToken();
    if (token) setUserFromToken(token);
  }, []);

  const login = async (email, senha) => {
    const data = await authService.login(email, senha);
    const token = data?.token || authService.getToken();
    setUserFromToken(token);
    setToast({ type: 'success', message: 'Login realizado com sucesso' });
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToast({ type: 'info', message: 'Você saiu da conta' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, setToast }}>
      {children}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
