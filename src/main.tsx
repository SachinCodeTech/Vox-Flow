import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for ResizeObserver loop limit exceeded error
const resizeObserverErrorHandler = (e: any) => {
  const messages = [
    'ResizeObserver loop completed with undelivered notifications.',
    'ResizeObserver loop limit exceeded'
  ];
  
  // Get message from various possible error objects
  const msg = e.message || (e.reason && e.reason.message) || (e.error && e.error.message) || (e.detail && e.detail.message) || e.toString();
  
  const isResizeObserverError = messages.some(m => msg && msg.includes(m));

  if (isResizeObserverError) {
    e.stopImmediatePropagation();
    if (e.preventDefault) e.preventDefault();
    // Return true to prevent default browser logging for window.onerror
    return true;
  }
};

window.addEventListener('error', resizeObserverErrorHandler);
window.addEventListener('unhandledrejection', resizeObserverErrorHandler);

// Also set it directly on window.onerror for older browser support or specific event streams
const oldOnError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  if (typeof message === 'string' && (message.includes('ResizeObserver') || message.includes('loop limit exceeded'))) {
    return true;
  }
  if (oldOnError) return oldOnError(message, source, lineno, colno, error);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
