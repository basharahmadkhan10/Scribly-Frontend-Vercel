import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Preloader from "./components/Preloader";
import ErrorBoundary from "./components/ErrorBoundary";

// Static lazy imports
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Notes = lazy(() => import("./pages/Notes"));
const PublicNotes = lazy(() => import("./pages/PublicNotesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const location = useLocation();
  const [showPreloader, setShowPreloader] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    
    // Also listen for storage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Custom Protected Route component (inline)
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    
    if (!token) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    
    return children;
  };

  // Public Only Route (for login/signup when already logged in)
  const PublicOnlyRoute = ({ children }) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    
    if (token) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  if (showPreloader) {
    return <Preloader />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Preloader minimal />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Home - Public */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />

            {/* Login - Only for non-logged in users */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Layout>
                    <Login setIsAuthenticated={setIsAuthenticated} />
                  </Layout>
                </PublicOnlyRoute>
              }
            />
            
            {/* Signup - Only for non-logged in users */}
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <Layout>
                    <Signup />
                  </Layout>
                </PublicOnlyRoute>
              }
            />

            {/* Notes - Protected */}
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Notes />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Public Notes - Public */}
            <Route
              path="/publicnotes"
              element={
                <Layout>
                  <PublicNotes />
                </Layout>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
