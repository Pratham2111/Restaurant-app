/**
 * Logs a message with an optional source
 * @param {string} message - Message to log
 * @param {string} source - Source of the log (default: "express")
 */
function log(message, source = "express") {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [${source}] ${message}`);
}

/**
 * Sets up Vite development server
 * @param {import('express').Express} app - Express application
 * @param {import('http').Server} server - HTTP server
 */
async function setupVite(app, server) {
  try {
    // Import Vite modules dynamically since they're only needed in development
    const { createServer: createViteServer } = await import("vite");
    
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    
    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
    
    // Function to generate HTML responses
    const generateHtml = async (req, res) => {
      try {
        // Get index.html
        let template = await vite.transformIndexHtml(
          req.originalUrl,
          await vite.ssrLoadModule("./client/index.html")
        );
        
        // Send HTML response
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        // If error, let Vite fix the stack trace for better debugging
        vite.ssrFixStacktrace(e);
        console.error(e);
        res.status(500).end(e.message);
      }
    };
    
    // Handle all other routes that don't match API routes
    // This will serve the SPA for client-side routing
    app.use("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) {
        next();
        return;
      }
      
      generateHtml(req, res);
    });
    
    return vite;
  } catch (error) {
    console.error("Error setting up Vite middleware:", error);
    throw error;
  }
}

/**
 * Serves static files for production
 * @param {import('express').Express} app - Express application
 */
function serveStatic(app) {
  try {
    const path = require("path");
    const fs = require("fs");
    
    // Serve static assets from client/dist
    const distPath = path.resolve("client/dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      
      // Function to send index.html for SPA routes
      const sendIndexHtml = (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      };
      
      // Handle all other routes that don't match API routes
      app.use("*", (req, res, next) => {
        if (req.originalUrl.startsWith("/api")) {
          next();
          return;
        }
        
        sendIndexHtml(req, res);
      });
    } else {
      log("Production assets not found at './client/dist'. Did you run 'npm run build'?", "error");
    }
  } catch (error) {
    console.error("Error setting up static file serving:", error);
    throw error;
  }
}

export {
  log,
  setupVite,
  serveStatic,
};