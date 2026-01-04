import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  useEffect(() => {
    loadSummaries();
    loadApiKey();
  }, []);

  const loadApiKey = () => {
    chrome.storage.local.get(['openaiApiKey'], (result) => {
      if (result.openaiApiKey) {
        setApiKey(result.openaiApiKey);
        setApiKeySaved(true);
      }
      setLoading(false);
    });
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      chrome.storage.local.set({ openaiApiKey: apiKey.trim() }, () => {
        setApiKeySaved(true);
        setShowApiKeyInput(false);
      });
    }
  };

  const removeApiKey = () => {
    chrome.storage.local.remove(['openaiApiKey'], () => {
      setApiKey('');
      setApiKeySaved(false);
      setShowApiKeyInput(false);
    });
  };

  const loadSummaries = () => {
    chrome.storage.local.get(['summaries'], (result) => {
      const savedSummaries = result.summaries || [];
      setSummaries(savedSummaries);
    });
  };

  const deleteSummary = (id) => {
    const updatedSummaries = summaries.filter(s => s.id !== id);
    chrome.storage.local.set({ summaries: updatedSummaries }, () => {
      setSummaries(updatedSummaries);
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const openUrl = (url) => {
    chrome.tabs.create({ url });
  };

  if (loading) {
    return (
      <div className="popup-container">
        <div className="popup-header">
          <div className="popup-header-content">
            <div className="popup-icon-wrapper">
              <svg className="popup-blob-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C10 4 6 8 6 14C6 18 8 21 10 23C8 24 6 26 6 28C6 30 7 31 9 31C10 31 11 30 12 29C13 30 14 31 15 31H17C18 31 19 30 20 29C21 30 22 31 23 31C25 31 26 30 26 28C26 26 24 24 22 23C24 21 26 18 26 14C26 8 22 4 16 4Z" fill="#111827"/>
                <circle cx="16" cy="16" r="4" fill="white"/>
              </svg>
            </div>
            <h1>ExplainAIx</h1>
          </div>
        </div>
        <div className="popup-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <div className="popup-header-content">
          <div className="popup-icon-wrapper">
            <svg className="popup-blob-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4C10 4 6 8 6 14C6 18 8 21 10 23C8 24 6 26 6 28C6 30 7 31 9 31C10 31 11 30 12 29C13 30 14 31 15 31H17C18 31 19 30 20 29C21 30 22 31 23 31C25 31 26 30 26 28C26 26 24 24 22 23C24 21 26 18 26 14C26 8 22 4 16 4Z" fill="#111827"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          </div>
          <h1>ExplainAIx</h1>
        </div>
      </div>
      
      <div className="popup-settings">
        {showApiKeyInput ? (
          <div className="api-key-section">
            <h2 className="api-key-section-title">Enter API Key</h2>
            <div className="api-key-input-container">
              <input
                type="password"
                className="api-key-input"
                placeholder="sk-... or Your API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveApiKey()}
              />
              <button className="api-key-save-btn" onClick={saveApiKey}>
                Save
              </button>
            </div>
          </div>
        ) : apiKeySaved ? (
          <div className="api-key-section">
            <div className="api-key-saved">
              <div className="api-key-status-wrapper">
                <svg className="api-key-check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#10b981"/>
                  <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="api-key-status">API Key Configured</span>
              </div>
              <button className="api-key-remove-btn" onClick={removeApiKey}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="api-key-section">
            <button 
              className="api-key-btn"
              onClick={() => setShowApiKeyInput(true)}
            >
              Add OpenAI API Key
            </button>
          </div>
        )}
      </div>
      
      <div className="popup-content">
        <h2 className="popup-content-title">Saved Summaries</h2>
        {summaries.length === 0 ? (
          <div className="popup-empty">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>No summaries yet</h3>
            <p>Click the Explainx button on any webpage to create your first summary.</p>
          </div>
        ) : (
          <div className="summaries-list">
            {summaries.map((summary) => (
              <div key={summary.id} className="summary-card">
                <div className="summary-card-content-wrapper">
                  <h3 
                    className="summary-card-title"
                    onClick={() => openUrl(summary.url)}
                    title={summary.title}
                  >
                    {summary.title || 'Untitled'}
                  </h3>
                  <p className="summary-card-description">{truncateText(summary.text, 120)}</p>
                </div>
                <button
                  className="summary-remove-btn"
                  onClick={() => deleteSummary(summary.id)}
                  aria-label="Delete summary"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
