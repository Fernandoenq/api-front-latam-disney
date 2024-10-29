// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const checkDailyLogin = () => {
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    if (lastLoginDate) {
      const lastLogin = new Date(lastLoginDate);
      const today = new Date();
      return lastLogin.toDateString() === today.toDateString();
    }
    return false;
  };

  

  return (
    <AuthContext.Provider value={{ userId, checkDailyLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
