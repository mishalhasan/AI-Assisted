import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

// Bubble functionality for webpages
const colors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B739', // Orange
  '#EC7063', // Coral
  '#5DADE2', // Light Blue
  '#58D68D', // Green
];

function createBubblesOnPage() {
  const bubbleCount = 15;
  const bubblesContainer = document.createElement('div');
  bubblesContainer.id = 'ai-bubbles-container';
  bubblesContainer.className = 'ai-bubbles-container';
  document.body.appendChild(bubblesContainer);

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';
    
    const size = Math.random() * 40 + 15;
    const left = Math.random() * 100;
    const duration = Math.random() * 2 + 2;
    const delay = Math.random() * 0.3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = left + '%';
    bubble.style.bottom = '-50px';
    bubble.style.animationDuration = duration + 's';
    bubble.style.animationDelay = delay + 's';
    bubble.style.backgroundColor = color;
    bubble.style.borderColor = color;
    
    bubblesContainer.appendChild(bubble);
    
    // Remove bubble after animation
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.remove();
      }
    }, (duration + delay) * 1000 + 1000);
  }
  
  // Clean up container if empty
  setTimeout(() => {
    if (bubblesContainer && bubblesContainer.children.length === 0) {
      bubblesContainer.remove();
    }
  }, 6000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'popBubbles') {
    createBubblesOnPage();
    sendResponse({ success: true });
  }
  return true;
});

// Also allow manual triggering via console for testing
window.createBubbles = createBubblesOnPage;

// Create and inject bubble button on the page
function createBubbleButton() {
  // Check if button already exists
  if (document.getElementById('ai-bubbles-pop-button')) {
    return;
  }

  const button = document.createElement('button');
  button.id = 'ai-bubbles-pop-button';
  button.className = 'ai-bubbles-pop-button';
  button.textContent = '🎈 Pop!';
  button.title = 'Click to pop bubbles!';
  
  button.addEventListener('click', () => {
    createBubblesOnPage();
    // Add a small animation effect on click
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 100);
  });

  document.body.appendChild(button);
}

// Wait for page to load, then add button
if (document.body) {
  createBubbleButton();
} else {
  window.addEventListener('DOMContentLoaded', createBubbleButton);
}

// Also handle dynamic content (SPA navigation)
const observer = new MutationObserver(() => {
  if (!document.getElementById('ai-bubbles-pop-button') && document.body) {
    createBubbleButton();
  }
});

observer.observe(document.body || document.documentElement, {
  childList: true,
  subtree: true
});
