// components/Layout.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const Layout = ({ children, type = 'default' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle auth redirection based on layout type
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    if (type === 'auth' && token) {
      // If user is logged in and tries to access login/signup, redirect to home
      navigate('/');
    }
    
    if (type === 'protected' && !token) {
      // If user is not logged in and tries to access protected route
      navigate('/login', { state: { from: location } });
    }
  }, [type, navigate, location]);

  // If it's a protected route and no token, don't render children
  if (type === 'protected') {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) {
      return null; // or a loading spinner
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;

