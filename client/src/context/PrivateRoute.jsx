import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Cookies from 'js-cookie';

export const PrivateRoute = ({ element, requiredRole }) => {
  const isAuthenticated = Cookies.get('auth'); 
  const role = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
}

