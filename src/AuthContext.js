// AuthContext.js
import React, { createContext, useContext, useState, useEffect,useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
  
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // console.log("esse e o id da pessoa logada",localStorage.getItem('userId'))
      setUserId(storedUserId);
    }
  }, []);


  const checkDailyLogin = useCallback(() => {
   
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    if (lastLoginDate) {
   
      const lastLogin = new Date(lastLoginDate);
      const today = new Date();
      return lastLogin.toDateString() === today.toDateString();
      
    }
   
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
