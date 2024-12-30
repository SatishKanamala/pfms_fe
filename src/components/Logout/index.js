import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove token from cookies
    Cookies.remove('auth_token');
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return null; // No UI for the Logout component
};

export default Logout;
