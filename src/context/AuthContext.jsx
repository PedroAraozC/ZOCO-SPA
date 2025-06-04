import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../../mockService'; // ← ya no importás mockUsers

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!token;
  const role = user?.role || null;

  const login = ({ email, password }) => {
    const foundUser = loginUser(email, password);
    if (foundUser) {
      const fakeToken = btoa(`${foundUser.email}:${foundUser.role}`);
      setToken(fakeToken);
      setUser(foundUser);
      sessionStorage.setItem('token', fakeToken);
      sessionStorage.setItem('user', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const updateUserContext = (newUserData) => {
    setUser(newUserData);
    sessionStorage.setItem('user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        isAuthenticated,
        login,
        logout,
        updateUserContext
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
