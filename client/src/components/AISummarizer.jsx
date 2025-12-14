import { useState } from 'react';
import { Sparkles, Zap, List, Loader2 } from 'lucide-react';

const AISummarizer = ({ text, onTextUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock AI functions - replace with real API calls
  const mockSummarize = async (text) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Summary: ${text.substring(0, 100)}...`;
  };

  const mockImprove = async (text) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Improved version: ${text}`;
  };

  const mockKeyPoints = async (text) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `• Key point 1\n• Key point 2\n• Key point 3`;
  };

  const handleAIAction = async (action) => {
    if (!text || text.trim().length < 10) {
      setError('Please write at least 10 characters first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      switch (action) {
        case 'summarize':
          result = await mockSummarize(text);
          break;
        case 'improve':
          result = await mockImprove(text);
          break;
        case 'keyPoints':
          result = await mockKeyPoints(text);
          break;
        default:
          result = text;
      }

      if (onTextUpdate && result) {
        onTextUpdate(result);
      }
    } catch (err) {
      console.error('AI Error:', err);
      setError('AI processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: 'summarize',
      label: 'Summarize',
      icon: <Sparkles size={18} />,
      color: 'blue'
    },
    {
      id: 'improve',
      label: 'Improve',
      icon: <Zap size={18} />,
      color: 'green'
    },
    {
      id: 'keyPoints',
      label: 'Key Points',
      icon: <List size={18} />,
      color: 'purple'
    }
  ];

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-blue-500" size={20} />
        <h3 className="font-semibold text-gray-800">AI Assistant</h3>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-3">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => handleAIAction(feature.id)}
            disabled={loading}
            className={`
              p-3 rounded-lg border transition-all
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
              bg-${feature.color}-50 text-${feature.color}-700 border-${feature.color}-200
              flex flex-col items-center gap-2
            `}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              feature.icon
            )}
            <span className="text-sm font-medium">{feature.label}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center">
        {loading 
          ? 'Processing with AI...' 
          : 'Click a button to enhance your text (demo mode)'
        }
      </p>
    </div>
  );
};

export default AISummarizer;
