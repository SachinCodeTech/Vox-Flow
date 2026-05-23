import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for ResizeObserver loop limit exceeded error
const resizeObserverErrorHandler = (e: any) => {
  try {
    const messages = [
      'ResizeObserver loop completed with undelivered notifications.',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completion',
      'ResizeObserver loop limit',
      'ResizeObserver'
    ];
    
    // Check various error message locations
    const msg = typeof e === 'string' 
      ? e 
      : e?.message || e?.reason?.message || e?.error?.message || 
        (e?.detail && typeof e.detail === 'string' ? e.detail : null) ||
        (e?.target?.message) || (e?.srcElement?.message);

    const isResizeObserverError = msg && typeof msg === 'string' && (
      messages.some(m => msg.includes(m)) || 
      /ResizeObserver/i.test(msg)
    );

    if (isResizeObserverError) {
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
      
      // Some environments use a different event structure
      if (e.error && e.error.message) {
         // Silencing the internal error if possible
      }

      // Console.debug instead of info to be even less intrusive but still confirm suppression
      // Use the raw console for debugging so we don't trigger the monkey-patch
      const originalDebug = (window as any).__originalConsoleDebug || console.debug;
      originalDebug('Suppressed ResizeObserver notification:', msg);
      return true; // Return true to indicate handled
    }
  } catch (err) {
    // Fail silently to avoid recursive errors
  }
};

// Use capture phase to catch before other handlers
window.addEventListener('error', resizeObserverErrorHandler, true);
window.addEventListener('unhandledrejection', resizeObserverErrorHandler, true);

// Capture PWA installation and dispatch custom event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  (window as any).__deferredInstallPrompt = e;
  window.dispatchEvent(new CustomEvent('pwa-install-prompt-available'));
});

// Shim ResizeObserver to prevent common "loop limit" errors by deferring to rAF
if (typeof window !== 'undefined' && window.ResizeObserver) {
  const OriginalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      super((entries, observer) => {
        window.requestAnimationFrame(() => {
          try {
            callback(entries, observer);
          } catch (e) {
            // Silently handle any errors in callbacks
          }
        });
      });
    }
  };
}

// Monkey-patch console methods to skip these specific strings
const patchConsole = (method: string) => {
  const original = (console as any)[method];
  if (!original) return;
  (window as any)[`__originalConsole${method.charAt(0).toUpperCase() + method.slice(1)}`] = original;
  (console as any)[method] = (...args: any[]) => {
    const firstArg = args[0];
    const isObjectError = firstArg && typeof firstArg === 'object' && (firstArg.message || firstArg.description);
    const msgString = typeof firstArg === 'string' ? firstArg : (isObjectError ? (firstArg.message || firstArg.description) : '');
    
    if (typeof msgString === 'string' && (
      msgString.includes('ResizeObserver') || 
      msgString.includes('loop limit') ||
      msgString.includes('loop completed')
    )) {
      return;
    }
    original.apply(console, args);
  };
};

['error', 'warn', 'info', 'log', 'debug'].forEach(patchConsole);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
