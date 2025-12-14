import { useState, useEffect } from "react";
import {
  FiSun,
  FiMoon,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiLogOut,
  FiSearch,
  FiCalendar,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AISummarizer from "../components/AISummarizer"; // Add this import
import axios from "axios"; // Add axios import for logout

export default function NotesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isPublic: false,
    startTime: "",
    endTime: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Close menu on escape or click outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleGoogleLink = () => {
    if (!token) return alert("Please login first");
    window.open(`https://scribly-backend-render.onrender.com/auth/google?token=${token}`, "_blank");
    setIsMenuOpen(false);
  };

  const fetchNotes = async () => {
    try {
      const res = await api.get("/api/v1/notes/getmynotes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch notes", err.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewNote((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newNote.startTime && newNote.endTime) {
      if (new Date(newNote.startTime) >= new Date(newNote.endTime)) {
        alert("End time must be after start time");
        return;
      }
    }

    const payload = {
      ...newNote,
      startTime: newNote.startTime
        ? new Date(newNote.startTime).toISOString()
        : null,
      endTime: newNote.endTime ? new Date(newNote.endTime).toISOString() : null,
    };

    try {
      if (editingId) {
        const res = await api.put(`/api/v1/notes/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updated = res.data.data.note || res.data.data || res.data;
        setNotes(
          notes.map((note) => (note._id === editingId ? updated : note))
        );
      } else {
        const res = await api.post("/api/v1/notes/createnote", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const createdNote = res.data.data.note || res.data.data || res.data;
        setNotes([...notes, createdNote]);
      }

      setNewNote({
        title: "",
        content: "",
        isPublic: false,
        startTime: "",
        endTime: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Error submitting note:", err.message);
      alert("Something went wrong while saving the note.");
    }
  };

  const handleEdit = (note) => {
    setNewNote({
      title: note.title,
      content: note.content,
      isPublic: note.isPublic,
      startTime: note.startTime
        ? new Date(note.startTime).toISOString().slice(0, 16)
        : "",
      endTime: note.endTime
        ? new Date(note.endTime).toISOString().slice(0, 16)
        : "",
    });
    setEditingId(note._id);
    // Scroll to form on mobile
    if (window.innerWidth < 768) {
      document.querySelector("form").scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await api.delete(`/api/v1/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(notes.filter((note) => note._id !== id));
      } catch (err) {
        console.error("Error deleting note:", err.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      // Clear ALL possible token storage locations first
      const tokenKeys = [
        "token",
        "accessToken",
        "refreshToken",
        "user",
        "authToken",
        "auth",
      ];

      tokenKeys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      // Clear cookies (if any)
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Clear auth-related cookies
        if (name.includes("token") || name.includes("auth")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });

      // Remove authorization header from axios defaults
      delete axios.defaults.headers.common["Authorization"];

      // Call logout API
      await api.post(
        "/api/v1/users/logout",
        {},
        {
          withCredentials: true, // Important for cookie-based auth
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Force a hard redirect to clear any cached data
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err.message);
      // Still clear local storage even if API call fails
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  // Add this function for AI text updates
  const handleAITextUpdate = (updatedText) => {
    setNewNote((prev) => ({
      ...prev,
      content: updatedText,
    }));
  };

  const filteredNotes = notes.filter((note) => {
    const title = note.title || "";
    const content = note.content || "";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
    } else {
      const matched = notes
        .filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((n) => n.title);
      setSuggestions([...new Set(matched)].slice(0, 5));
    }
  }, [searchTerm, notes]);

  return (
    <div
      className={`fixed inset-0 overflow-y-auto safe-area-padding ${
        darkMode ? "bg-black/65" : "bg-gradient-to-b from-black/30 to-black/70"
      }`}
      onClick={() => isMenuOpen && setIsMenuOpen(false)}
    >
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#000] z-40 shadow-2xl md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b dark:border-gray-700">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiX className="w-6 h-6 dark:text-white" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2"
              >
                <FiLogOut /> Logout
              </button>
              <button
                onClick={handleGoogleLink}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2"
              >
                <FiCalendar /> Link Google
              </button>
              <button
                onClick={() => {
                  navigate("/publicnotes");
                  setIsMenuOpen(false);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2"
              >
                🌍 Public Notes
              </button>
              <button
                onClick={toggleDarkMode}
                className="w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 dark:bg-[#414141] bg-gray-100 text-[#fff]"
              >
                {darkMode ? (
                  <>
                    <FiSun className="w-5 h-5" /> Light Mode
                  </>
                ) : (
                  <>
                    <FiMoon className="w-5 h-5" /> Dark Mode
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 z-20 p-3 sm:p-4 flex justify-between items-center w-full bg-transparent mb-10">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden p-2 rounded-lg bg-black/10 dark:bg-white/10"
        >
          <FiMenu className="w-6 h-6 dark:text-white text-black" />
        </button>

        {/* Desktop Navigation Left */}
        <div className="hidden md:flex gap-3 items-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 text-sm lg:text-base"
          >
            <FiLogOut /> <span className="hidden sm:inline">Logout</span>
          </button>
          <button
            onClick={handleGoogleLink}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 text-sm lg:text-base"
          >
            <FiCalendar /> <span className="hidden sm:inline">Link Google</span>
          </button>
          <button
            onClick={() => navigate("/publicnotes")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 text-sm lg:text-base"
          >
            🌍 <span className="hidden sm:inline">Public Notes</span>
          </button>
        </div>

        {/* Search Bar - Center on mobile, right on desktop */}
        <div className="flex-1 max-w-md mx-2 md:mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full p-2 pl-9 pr-3 rounded-full border border-gray-300 dark:border-[#000] bg-white dark:bg-gray-200 dark:text-black text-sm"
              style={{ fontSize: "16px" }} // Prevents iOS zoom on focus
            />
            <FiSearch className="absolute left-2.5 top-2.5 text-black" />
            {suggestions.length > 0 && isSearchFocused && (
              <div className="absolute top-full mt-1 w-full bg-black dark:bg-[#000] text-black dark:text-white shadow-lg rounded-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0"
                    onClick={() => setSearchTerm(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dark Mode Toggle - Desktop */}
        <button
          onClick={toggleDarkMode}
          className="hidden md:flex p-2 rounded-full bg-black/10 dark:bg-white/10 ml-2"
        >
          {darkMode ? (
            <FiSun className="w-5 h-5 text-white" />
          ) : (
            <FiMoon className="w-5 h-5 text-black" />
          )}
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-16 pb-4 mt-10 px-3 sm:px-4 min-h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`max-w-3xl mx-auto p-4 sm:p-6 rounded-xl shadow-xl ${
            darkMode ? "bg-black/20" : "bg-white/40"
          } backdrop-blur-sm`}
        >
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            My Notes
          </h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-6 sm:mb-8 space-y-3 sm:space-y-4"
          >
            <input
              type="text"
              name="title"
              placeholder="Note title"
              value={newNote.title}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base ${
                darkMode ? "bg-white/80 text-black" : "bg-white text-black"
              }`}
              required
              style={{ fontSize: "16px" }} // Prevents iOS zoom
            />
            <textarea
              name="content"
              placeholder="Note content"
              value={newNote.content}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base ${
                darkMode ? "bg-white/80 text-black" : "bg-white text-black"
              }`}
              required
              style={{ fontSize: "16px" }} // Prevents iOS zoom
            />

            {/* Add AI Summarizer component HERE */}
            <AISummarizer
              text={newNote.content}
              onTextUpdate={handleAITextUpdate}
            />

            {/* Date Time Inputs - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <label
                  className={`block mb-1 text-sm ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={newNote.startTime}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border bg-white text-black text-sm sm:text-base"
                  style={{ fontSize: "16px" }} // iOS compatibility
                />
              </div>
              <div className="flex-1">
                <label
                  className={`block mb-1 text-sm ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={newNote.endTime}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border bg-white text-black text-sm sm:text-base"
                  style={{ fontSize: "16px" }} // iOS compatibility
                />
              </div>
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={newNote.isPublic}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span
                className={`text-sm sm:text-base ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Make Public
              </span>
            </label>

            <button
              type="submit"
              className={`w-full py-2 sm:py-3 px-4 rounded-full font-medium transition-all text-sm sm:text-base ${
                darkMode
                  ? "bg-white text-black hover:bg-white/70"
                  : "bg-black text-white hover:bg-black/80"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {editingId ? "Update Note" : "Add Note"} <FiPlus />
              </span>
            </button>
          </form>

          {/* Notes List */}
          <div className="space-y-3 sm:space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
            {filteredNotes.length === 0 ? (
              <div
                className={`text-center py-8 rounded-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No notes found. {searchTerm && "Try a different search."}
              </div>
            ) : (
              filteredNotes.map((note, index) => (
                <motion.div
                  key={note._id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 sm:p-4 rounded-lg ${
                    darkMode
                      ? "bg-black/80 text-white"
                      : "bg-white/60 text-black"
                  } shadow`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm sm:text-base truncate">
                      {note.title}
                    </h3>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Edit note"
                      >
                        <FiEdit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="p-1.5 sm:p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                        aria-label="Delete note"
                      >
                        <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm sm:text-base break-words whitespace-pre-wrap">
                    {note.content}
                  </p>
                  {note.startTime && note.endTime && (
                    <p className="text-xs sm:text-sm mt-2 italic text-gray-400">
                      {new Date(note.startTime).toLocaleString()} -{" "}
                      {new Date(note.endTime).toLocaleString()}
                    </p>
                  )}
                  {note.isPublic && (
                    <p className="text-xs sm:text-sm mt-1 italic text-green-400">
                      Public
                    </p>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#000] border-t dark:border-gray-700 p-2 z-20">
        <div className="flex justify-around items-center">
          <button
            onClick={toggleDarkMode}
            className="flex flex-col items-center p-2"
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 mb-1 text-white" />
            ) : (
              <FiMoon className="w-5 h-5 mb-1 text-black" />
            )}
            <span className="text-xs dark:text-white text-black">Theme</span>
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center p-2"
          >
            <FiMenu className="w-5 h-5 mb-1 dark:text-white text-black" />
            <span className="text-xs dark:text-white text-black">Menu</span>
          </button>
          <button
            onClick={() => navigate("/publicnotes")}
            className="flex flex-col items-center p-2"
          >
            <span className="text-xl mb-1">🌍</span>
            <span className="text-xs dark:text-white text-black">Public</span>
          </button>
        </div>
      </div>
    </div>
  );
}
