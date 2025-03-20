import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import MemoryStore from "memorystore";
import cors from "cors";

const app = express();

// Add CORS middleware with specific domain
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? "https://icanserveyou.com"
    : "http://localhost:5000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware with production settings
const MemoryStoreSession = MemoryStore(session);
app.use(session({
  cookie: {
    maxAge: 86400000, // 24 hours
    secure: true, // Required for HTTPS
    sameSite: 'none', // Required for cross-site cookies
    httpOnly: true,
    path: '/'
  },
  store: new MemoryStoreSession({
    checkPeriod: 86400000, // prune expired entries every 24h
    ttl: 86400000 // session TTL (24 hours)
  }),
  secret: "1E1F935ACB2A1B4AE3A634D3A5D4F",
  resave: false,
  saveUninitialized: false,
  name: 'restaurant.sid', // Custom session ID name
  rolling: true, // Refresh session with each request
  proxy: true // Trust proxy
}));

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Log session information for debugging
  log(`Session ID: ${req.sessionID}, User ID: ${req.session?.userId}, Path: ${path}`);
  log(`Headers: ${JSON.stringify(req.headers)}`);
  log(`Cookies: ${JSON.stringify(req.headers.cookie)}`);

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "…";
    }

    log(logLine);
    // Log response headers for debugging
    log(`Response Headers: ${JSON.stringify(res.getHeaders())}`);
  });

  next();
});

// Add health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

(async () => {
  try {
    log("Starting server initialization...");

    const server = await registerRoutes(app);
    log("Routes registered successfully");

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error encountered: ${status} - ${message}`);
      res.status(status).json({ message });
    });

    if (app.get("env") === "development") {
      log("Setting up Vite for development...");
      await setupVite(app, server);
      log("Vite setup completed");
    } else {
      log("Setting up static file serving for production...");
      serveStatic(app);
    }

    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server running on port ${port}`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      switch (error.code) {
        case 'EACCES':
          log(`Port ${port} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          log(`Port ${port} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    log(`Server initialization failed: ${error}`);
    process.exit(1);
  }
})();