
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * HELLO HEALTHY - BIOLOGICAL MAIN ENTRY
 * Initializes the React 19 core and establishes the root mount point.
 */

console.log("%c[SYSTEM]%c Biological Core Initializing...", "color: #4CAF50; font-weight: bold", "color: inherit");

const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorMsg = "Critical Failure: Could not find root element '#root'. Verify index.html contains <div id='root'></div>";
  console.error(errorMsg);
  
  // Create a visible emergency overlay if the root is missing
  const errContainer = document.createElement('div');
  errContainer.style.cssText = 'position:fixed;inset:0;background:#212121;color:#ff5555;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;padding:20px;z-index:99999;';
  errContainer.innerHTML = `<div><h1 style="font-size:24px;margin-bottom:16px;font-weight:900;">BIOLOGICAL CORE OFFLINE</h1><p style="opacity:0.7;">${errorMsg}</p></div>`;
  document.body.appendChild(errContainer);
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("%c[SYSTEM]%c Neural Link Established. App Rendered.", "color: #4CAF50; font-weight: bold", "color: inherit");
  } catch (err) {
    console.error("%c[SYSTEM ERROR]%c Initialization Crash:", "color: #ff5555; font-weight: bold", "color: inherit", err);
  }
}
