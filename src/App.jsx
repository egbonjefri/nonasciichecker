import React, { useState, useMemo } from 'react';
import { AlertCircle, FileText, Search } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const results = useMemo(() => {
    if (!input) return null;

    const nonAsciiChars = new Set();
    const positions = new Set();

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const code = char.charCodeAt(0);
      
      if (code > 127) {
        nonAsciiChars.add(char);
        positions.add(i);
      }
    }

    return {
      found: nonAsciiChars.size > 0,
      chars: Array.from(nonAsciiChars),
      positions: positions,
      total: positions.size
    };
  }, [input]);

  const highlightedText = useMemo(() => {
    if (!input || !results?.found) return input;

    const parts = [];
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const code = char.charCodeAt(0);
      
      if (code > 127) {
        parts.push(
          <mark key={i} className="bg-yellow-300 font-bold px-0.5">
            {char}
          </mark>
        );
      } else {
        parts.push(char);
      }
    }
    return parts;
  }, [input, results]);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Non-ASCII Character Checker</h1>
          </div>

          <div className="mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your prompt here (50,000+ characters)..."
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm"
            />
            <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
              <span>{input.length.toLocaleString()} characters</span>
              <button
                onClick={handleProcess}
                disabled={!input}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {results && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-800">Results</h2>
              </div>

              {results.found ? (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">
                          Found {results.total} non-ASCII character{results.total !== 1 ? 's' : ''} 
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="bg-white p-4 rounded border border-gray-300 max-h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap break-words">
                      {highlightedText}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✓ No non-ASCII characters found. All characters are standard ASCII (0-127).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;