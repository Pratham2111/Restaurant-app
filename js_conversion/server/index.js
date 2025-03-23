const express = require('express');
const http = require('http');
const { registerRoutes } = require('./routes');
const { setupVite, serveStatic, log } = require('./vite');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const app = express();

// Middleware
app.use(express.json());

// Session middleware
app.use(
  session({
    cookie: { maxAge: 86400000 }, // 24 hours
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'la-mason-restaurant-secret'
  })
);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

async function main() {
  // Create HTTP server
  const server = http.createServer(app);
  
  // Register API routes
  await registerRoutes(app);
  
  // Set up Vite for development
  await setupVite(app, server);
  
  // Serve static files for production
  serveStatic(app);
  
  // Start the server
  const port = process.env.PORT || 5000;
  server.listen(port, '0.0.0.0', () => {
    log(`serving on port ${port}`);
  });
  
  return server;
}

// Start the server
main().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});