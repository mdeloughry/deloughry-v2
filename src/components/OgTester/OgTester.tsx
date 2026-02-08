import { useState, type FormEvent } from 'react';
import type { OgAnalysisResult } from './types';
import OgResults from './OgResults';
import OgPreview from './OgPreview';
import './OgTester.css';

export default function OgTester() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OgAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    let testUrl = url.trim();
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = 'https://' + testUrl;
      setUrl(testUrl);
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/og-tester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl }),
      });

      const data: OgAnalysisResult = await response.json();

      if (!data.success && data.error) {
        setError(data.error.message);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to analyze URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="og-tester">
      <div className="tester-intro">
        <p>
          Enter a URL to analyze its Open Graph meta tags. See how your links will
          appear when shared on social media platforms like Facebook, Twitter, and LinkedIn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="tester-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="url-input"
            disabled={isLoading}
            aria-label="URL to analyze"
          />
          {url && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
              aria-label="Clear URL"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="brutal-btn-primary analyze-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-text">Analyzing<span className="dots">...</span></span>
          ) : (
            'Analyze'
          )}
        </button>
      </form>

      {error && (
        <div className="error-message brutal-card">
          <span className="error-icon">✗</span>
          <p>{error}</p>
        </div>
      )}

      {result && result.success && (
        <div className="results-container">
          <OgResults validation={result.validation} />
          {result.result && <OgPreview result={result.result} url={result.url} />}
        </div>
      )}

      <div className="tester-examples">
        <p className="examples-label">Try these examples:</p>
        <div className="example-urls">
          {['https://github.com', 'https://twitter.com', 'https://dev.to'].map((exampleUrl) => (
            <button
              key={exampleUrl}
              type="button"
              className="example-btn"
              onClick={() => setUrl(exampleUrl)}
            >
              {new URL(exampleUrl).hostname}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
