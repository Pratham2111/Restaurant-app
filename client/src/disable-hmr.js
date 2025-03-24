// Simple HMR disabling for Vite
// This file provides minimal intervention to stop HMR refresh loops

// Filter out HMR-related console messages only
const originalConsoleWarn = console.warn;
console.warn = function(...args) {
  const message = args.join(' ');
  if (!message.includes('HMR')) {
    originalConsoleWarn.apply(console, args);
  }
};

// Basic HMR context mocking to prevent errors
if (window.createHotContext) {
  window.createHotContext = () => ({
    accept: () => {},
    dispose: () => {},
    data: {}
  });
}

console.log('HMR disabled to prevent refresh loops');