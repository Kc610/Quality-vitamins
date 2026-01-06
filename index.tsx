import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * HELLO HEALTHY: SYSTEM INITIALIZATION
 * Establishing Neural Performance Baseline
 */
const mount = () => {
  const container = document.getElementById('root');

  // ROBUST MOUNT: If root node is not yet available, retry after short interval
  if (!container) {
    setTimeout(mount, 100);
    return;
  }

  try {
    const root = createRoot(container);
    
    // Performance optimized render
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Controlled transition phase
    // Wait for the stack to clear and React to handle initial paint
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        document.body.classList.add('loaded');
        
        // System identity log
        console.log(
          `%c HELLO HEALTHY %c BIOLOGICAL LINK ESTABLISHED %c NODE: v1.0.5-STABLE `,
          "background: #4CAF50; color: #111; font-weight: 900; padding: 4px 8px; border-radius: 4px 0 0 4px;",
          "background: #111; color: #4CAF50; font-weight: 900; padding: 4px 8px; border: 1px solid #4CAF50;",
          "background: #333; color: #888; font-weight: 400; padding: 4px 8px; border-radius: 0 4px 4px 0;"
        );
        
        console.log(
          "%c[STATUS]%c Neural engine synchronized. All performance modules active.",
          "color: #4CAF50; font-weight: bold;",
          "color: #888;"
        );
      }, 300); // Slightly faster transition
    });

  } catch (err) {
    console.group("%c[LINK FAILURE]%c Fatal Error during Synthesis", "color: #FF5252; font-weight: 900", "color: white");
    console.error(err);
    console.groupEnd();
  }
};

// Initial trigger
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mount();
} else {
  window.addEventListener('DOMContentLoaded', mount);
}
