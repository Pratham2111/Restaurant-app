import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBookingSchema, insertOrderSchema, 
  insertTableSchema, insertServerSchema,
  insertTableAssignmentSchema,
  insertMenuItemSchema,
  insertUserSchema,
  insertEventSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add authentication routes at the top
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        console.error("Failed to register user:", error);
        res.status(500).json({ message: "Failed to register user" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      if (req.session) {
        req.session.userId = user.id;
      }

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Already logged out" });
    }
  });

  // Menu Categories
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // Menu Items
  app.get("/api/menu-items", async (req, res) => {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    
    const items = categoryId 
      ? await storage.getMenuItemsByCategory(categoryId)
      : await storage.getMenuItems();
      
    res.json(items);
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const menuItem = insertMenuItemSchema.parse(req.body);
      const result = await storage.createMenuItem(menuItem);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      } else {
        console.error("Failed to create menu item:", error);
        res.status(500).json({ message: "Failed to create menu item" });
      }
    }
  });

  app.patch("/api/menu-items/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const menuItem = insertMenuItemSchema.parse(req.body);
      const result = await storage.updateMenuItem(id, menuItem);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      } else {
        console.error("Failed to update menu item:", error);
        res.status(500).json({ message: "Failed to update menu item" });
      }
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteMenuItem(id);
      res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
      console.error("Failed to delete menu item:", error);
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  // Enhanced Table Management Routes
  app.get("/api/tables", async (_req, res) => {
    const tables = await storage.getTables();
    res.json(tables);
  });

  app.get("/api/tables/section/:section", async (req, res) => {
    const tables = await storage.getTablesBySection(req.params.section);
    res.json(tables);
  });

  app.get("/api/tables/status/:status", async (req, res) => {
    const tables = await storage.getTablesByStatus(req.params.status);
    res.json(tables);
  });

  app.post("/api/tables", async (req, res) => {
    try {
      const table = insertTableSchema.parse(req.body);
      const result = await storage.createTable(table);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid table data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create table" });
      }
    }
  });

  app.patch("/api/tables/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const tableData = insertTableSchema.parse(req.body);
      const result = await storage.updateTable(id, tableData);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid table data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update table" });
      }
    }
  });

  app.delete("/api/tables/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteTable(id);
      res.json({ message: "Table deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete table" });
    }
  });

  app.patch("/api/tables/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const result = await storage.updateTableStatus(Number(req.params.id), status);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update table status" });
    }
  });

  // Server Management Routes
  app.get("/api/servers", async (_req, res) => {
    const servers = await storage.getServers();
    res.json(servers);
  });

  app.get("/api/servers/active", async (_req, res) => {
    const servers = await storage.getActiveServers();
    res.json(servers);
  });

  app.post("/api/servers", async (req, res) => {
    try {
      const server = insertServerSchema.parse(req.body);
      const result = await storage.createServer(server);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid server data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create server" });
      }
    }
  });

  // Table Assignment Routes
  app.get("/api/table-assignments", async (req, res) => {
    const status = req.query.status as string | undefined;
    const assignments = await storage.getTableAssignments(status);
    res.json(assignments);
  });

  app.post("/api/table-assignments", async (req, res) => {
    try {
      const assignment = insertTableAssignmentSchema.parse(req.body);
      const result = await storage.createTableAssignment(assignment);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create table assignment" });
      }
    }
  });

  app.patch("/api/table-assignments/:id/complete", async (req, res) => {
    try {
      const result = await storage.updateTableAssignment(
        Number(req.params.id),
        new Date()
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete table assignment" });
    }
  });

  app.get("/api/servers/:id/assignments", async (req, res) => {
    const assignments = await storage.getActiveAssignmentsByServer(Number(req.params.id));
    res.json(assignments);
  });

  // Tables
  app.get("/api/tables/available", async (req, res) => {
    const date = req.query.date;
    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "Date is required" });
    }

    const tables = await storage.getAvailableTables(new Date(date));
    res.json(tables);
  });

  // Bookings
  app.post("/api/bookings", async (req, res) => {
    try {
      const booking = insertBookingSchema.parse(req.body);
      const result = await storage.createBooking(booking);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create booking" });
      }
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const order = insertOrderSchema.parse({
        ...req.body,
        status: "pending",
        createdAt: new Date()
      });
      
      const result = await storage.createOrder(order);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    const id = Number(req.params.id);
    const order = await storage.getOrder(id);
    
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    
    res.json(order);
  });

  // Events Routes
  app.get("/api/events", async (_req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    try {
      const event = insertEventSchema.parse(req.body);
      const result = await storage.createEvent(event);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid event data", errors: error.errors });
      } else {
        console.error("Failed to create event:", error);
        res.status(500).json({ message: "Failed to create event" });
      }
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const event = insertEventSchema.parse(req.body);
      const result = await storage.updateEvent(id, event);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid event data", errors: error.errors });
      } else {
        console.error("Failed to update event:", error);
        res.status(500).json({ message: "Failed to update event" });
      }
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteEvent(id);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Failed to delete event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}