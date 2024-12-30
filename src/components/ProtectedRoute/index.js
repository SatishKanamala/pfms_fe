import React from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('auth_token');

  if (!token) {
    // If no token is present, navigate to login
    return <Navigate to="/login" />;
  }

  try {
    // Decode the token to check expiration
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      // If token is expired, navigate to login
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    // If there's an error decoding, navigate to login
    return <Navigate to="/login" />;
  }

  // If the token is valid, render the child component
  return children;
};

export default ProtectedRoute;


