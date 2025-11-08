import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const checkSpam = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickExamples = [
    {
      text: "Congratulations! You've won a 1000rs DMart gift card. Text YES to claim.",
      type: "spam"
    },
    {
      text: "Hey, are we still meeting for lunch tomorrow?",
      type: "ham"
    },
    {
      text: "URGENT: Your bank account has been compromised. Click here to secure it.",
      type: "spam"
    },
    {
      text: "Mom, can you pick up some milk on your way home?",
      type: "ham"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex justify-center items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            📱
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Spam Shield
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered spam detection that keeps your inbox clean and secure
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Input */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Check Your Message</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Powered</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter your SMS message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste or type your message here...&#10;Example: 'Congratulations! You won a 1000rs DMart gift card'"
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={checkSpam}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg disabled:shadow-none"
              >
                <div className="flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Detect Spam</span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={() => setMessage('')}
                disabled={loading}
                className="px-6 py-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Clear
              </button>
            </div>

            {/* Quick Examples */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Try these examples:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(example.text)}
                    disabled={loading}
                    className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-2">
                      <span className={`text-sm ${
                        example.type === 'spam' ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {example.type === 'spam' ? '🚫' : '✅'}
                      </span>
                      <span className="text-xs text-gray-600 group-hover:text-gray-800 flex-1">
                        {example.text.slice(0, 50)}...
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Results & Info */}
        <div className="space-y-8">
          {/* Results Card */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Result</h2>

              {result.error ? (
                <div className="text-red-500 text-center py-4">
                  ⚠️ {result.error}
                </div>
              ) : (
                <>
                  {/* Prediction Badge */}
                  <div className={`text-center mb-6 p-4 rounded-xl ${
                    result.is_spam 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="text-4xl mb-2">
                      {result.is_spam ? '🚫' : '✅'}
                    </div>
                    <div className={`text-2xl font-bold ${
                      result.is_spam ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {result.prediction}
                    </div>
                    <div className="text-gray-600 mt-1">
                      {(result.confidence * 100).toFixed(1)}% confidence
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Confidence Level</span>
                      <span>{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          result.is_spam ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Spam Score</span>
                      <span className="font-semibold">{result.spam_score}/10</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Indicators Found</span>
                      <span className="font-semibold">{result.spam_score} patterns</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-gray-600">Analysis:</span>
                      <p className="text-gray-800 mt-1">{result.message}</p>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(message)}
                    className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>{copied ? '✓ Copied!' : '📋 Copy Message'}</span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">How it works</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">🔍</div>
                <span>Analyzes message content and patterns</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">⚡</div>
                <span>Real-time AI detection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">🛡️</div>
                <span>Protects against common spam tactics</span>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Spam Warning Signs</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-red-500">•</span>
                <span>Urgent action required</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500">•</span>
                <span>Too good to be true offers</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500">•</span>
                <span>Requests for personal information</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500">•</span>
                <span>Suspicious links or phone numbers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <div className="text-gray-500 text-sm">
          <p>Built with Next.js • Deployed on Vercel • AI-Powered Detection</p>
          <p className="mt-1">Keep your inbox safe from spam threats</p>
        </div>
      </div>
    </div>
  );
}