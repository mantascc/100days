import { useState, useEffect } from 'react';
import { IndustrialView } from './components/IndustrialView';
import { sentimentEngine } from './lib/sentiment-engine';
import type { SentimentResult } from './lib/sentiment-engine';

function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);

  // Debounce logic
  useEffect(() => {
    // Clear result immediately when typing starts to show "listening" state
    if (result) setResult(null);

    const timer = setTimeout(() => {
      if (text.trim()) {
        console.log('Debounce triggered for:', text);
        handleAnalyze(text);
      } else {
        setResult(null);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [text]);

  const handleAnalyze = async (inputText: string) => {
    if (!inputText.trim()) return;

    console.log('Starting analysis for:', inputText);
    setLoading(true);
    try {
      const res = await sentimentEngine.predict(inputText);
      console.log('Analysis result:', res);
      setResult(res);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <IndustrialView
        text={text}
        onChange={setText}
        result={result}
        loading={loading}
      />
    </div>
  );
}

export default App;
