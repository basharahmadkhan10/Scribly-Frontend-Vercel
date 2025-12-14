import api from "../utils/api";

class GeminiService {
  isServiceAvailable() {
    return true;
  }

  async summarizeText(text) {
    const res = await axios.post("/api/ai/summarize", { text });
    return res.data.result;
  }

  async improveWriting(text) {
    const res = await axios.post("/api/ai/improve", { text });
    return res.data.result;
  }

  async changeTone(text, tone) {
    const res = await axios.post("/api/ai/tone", { text, tone });
    return res.data.result;
  }
}

export default new GeminiService();
