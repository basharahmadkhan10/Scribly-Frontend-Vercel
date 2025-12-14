import { useState } from 'react';
import { Sparkles, Zap, List, Type, Loader2 } from 'lucide-react';
import geminiService from '../services/gemini.service';

const AISummarizer = ({ text, onTextUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState('');

  const aiFeatures = [
    {
      id: 'summarize',
      label: 'Summarize',
      icon: <Sparkles size={18} />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'improve',
      label: 'Improve',
      icon: <Zap size={18} />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      id: 'keyPoints',
      label: 'Key Points',
      icon: <List size={18} />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'formal',
      label: 'Formal',
      icon: <Type size={18} />,
      color: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700'
    },
    {
      id: 'casual',
      label: 'Casual',
      icon: <Type size={18} />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  const handleAIClick = async (action) => {
    // Check if text is long enough
    if (!text || text.trim().length < 10) {
      alert('Please write at least 10 characters to use AI features.');
      return;
    }

    // Check if AI service is available
    if (!geminiService.isServiceAvailable()) {
      alert('AI features require Gemini API key. Add REACT_APP_GEMINI_API_KEY to Vercel environment variables.');
      return;
    }

    setLoading(true);
    setCurrentAction(action);

    try {
      let result;
      switch (action) {
        case 'summarize':
          result = await geminiService.summarizeText(text);
          break;
        case 'improve':
          result = await geminiService.improveWriting(text);
          break;
        case 'keyPoints':
          result = await geminiService.extractKeyPoints(text);
          break;
        case 'formal':
          result = await geminiService.makeFormal(text);
          break;
        case 'casual':
          result = await geminiService.makeCasual(text);
          break;
        default:
          result = text;
      }

      // Update the note content
      if (onTextUpdate && result) {
        onTextUpdate(result);
      }
    } catch (error) {
      console.error('AI processing failed:', error);
      alert('AI processing failed. Please check console for details.');
    } finally {
      setLoading(false);
      setCurrentAction('');
    }
  };

  return (
    <div className="mt-6 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Sparkles className="text-white" size={22} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">AI Writing Assistant</h3>
          <p className="text-sm text-gray-600">Enhance your notes with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {aiFeatures.map((feature) => (
          <button
            key={feature.id}
            onClick={() => handleAIClick(feature.id)}
            disabled={loading}
            className={`
              p-3 rounded-lg border transition-all duration-200
              ${feature.bgColor} border-gray-200
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:scale-[1.02]'}
              flex flex-col items-center justify-center gap-2
            `}
          >
            <div className={`p-2 rounded-full ${feature.bgColor}`}>
              {loading && currentAction === feature.id ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <div className={feature.textColor}>
                  {feature.icon}
                </div>
              )}
            </div>
            <span className={`font-medium text-sm ${feature.textColor}`}>
              {feature.label}
            </span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg mb-3">
          <p className="text-blue-700 text-sm flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={16} />
            Processing with AI. This may take a few seconds...
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {geminiService.isServiceAvailable() 
            ? '✨ AI features are ready! Click any button above.'
            : '⚠️ Add REACT_APP_GEMINI_API_KEY to Vercel environment variables to enable AI.'
          }
        </p>
      </div>
    </div>
  );
};

export default AISummarizer;
