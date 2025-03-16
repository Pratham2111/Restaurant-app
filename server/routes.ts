import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertOrderSchema } from "@shared/schema";
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
