import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    this.genAI = null;
    this.model = null;
    this.isAvailable = false;
    
    if (this.apiKey && this.apiKey !== "your_actual_api_key_here") {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ 
          model: "gemini-pro",
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        });
        this.isAvailable = true;
        console.log("✅ Gemini AI service initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize Gemini:", error);
        this.isAvailable = false;
      }
    } else {
      console.warn("⚠️ Gemini API key not configured. Using mock mode.");
    }
  }

  isServiceAvailable() {
    return this.isAvailable;
  }

  async summarizeText(text) {
    if (!text || text.trim().length < 10) {
      return "Please provide longer text to summarize.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Summarize the following text in 2-3 concise sentences. Keep it brief and to the point:\n\n${text}`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } else {
        // Mock response for testing
        await new Promise(resolve => setTimeout(resolve, 800));
        return `📝 **AI Summary:**\n${text.substring(0, 150)}...\n\n*(Enable real AI by adding Gemini API key)*`;
      }
    } catch (error) {
      console.error("Summarize error:", error);
      return "Unable to generate summary at the moment. Please try again.";
    }
  }

  async improveWriting(text) {
    if (!text || text.trim().length < 10) {
      return text || "Please provide text to improve.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Improve the following text for better grammar, clarity, and flow. Keep the original meaning but make it more professional and readable:\n\n${text}`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `✨ **Improved Version:**\n${text}\n\n*(Add API key for real AI improvements)*`;
      }
    } catch (error) {
      console.error("Improve writing error:", error);
      return text;
    }
  }

  async extractKeyPoints(text) {
    if (!text || text.trim().length < 10) {
      return "Please provide longer text to extract key points.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Extract 3-5 main key points from the following text. Format them as clear, concise bullet points:\n\n${text}`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `🔑 **Key Points:**\n• Main idea 1\n• Main idea 2\n• Main idea 3\n\n*(Enable real AI for accurate key points)*`;
      }
    } catch (error) {
      console.error("Extract key points error:", error);
      return "Unable to extract key points. Please try again.";
    }
  }

  async changeTone(text, tone = "professional") {
    if (!text || text.trim().length < 10) {
      return text || "Please provide text to modify.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Rewrite the following text in a ${tone} tone while keeping the original meaning:\n\n${text}`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `🎭 **${tone.charAt(0).toUpperCase() + tone.slice(1)} Tone:**\n${text}\n\n*(Add API key for real tone changes)*`;
      }
    } catch (error) {
      console.error("Change tone error:", error);
      return text;
    }
  }

  async generateTags(text) {
    if (!text || text.trim().length < 10) {
      return "Please provide text to generate tags.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Generate 3-5 relevant hashtags or keywords for the following text. Format as comma-separated tags:\n\n${text}`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `🏷️ **Tags:** #summary #notes #keypoints\n\n*(Enable real AI for smart tags)*`;
      }
    } catch (error) {
      console.error("Generate tags error:", error);
      return "Unable to generate tags.";
    }
  }

  async expandIdea(text) {
    if (!text || text.trim().length < 5) {
      return "Please provide an idea to expand.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Expand on this idea and provide more details, examples, or related concepts:\n\n${text}`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `💡 **Expanded Idea:**\n${text}\n\nConsider adding more details and examples to develop this further.\n\n*(Add API key for AI-powered expansion)*`;
      }
    } catch (error) {
      console.error("Expand idea error:", error);
      return "Unable to expand idea.";
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService();
export default geminiService;
