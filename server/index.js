import express from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import passport from "passport";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";
import { log, setupVite, serveStatic } from "./vite.js";
import { connectDB } from "./db/mongoose.js";
import { initializeStorage } from "./storage.js";

// Load environment variables from .env file
dotenv.config();

const MemoryStore = createMemoryStore(session);

/**
 * Main entry point for the server
 */
async function main() {
  try {
    // Connect to MongoDB if URI is provided
    let mongoConnection = null;
    const mongoURI = process.env.MONGODB_URI;
    
    if (mongoURI) {
      try {
        mongoConnection = await connectDB(mongoURI);
        log('MongoDB connected successfully', 'mongodb');
        
        // Initialize storage with MongoDB
        initializeStorage(true);
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        log('Failed to connect to MongoDB, falling back to in-memory storage', 'mongodb');
        
        // Initialize with in-memory storage
        initializeStorage(false);
      }
    } else {
      log('No MongoDB URI provided, using in-memory storage', 'mongodb');
      
      // Initialize with in-memory storage
      initializeStorage(false);
    }
    
    // Create Express app
    const app = express();

    // Create HTTP server
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
    app.use(cookieParser());

    // Configure session management with more permissive settings for development
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
          path: '/',
          httpOnly: true,
          sameSite: 'lax', // Less restrictive setting for development
          secure: process.env.NODE_ENV === 'production' // Only use secure in production
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
main();

export { main };