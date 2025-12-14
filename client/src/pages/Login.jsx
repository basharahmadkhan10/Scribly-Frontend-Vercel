import { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function LoginPage({ setIsAuthenticated }) {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/v1/users/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // Extract token from response
      const token = response.data?.accessToken || 
                   response.data?.data?.accessToken || 
                   response.data?.token;
      
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token saved to localStorage:", token);
      } else {
        console.error("No token found in response:", response.data);
        throw new Error("No authentication token received");
      }

      // Update auth state in parent (App.jsx)
      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }
      
      // Redirect to notes after a short delay
      setTimeout(() => {
        navigate("/notes", { replace: true });
      }, 100);
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden ${
        darkMode ? "bg-black/65" : "bg-gradient-to-b from-black/30 to-black/70"
      }`}
    >
      {/* Navigation */}
      <nav className="fixed top-0 right-0 z-20 p-6">
        <div className="flex items-center gap-8">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full focus:outline-none"
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 text-white" />
            ) : (
              <FiMoon className="w-5 h-5 text-black" />
            )}
          </button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <Link
              to="/signup"
              className="relative text-l bg-black font-medium px-5 py-2 rounded-xl text-white overflow-hidden group block"
            >
              <span className="relative z-10">Sign Up</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.4 }}
              />
            </Link>
          </motion.div>
        </div>
      </nav>

      <div className="relative z-10 h-full flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md p-8 rounded-xl shadow-xl ${
            darkMode ? "bg-black/50" : "bg-white/55"
          } backdrop-blur-sm`}
        >
          <div className="text-center mb-8">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-32 mx-auto mb-6"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<h1 className="text-4xl font-bold text-purple-600">Scribly</h1>';
              }}
            />
            <h1
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Welcome Back
            </h1>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-800"}`}>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="email"
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-white/80 border-gray-600 text-black"
                    : "bg-white border-gray-300 text-black"
                }`}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-white/80 border-gray-600 text-black"
                    : "bg-white border-gray-300 text-black"
                }`}
                required
                disabled={loading}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-full text-lg font-medium transition-all relative overflow-hidden group ${
                darkMode
                  ? "bg-white text-black hover:bg-white/80"
                  : "bg-black text-white hover:bg-black/80"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </span>
              {!loading && (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </button>

            <div className="text-center mt-6 space-y-3">
              <Link
                to="/forgot-password"
                className={`text-sm ${
                  darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-gray-700 hover:text-blue-500"
                } transition-colors block`}
              >
                Forgot password?
              </Link>
              
              <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className={`font-medium ${
                      darkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-500"
                    } transition-colors`}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Debug panel - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded text-xs">
          <div>Token in localStorage: {localStorage.getItem("token") ? "Yes" : "No"}</div>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="mt-2 text-red-400 hover:text-red-300"
          >
            Clear Storage
          </button>
        </div>
      )}
    </div>
  );
}
