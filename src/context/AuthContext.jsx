import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "../../mockService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [role, setRole] = useState(sessionStorage.getItem("role"));
  const isAuthenticated = !!token;

  const login = async (email, password) => {
    // Simulación de login API

    const foundUser = mockUsers.find((user) => user.email === email);
    console.log(foundUser);
    if (!foundUser) {
      return false;
    }
    const fakeToken = "fake-token-123";

    sessionStorage.setItem("token", fakeToken);
    sessionStorage.setItem("user", JSON.stringify(foundUser));
    sessionStorage.setItem("role", foundUser.role);

    setToken(fakeToken);
    setUser(foundUser);
    setRole(foundUser.role);
    return true;
  };

  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, role, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
