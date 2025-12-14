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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check auth status
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsCheckingAuth(false);
    
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Custom Protected Route component (inline)
  const ProtectedRoute = ({ children }) => {
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Public Only Route (for login/signup when already logged in)
  const PublicOnlyRoute = ({ children }) => {
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    
    return !isAuthenticated ? children : <Navigate to="/" replace />;
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
                    <Login />
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
