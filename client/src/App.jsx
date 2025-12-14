import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Preloader from "./components/Preloader";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000); // Reduced to 2 seconds for better UX

    return () => clearTimeout(timer);
  }, []);

  // Component to redirect logged-in users away from auth pages
  const PublicOnlyRoute = ({ children }) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    
    if (token) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <ErrorBoundary>
      {showPreloader ? (
        <Preloader />
      ) : (
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

              {/* Auth Pages - Only accessible when NOT logged in */}
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

              {/* Protected Pages - Require authentication */}
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
              
              <Route
                path="/publicnotes"
                element={
                  <Layout>
                    <PublicNotes />
                  </Layout>
                }
              />

              {/* 404 Page */}
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
      )}
    </ErrorBoundary>
  );
}

export default App;
