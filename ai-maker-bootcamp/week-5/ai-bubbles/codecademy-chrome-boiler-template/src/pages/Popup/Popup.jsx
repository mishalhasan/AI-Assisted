import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup = () => {
  const [bubbles, setBubbles] = useState([]);

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

  const createBubble = () => {
    const bubbleCount = 15; // Create 15 bubbles per click
    const newBubbles = [];
    
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = {
        id: Date.now() + Math.random() + i,
        left: Math.random() * 100 + '%',
        size: Math.random() * 40 + 15 + 'px',
        duration: Math.random() * 2 + 2 + 's',
        delay: Math.random() * 0.3 + 's',
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      newBubbles.push(bubble);
    }
    
    setBubbles((prev) => [...prev, ...newBubbles]);
    
    // Remove bubbles after animation completes
    newBubbles.forEach((bubble) => {
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
      }, 5000);
    });

    // Send message to content script to create bubbles on webpage
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'popBubbles' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Error sending message:', chrome.runtime.lastError.message);
          }
        });
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Popup/Popup.jsx</code> and save to reload.
        </p>
        <button className="pop-button" onClick={createBubble}>
          Pop!
        </button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
      <div className="bubbles-container">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animationDuration: bubble.duration,
              animationDelay: bubble.delay,
              backgroundColor: bubble.color,
              borderColor: bubble.color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Popup;
