const express = require("express");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const { registerRoutes } = require("./routes");
const { log, setupVite, serveStatic } = require("./vite");

/**
 * Main entry point for the server
 */
async function main() {
  try {
    // Create Express app
    const app = express();

    // Create HTTP server
    const http = require("http");
    const server = http.createServer(app);

    // Setup Vite for development or serve static files for production
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(app, server);
    }

    // Configure Express middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Configure session management
    app.use(
      session({
        store: new MemoryStore({
          checkPeriod: 86400000, // prune expired entries every 24h
        }),
        secret: process.env.SESSION_SECRET || "restaurant-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
      })
    );

    // Initialize Passport for authentication (if needed later)
    app.use(passport.initialize());
    app.use(passport.session());

    // Register API routes
    await registerRoutes(app);

    // Global error handler
    app.use((err, _req, res, _next) => {
      console.error(err.stack);
      res.status(500).json({
        message: "An unexpected error occurred",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, "0.0.0.0", () => {
      log(`serving on port ${PORT}`);
    });

    return server;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  main();
}

module.exports = { main };