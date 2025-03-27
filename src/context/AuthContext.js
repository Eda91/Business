// context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for storing logged-in user data

  // Function to set user after login
  const login = (userData) => {
    setUser(userData); // Store user data in context
  };

  // Function to clear user data on logout
  const logout = () => {
    setUser(null); // Clear user data
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
