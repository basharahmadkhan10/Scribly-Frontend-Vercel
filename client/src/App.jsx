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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 3000); // Reduced to 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      {showPreloader ? (
        <Preloader />
      ) : (
        <Suspense fallback={<Preloader minimal />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <Layout type="default">
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/login"
                element={
                  <Layout type="auth">
                    <Login />
                  </Layout>
                }
              />
              <Route
                path="/signup"
                element={
                  <Layout type="auth">
                    <Signup />
                  </Layout>
                }
              />
              <Route
                path="/notes"
                element={
                  <Layout type="protected">
                    <Notes />
                  </Layout>
                }
              />
              <Route
                path="/publicnotes"
                element={
                  <Layout type="protected">
                    <PublicNotes />
                  </Layout>
                }
              />
              {/* Add a fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      )}
    </ErrorBoundary>
  );
}

export default App;
