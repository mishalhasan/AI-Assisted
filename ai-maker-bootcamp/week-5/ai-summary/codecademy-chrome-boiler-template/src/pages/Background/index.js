// Background service worker for Explainx extension
import OpenAI from 'openai';

console.log('Explainx background service worker loaded.');

let openaiClient = null;

// Initialize OpenAI client when API key is available
function initializeOpenAI(apiKey) {
  if (apiKey && apiKey.trim()) {
    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Required for Chrome extensions
    });
    return true;
  }
  return false;
}

// Load API key from storage on startup
chrome.storage.local.get(['openaiApiKey'], (result) => {
  if (result.openaiApiKey) {
    initializeOpenAI(result.openaiApiKey);
  }
});

// Listen for API key updates
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.openaiApiKey) {
    initializeOpenAI(changes.openaiApiKey.newValue);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateSummary') {
    const { pageText, pageTitle, url } = request;
    
    // Check if API key is available
    if (!openaiClient) {
      chrome.storage.local.get(['openaiApiKey'], (result) => {
        if (result.openaiApiKey && initializeOpenAI(result.openaiApiKey)) {
          generateSummary(pageText, pageTitle, url, sendResponse);
        } else {
          sendResponse({ 
            success: false, 
            error: 'OpenAI API key not configured. Please add your API key in the extension popup.' 
          });
        }
      });
      return true; // Keep channel open for async response
    }
    
    generateSummary(pageText, pageTitle, url, sendResponse);
    return true; // Keep channel open for async response
  }
});

async function generateSummary(pageText, pageTitle, url, sendResponse) {
  try {
    // Truncate text if too long (OpenAI has token limits)
    const maxChars = 8000; // Leave room for prompt
    const truncatedText = pageText.length > maxChars 
      ? pageText.substring(0, maxChars) + '...' 
      : pageText;
    
    const prompt = `Please provide a concise summary of the following webpage content. Format your response as a bulleted list with 3-5 key points. Be clear and informative.

Title: ${pageTitle}
URL: ${url}

Content:
${truncatedText}

Summary:`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const summaryText = response.choices[0]?.message?.content || 'Unable to generate summary.';
    
    // Parse bullet points from the response
    const bulletPoints = summaryText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[-•*]\s*/, '')) // Remove bullet markers
      .filter(line => line.length > 0);
    
    sendResponse({ 
      success: true, 
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : [summaryText],
      fullText: summaryText
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Failed to generate summary. Please check your API key and try again.' 
    });
  }
}
