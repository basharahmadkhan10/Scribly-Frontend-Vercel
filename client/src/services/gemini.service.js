import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  constructor() {
    // API key from environment (set in Vercel)
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("⚠️ Gemini API key not configured");
      console.warn("Add REACT_APP_GEMINI_API_KEY to Vercel environment variables");
      this.isAvailable = false;
      return;
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      this.isAvailable = true;
    } catch (error) {
      console.error("❌ Failed to initialize Gemini:", error);
      this.isAvailable = false;
    }
  }

  isServiceAvailable() {
    return this.isAvailable;
  }

  async summarizeText(text) {
    if (!this.canProcess(text)) return "AI: Add API key in Vercel settings";
    
    try {
      const prompt = `Summarize this text in 2-3 sentences:\n\n${text}`;
      const result = await this.model.generateContent(prompt);
      return (await result.response).text();
    } catch (error) {
      console.error("Summarize error:", error);
      return "AI: Failed to summarize";
    }
  }

  async improveWriting(text) {
    if (!this.canProcess(text)) return text || "AI: Add API key";
    
    try {
      const prompt = `Improve this text for grammar and clarity:\n\n${text}`;
      const result = await this.model.generateContent(prompt);
      return (await result.response).text();
    } catch (error) {
      console.error("Improve error:", error);
      return text;
    }
  }

  async extractKeyPoints(text) {
    if (!this.canProcess(text)) return "AI: Add API key";
    
    try {
      const prompt = `Extract 3-5 key points as bullet points:\n\n${text}`;
      const result = await this.model.generateContent(prompt);
      return (await result.response).text();
    } catch (error) {
      console.error("Key points error:", error);
      return "AI: Failed to extract";
    }
  }

  async makeFormal(text) {
    if (!this.canProcess(text)) return text || "AI: Add API key";
    
    try {
      const prompt = `Rewrite in formal/professional tone:\n\n${text}`;
      const result = await this.model.generateContent(prompt);
      return (await result.response).text();
    } catch (error) {
      console.error("Formal error:", error);
      return text;
    }
  }

  async makeCasual(text) {
    if (!this.canProcess(text)) return text || "AI: Add API key";
    
    try {
      const prompt = `Rewrite in casual/friendly tone:\n\n${text}`;
      const result = await this.model.generateContent(prompt);
      return (await result.response).text();
    } catch (error) {
      console.error("Casual error:", error);
      return text;
    }
  }

  canProcess(text) {
    return this.isAvailable && text && text.trim().length > 10;
  }
}

// Create single instance
const geminiService = new GeminiService();
export default geminiService;
