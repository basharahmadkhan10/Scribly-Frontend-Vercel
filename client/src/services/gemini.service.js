// Simple mock service for now
class GeminiService {
  constructor() {
    this.isAvailable = false;
  }

  isServiceAvailable() {
    return this.isAvailable;
  }

  async summarizeText(text) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Summary: ${text.substring(0, 150)}...`;
  }

  async improveWriting(text) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Improved: ${text}`;
  }

  async extractKeyPoints(text) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `• Main point 1\n• Main point 2\n• Main point 3`;
  }
}

export default new GeminiService();
