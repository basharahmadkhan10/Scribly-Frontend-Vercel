import { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  List, 
  Type, 
  Tags,
  Expand,
  Brain,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import geminiService from '../services/gemini.service';

const AISummarizer = ({ text, onTextUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState('');

  const handleAIAction = async (action) => {
    if (!text || text.trim().length < 10) {
      setError('Please write at least 10 characters first.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setActiveAction(action);
    setError('');
    setLastResult(null);

    try {
      let result;
      let actionName = '';
      
      switch (action) {
        case 'summarize':
          result = await geminiService.summarizeText(text);
          actionName = 'Summarized';
          break;
        case 'improve':
          result = await geminiService.improveWriting(text);
          actionName = 'Improved';
          break;
        case 'keyPoints':
          result = await geminiService.extractKeyPoints(text);
          actionName = 'Key Points Extracted';
          break;
        case 'formal':
          result = await geminiService.changeTone(text, 'formal');
          actionName = 'Made Formal';
          break;
        case 'casual':
          result = await geminiService.changeTone(text, 'casual');
          actionName = 'Made Casual';
          break;
        case 'tags':
          result = await geminiService.generateTags(text);
          actionName = 'Tags Generated';
          break;
        case 'expand':
          result = await geminiService.expandIdea(text);
          actionName = 'Idea Expanded';
          break;
        default:
          result = text;
      }

      setLastResult({ action: actionName, result });
      
      if (onTextUpdate && result) {
        onTextUpdate(result);
      }
    } catch (err) {
      console.error('AI processing error:', err);
      setError('Failed to process. Please check your API key and try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setActiveAction(''), 500);
    }
  };

  const aiFeatures = [
    {
      id: 'summarize',
      label: 'Summarize',
      icon: <Sparkles size={18} />,
      description: 'Get a concise summary',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      id: 'improve',
      label: 'Improve',
      icon: <Zap size={18} />,
      description: 'Enhance writing quality',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50'
    },
    {
      id: 'keyPoints',
      label: 'Key Points',
      icon: <List size={18} />,
      description: 'Extract main ideas',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    {
      id: 'formal',
      label: 'Make Formal',
      icon: <Type size={18} />,
      description: 'Professional tone',
      color: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100'
    },
    {
      id: 'casual',
      label: 'Make Casual',
      icon: <Type size={18} />,
      description: 'Friendly tone',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50'
    },
    {
      id: 'tags',
      label: 'Generate Tags',
      icon: <Tags size={18} />,
      description: 'Create hashtags',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50'
    },
    {
      id: 'expand',
      label: 'Expand Idea',
      icon: <Expand size={18} />,
      description: 'Add more details',
      color: 'from-teal-500 to-green-500',
      bgColor: 'bg-gradient-to-br from-teal-50 to-green-50'
    }
  ];

  const isAIAvailable = geminiService.isServiceAvailable();

  return (
    <div className="mt-6 p-5 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Brain className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">AI Writing Assistant</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${isAIAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {isAIAvailable ? '✅ Real AI Active' : '⚠️ Demo Mode'}
              </span>
              <span className="text-xs text-gray-500">
                Powered by {isAIAvailable ? 'Gemini AI' : 'Mock Mode'}
              </span>
            </div>
          </div>
        </div>
        
        {!isAIAvailable && (
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full hover:shadow-md transition-shadow"
          >
            Get API Key
          </a>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </p>
        </div>
      )}

      {lastResult && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <p className="text-green-700 text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            <span className="font-medium">{lastResult.action} successfully!</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
        {aiFeatures.map((feature) => (
          <button
            key={feature.id}
            onClick={() => handleAIAction(feature.id)}
            disabled={loading}
            className={`
              ${feature.bgColor}
              p-3 rounded-xl border border-gray-200
              transition-all duration-200
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.03] hover:shadow-lg'}
              flex flex-col items-center justify-center gap-2
              relative overflow-hidden group
            `}
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className={`relative z-10 ${loading && activeAction === feature.id ? 'text-gray-600' : 'text-gray-800'}`}>
              {loading && activeAction === feature.id ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                feature.icon
              )}
            </div>
            
            <div className="relative z-10 text-center">
              <span className="text-xs font-semibold text-gray-800 block">{feature.label}</span>
              <span className="text-[10px] text-gray-600 mt-0.5 block">{feature.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-gray-600">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={12} />
                Processing with {isAIAvailable ? 'Gemini AI' : 'mock AI'}...
              </span>
            ) : isAIAvailable ? (
              '✨ Real AI features are active! Click any button above.'
            ) : (
              <>
                <span className="text-yellow-600 font-medium">Demo Mode:</span> Add Gemini API key to Vercel environment variables for real AI features.
              </>
            )}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
              title="Clear cache"
            >
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISummarizer;
