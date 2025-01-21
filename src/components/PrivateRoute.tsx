import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode; // Komponent do renderowania jako dziecko
  roles?: string[]; // Lista dozwolonych ról
}

const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const token = localStorage.getItem('token'); // Pobierz token z localStorage
  if (!token) {
    return <Navigate to="/login" />; // Przekierowanie na login, jeśli brak tokena
  }

  const decodedToken = decodeToken(token); // Dekoduj token
  const userRole = decodedToken?.role;

  // Jeśli użytkownik nie ma odpowiedniej roli, przekieruj na /unauthorized
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Jeśli wszystko jest poprawne, renderuj dzieci (chroniony komponent)
  return <>{children}</>;
};

export default PrivateRoute;
