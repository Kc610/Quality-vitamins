import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mount = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Smooth transition from the initial system loader
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 400);
    
    console.log("%c[SYSTEM]%c Biological Link Established. Hello Healthy Node Online.", "color: #4CAF50; font-weight: 900", "color: white");
  } catch (err) {
    console.error("Critical link failure:", err);
  }
};

if (document.readyState === 'complete') mount();
else window.addEventListener('load', mount);