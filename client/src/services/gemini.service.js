import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  constructor() {
    // IMPORTANT: Your API key from https://aistudio.google.com/app/api-keys
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    console.log("🔑 API Key status:", this.apiKey ? "Found" : "Not found");
    
    if (this.apiKey && this.apiKey.length > 30) { // Valid API keys are usually long
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
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        });
        this.isAvailable = true;
        console.log("✅ Gemini AI 1.5 Pro initialized successfully!");
      } catch (error) {
        console.error("❌ Failed to initialize Gemini:", error);
        this.isAvailable = false;
      }
    } else {
      console.warn("⚠️ Gemini API key not configured or invalid");
      console.warn("Add REACT_APP_GEMINI_API_KEY to Vercel environment variables");
      this.isAvailable = false;
    }
  }

  isServiceAvailable() {
    return this.isAvailable;
  }

  async testConnection() {
    if (!this.isAvailable) return false;
    
    try {
      const prompt = "Say 'Hello' in one word";
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      console.log("🔗 Gemini connection test:", response.text());
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }

  async summarizeText(text) {
    if (!text || text.trim().length < 10) {
      return "Please provide longer text to summarize (at least 10 characters).";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Summarize this text in 2-3 concise sentences. Focus on the main ideas:\n\n"${text}"\n\nSummary:`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return `📝 **Summary**\n${response.text()}`;
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `📝 **Demo Summary**\n${text.substring(0, 100)}...\n\n*[Add your Gemini API key to Vercel for real AI summaries]*`;
      }
    } catch (error) {
      console.error("Summarize error:", error);
      return `⚠️ **Error**: ${error.message || "Failed to generate summary"}`;
    }
  }

  async improveWriting(text) {
    if (!text || text.trim().length < 10) {
      return text || "Please provide text to improve.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Improve this text for grammar, clarity, and flow. Keep the original meaning but make it more professional:\n\n"${text}"\n\nImproved version:`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return `✨ **Improved Version**\n${response.text()}`;
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `✨ **Demo Improvement**\n${text}\n\n*[Enable real AI for professional improvements]*`;
      }
    } catch (error) {
      console.error("Improve writing error:", error);
      return text;
    }
  }

  async extractKeyPoints(text) {
    if (!text || text.trim().length < 20) {
      return "Please provide longer text to extract key points.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Extract 3-5 main key points from this text as bullet points:\n\n"${text}"\n\nKey points:`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return `🔑 **Key Points**\n${response.text()}`;
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `🔑 **Demo Key Points**\n• Main idea 1\n• Main idea 2\n• Main idea 3\n\n*[Add API key for accurate extraction]*`;
      }
    } catch (error) {
      console.error("Extract key points error:", error);
      return "⚠️ Failed to extract key points";
    }
  }

  async changeTone(text, tone = "professional") {
    if (!text || text.trim().length < 10) {
      return text || "Please provide text to modify.";
    }

    const toneMap = {
      formal: "very formal and professional",
      casual: "casual and friendly",
      academic: "academic and scholarly",
      creative: "creative and engaging",
      concise: "very concise and to-the-point"
    };

    try {
      if (this.isAvailable) {
        const prompt = `Rewrite this text in a ${toneMap[tone] || tone} tone:\n\n"${text}"\n\n${tone.charAt(0).toUpperCase() + tone.slice(1)} version:`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return `🎭 **${tone.charAt(0).toUpperCase() + tone.slice(1)} Tone**\n${response.text()}`;
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `🎭 **Demo ${tone} Tone**\n${text}\n\n*[Enable real AI for tone transformation]*`;
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
        const prompt = `Generate 5-7 relevant hashtags or keywords for this text. Format as comma-separated tags:\n\n"${text}"\n\nTags:`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return `🏷️ **Tags**\n${response.text()}`;
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `🏷️ **Demo Tags**\n#summary, #notes, #keypoints, #ai, #writing\n\n*[Get smart AI-generated tags]*`;
      }
    } catch (error) {
      console.error("Generate tags error:", error);
      return "⚠️ Failed to generate tags";
    }
  }

  async expandIdea(text) {
    if (!text || text.trim().length < 5) {
      return "Please provide an idea to expand.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Expand on this idea. Add more details, examples, explanations, and related concepts:\n\n"${text}"\n\nExpanded version:`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return `💡 **Expanded Idea**\n${response.text()}`;
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `💡 **Demo Expansion**\n${text}\n\nConsider adding more details, examples, and explanations to develop this idea further.\n\n*[Add API key for AI-powered expansion]*`;
      }
    } catch (error) {
      console.error("Expand idea error:", error);
      return "⚠️ Failed to expand idea";
    }
  }

  async translate(text, language = "Spanish") {
    if (!text || text.trim().length < 5) {
      return "Please provide text to translate.";
    }

    try {
      if (this.isAvailable) {
        const prompt = `Translate this text to ${language}:\n\n"${text}"\n\nTranslation:`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return `🌐 **${language} Translation**\n${response.text()}`;
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `🌐 **Demo Translation**\n[${language} translation placeholder]\n\n*[Enable real AI for accurate translation]*`;
      }
    } catch (error) {
      console.error("Translate error:", error);
      return "⚠️ Failed to translate";
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService();
export default geminiService;
