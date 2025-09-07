// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      setUser(savedUser);
    }
  }, [token]);

  // Login with credentials
  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Generate a guest user
  const setGuestUser = () => {
    const guest = { name: `Guest_${Math.floor(Math.random() * 10000)}`, guest: true };
    setUser(guest);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setGuestUser }}>
      {children}
    </AuthContext.Provider>
  );
};
