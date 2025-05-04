import { createContext, useContext, useState } from "react";
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('auth')); 

  const login = () => {
    setIsAuthenticated(true);
    Cookies.set('auth', 'true', { expires: 1 }); 
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove('auth'); 
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    window.location.reload(); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
