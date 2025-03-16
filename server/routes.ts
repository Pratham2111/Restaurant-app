import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBookingSchema, insertOrderSchema, 
  insertTableSchema, insertServerSchema,
  insertTableAssignmentSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}