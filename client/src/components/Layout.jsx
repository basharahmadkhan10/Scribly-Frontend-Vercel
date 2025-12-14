// components/Layout.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children, type = 'default' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    // Prevent infinite loops - only redirect if we're not already on the target page
    if (type === 'auth' && token) {
      // Only redirect to home if we're not already on home
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    } else if (type === 'protected' && !token) {
      // Only redirect to login if we're not already on login
      if (location.pathname !== '/login') {
        navigate('/login', { 
          state: { from: location.pathname },
          replace: true 
        });
      }
    }
    
    setIsChecking(false);
  }, [type, navigate, location]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen">{children}</div>;
};

export default Layout;
