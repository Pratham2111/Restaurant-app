// This is a dummy file to replace Vite's HMR client
// It provides empty implementations of the functions that Vite's client uses

// Mock createHotContext function
window.createHotContext = () => ({
  accept: () => {},
  dispose: () => {},
  prune: () => {},
  decline: () => {},
  invalidate: () => {},
  on: () => {},
  send: () => {}
});

// Mock other HMR-related functions
window.__HMR_PROTOCOL__ = null;
window.__HMR_HOSTNAME__ = null;
window.__HMR_PORT__ = null;
window.__HMR_BASE_PATH__ = null;
window.__HMR_TIMEOUT__ = null;
window.__HMR_ENABLE_OVERLAY__ = false;

// Override WebSocket to prevent Vite from establishing connections
const OriginalWebSocket = window.WebSocket;
window.WebSocket = function(url) {
  // Only intercept Vite HMR WebSocket connections
  if (url && url.includes('/@vite/client')) {
    console.log('Prevented Vite HMR WebSocket connection');
    return {
      send: () => {},
      close: () => {}
    };
  }
  
  // Allow other WebSocket connections to proceed normally
  return new OriginalWebSocket(...arguments);
};

console.log('HMR disabled to prevent refresh loops');