import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("access"); // Verifica el token de autenticación

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
