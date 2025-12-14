
import api from './api'; // Your Axios instance that points to backend

const aiService = {
  summarizeText: async (text) => {
    const response = await api.post('/ai/summarize', { text });
    return response.data.result || response.data;
  },
  
  improveWriting: async (text) => {
    const response = await api.post('/ai/improve', { text });
    return response.data.result || response.data;
  },
  
  extractKeyPoints: async (text) => {
    const response = await api.post('/ai/key-points', { text });
    return response.data.result || response.data;
  },
  
  changeTone: async (text, tone) => {
    const response = await api.post('/ai/change-tone', { text, tone });
    return response.data.result || response.data;
  },
  
  generateTags: async (text) => {
    const response = await api.post('/ai/generate-tags', { text });
    return response.data.result || response.data;
  },
  
  expandIdea: async (text) => {
    const response = await api.post('/ai/expand', { text });
    return response.data.result || response.data;
  },
  
  translate: async (text, language) => {
    const response = await api.post('/ai/translate', { text, language });
    return response.data.result || response.data;
  },
  
  testConnection: async () => {
    try {
      await api.get('/ai/health');
      return true;
    } catch {
      return false;
    }
  },
  
  isServiceAvailable: () => true
};

export default aiService;
