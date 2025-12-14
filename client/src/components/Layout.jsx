// components/Layout.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children, type = 'default' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (type === 'auth' && token) {
      navigate('/');
    }
    
    if (type === 'protected' && !token) {
      navigate('/login', { state: { from: location } });
    }
  }, [type, navigate, location]);

  if (type === 'protected') {
    const token = localStorage.getItem('token');
    if (!token) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
  }

  return <div className="min-h-screen">{children}</div>;
};

export default Layout;
