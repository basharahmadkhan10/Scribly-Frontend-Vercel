import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  List, 
  Type, 
  Tags,
  Expand,
  Globe,
  Brain,
  Loader2,
  CheckCircle,
  AlertCircle,
  Settings,
  Wand2
} from 'lucide-react';
import aiService from '../services/ai.service';

const AISummarizer = ({ text, onTextUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState('');
  const [connectionTested, setConnectionTested] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Test connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      if (geminiService.isServiceAvailable() && !connectionTested) {
        const connected = await geminiService.testConnection();
        setIsConnected(connected);
        setConnectionTested(true);
      }
    };
    testConnection();
  }, []);

  const handleAIAction = async (action, options = {}) => {
    if (!text || text.trim().length < 10) {
      setError('✏️ Please write at least 10 characters first.');
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
        case 'academic':
          result = await geminiService.changeTone(text, 'academic');
          actionName = 'Made Academic';
          break;
        case 'creative':
          result = await geminiService.changeTone(text, 'creative');
          actionName = 'Made Creative';
          break;
        case 'concise':
          result = await geminiService.changeTone(text, 'concise');
          actionName = 'Made Concise';
          break;
        case 'tags':
          result = await geminiService.generateTags(text);
          actionName = 'Tags Generated';
          break;
        case 'expand':
          result = await geminiService.expandIdea(text);
          actionName = 'Idea Expanded';
          break;
        case 'translate':
          result = await geminiService.translate(text, options.language || 'Spanish');
          actionName = `Translated to ${options.language || 'Spanish'}`;
          break;
        default:
          result = text;
      }

      setLastResult({ action: actionName, result, timestamp: new Date() });
      
      if (onTextUpdate && result) {
        onTextUpdate(result);
      }
    } catch (err) {
      console.error('AI processing error:', err);
      setError(`❌ ${err.message || 'Failed to process. Check your API key.'}`);
    } finally {
      setLoading(false);
      setTimeout(() => setActiveAction(''), 500);
    }
  };

  const aiFeatures = [
    {
      id: 'summarize',
      label: 'Summarize',
      icon: <Sparkles size={20} />,
      description: 'Get concise summary',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      id: 'improve',
      label: 'Improve',
      icon: <Zap size={20} />,
      description: 'Enhance writing',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50'
    },
    {
      id: 'keyPoints',
      label: 'Key Points',
      icon: <List size={20} />,
      description: 'Extract main ideas',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    {
      id: 'expand',
      label: 'Expand',
      icon: <Expand size={20} />,
      description: 'Add more details',
      color: 'from-teal-500 to-green-500',
      bgColor: 'bg-gradient-to-br from-teal-50 to-green-50'
    },
    {
      id: 'tags',
      label: 'Tags',
      icon: <Tags size={20} />,
      description: 'Generate hashtags',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50'
    },
    {
      id: 'formal',
      label: 'Formal',
      icon: <Type size={20} />,
      description: 'Professional tone',
      color: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100'
    },
    {
      id: 'casual',
      label: 'Casual',
      icon: <Type size={20} />,
      description: 'Friendly tone',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50'
    }
  ];

  const toneFeatures = [
    {
      id: 'academic',
      label: 'Academic',
      icon: '📚',
      description: 'Scholarly tone',
      action: () => handleAIAction('academic')
    },
    {
      id: 'creative',
      label: 'Creative',
      icon: '🎨',
      description: 'Engaging tone',
      action: () => handleAIAction('creative')
    },
    {
      id: 'concise',
      label: 'Concise',
      icon: '⚡',
      description: 'To-the-point',
      action: () => handleAIAction('concise')
    }
  ];

  const translationLanguages = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' }
  ];

  const isAIAvailable = geminiService.isServiceAvailable();

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
            <Wand2 className="text-white" size={26} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-xl">AI Writing Assistant</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2.5 py-1 rounded-full ${isAIAvailable ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800'}`}>
                {isAIAvailable ? (isConnected ? '✅ Connected' : '✅ API Ready') : '⚠️ Demo Mode'}
              </span>
              <span className="text-xs text-gray-500">
                Powered by Gemini 1.5 Pro
              </span>
            </div>
          </div>
        </div>
        
        {!isAIAvailable && (
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all hover:scale-105"
          >
            Get Free API Key
          </a>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-5 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl animate-pulse">
          <p className="text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </p>
        </div>
      )}

      {lastResult && (
        <div className="mb-5 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl animate-fade-in">
          <p className="text-green-800 text-sm flex items-center gap-2">
            <CheckCircle size={18} />
            <span className="font-semibold">{lastResult.action} successfully!</span>
            <span className="text-gray-500 text-xs ml-auto">
              {lastResult.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>
      )}

      {/* Main AI Features Grid */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Quick Actions</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {aiFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleAIAction(feature.id)}
              disabled={loading}
              className={`
                ${feature.bgColor}
                p-4 rounded-xl border border-gray-200
                transition-all duration-300
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.05] hover:shadow-xl active:scale-95'}
                flex flex-col items-center justify-center gap-3
                relative overflow-hidden group
                min-h-[100px]
              `}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`relative z-10 ${loading && activeAction === feature.id ? 'text-gray-600' : 'text-gray-800'}`}>
                {loading && activeAction === feature.id ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <div className="scale-110 group-hover:scale-125 transition-transform">
                    {feature.icon}
                  </div>
                )}
              </div>
              
              {/* Labels */}
              <div className="relative z-10 text-center">
                <span className="text-sm font-bold text-gray-900 block">{feature.label}</span>
                <span className="text-[11px] text-gray-600 mt-1 block">{feature.description}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Tone Options */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Special Tones</h4>
          <div className="flex flex-wrap gap-2">
            {toneFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={feature.action}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <span className="text-lg">{feature.icon}</span>
                <span>{feature.label}</span>
                <span className="text-xs text-gray-500">{feature.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Translation Options */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
            <Globe size={16} />
            Translate To
          </h4>
          <div className="flex flex-wrap gap-2">
            {translationLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleAIAction('translate', { language: lang.name })}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-5 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-600">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={12} />
                  Processing with {isAIAvailable ? 'Gemini AI' : 'demo AI'}...
                </span>
              ) : isAIAvailable ? (
                <span className="flex items-center gap-2">
                  <Brain size={12} className="text-green-500" />
                  <span className="text-green-600 font-medium">Real AI Active:</span> Your text is processed by Google's Gemini 1.5 Pro
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <AlertCircle size={12} className="text-yellow-500" />
                  <span className="text-yellow-600 font-medium">Demo Mode:</span> Add your Gemini API key to Vercel for real AI features
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Settings size={12} />
              Get API Key
            </a>
            <button
              onClick={() => {
                localStorage.removeItem('ai_demo');
                window.location.reload();
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
              title="Refresh AI"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {/* API Key Instructions */}
        {!isAIAvailable && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>To enable real AI:</strong> 
              1. Get free API key from <a href="https://aistudio.google.com/app/apikey" className="underline font-semibold">Google AI Studio</a> → 
              2. Add <code className="bg-blue-100 px-1 rounded">REACT_APP_GEMINI_API_KEY=your_key_here</code> to Vercel environment variables → 
              3. Redeploy
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummarizer;
