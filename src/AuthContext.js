// AuthContext.js
import React, { createContext, useContext, useState, useEffect,useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    console.log("useefect1")
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      console.log("esse e o id da pessoa logada",localStorage.getItem('userId'))
      setUserId(storedUserId);
    }
  }, []);


  const checkDailyLogin = useCallback(() => {
    console.log("test")
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    if (lastLoginDate) {
      console.log("test2")
      const lastLogin = new Date(lastLoginDate);
      const today = new Date();
      return lastLogin.toDateString() === today.toDateString();
      
    }
    console.log("test3")  
    return false;
  }, []);


  

  return (
    <AuthContext.Provider value={{ userId, checkDailyLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
