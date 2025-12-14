import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
      const response = await api.get('/ai/health');
      return response.data.success;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  },

  // AI Actions
  summarizeText: async (text) => {
    const response = await api.post('/ai/summarize', { text });
    return response.data.result;
  },

  improveWriting: async (text) => {
    const response = await api.post('/ai/improve', { text });
    return response.data.result;
  },

  extractKeyPoints: async (text) => {
    const response = await api.post('/ai/key-points', { text });
    return response.data.result;
  },

  changeTone: async (text, tone) => {
    const response = await api.post('/ai/change-tone', { text, tone });
    return response.data.result;
  },

  generateTags: async (text) => {
    const response = await api.post('/ai/generate-tags', { text });
    return response.data.result;
  },

  expandIdea: async (text) => {
    const response = await api.post('/ai/expand', { text });
    return response.data.result;
  },

  translate: async (text, language) => {
    const response = await api.post('/ai/translate', { text, language });
    return response.data.result;
  },

  isServiceAvailable: () => true
};

export default aiService;
