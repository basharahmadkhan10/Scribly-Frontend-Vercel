import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const aiService = {
  // Test connection
  testConnection: async () => {
    try {
      const response = await api.get('/api/ai/health'); // ✅ Add /api here
      return response.data.success;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  },

  // AI Actions (all need /api prefix)
  summarizeText: async (text) => {
    const response = await api.post('/api/ai/summarize', { text });
    return response.data.result;
  },

  improveWriting: async (text) => {
    const response = await api.post('/api/ai/improve', { text });
    return response.data.result;
  },

  extractKeyPoints: async (text) => {
    const response = await api.post('/api/ai/key-points', { text });
    return response.data.result;
  },

  changeTone: async (text, tone) => {
    const response = await api.post('/api/ai/change-tone', { text, tone });
    return response.data.result;
  },

  generateTags: async (text) => {
    const response = await api.post('/api/ai/generate-tags', { text });
    return response.data.result;
  },

  expandIdea: async (text) => {
    const response = await api.post('/api/ai/expand', { text });
    return response.data.result;
  },

  translate: async (text, language) => {
    const response = await api.post('/api/ai/translate', { text, language });
    return response.data.result;
  },

  isServiceAvailable: () => true
};

export default aiService;
