import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCategorySchema, insertMenuItemSchema, insertReservationSchema,
  insertContactMessageSchema, insertOrderSchema, insertTestimonialSchema,
  insertCurrencySettingSchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler middleware
  const handleZodError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  };
  
  // API Routes - All prefixed with /api
  
  // Categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  
  // Menu Items
  app.get("/api/menu-items", async (_req, res) => {
    try {
      const menuItems = await storage.getMenuItems();
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  
  app.get("/api/menu-items/featured", async (_req, res) => {
    try {
      const featuredItems = await storage.getFeaturedMenuItems();
      res.json(featuredItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured menu items" });
    }
  });
  
  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const menuItem = await storage.getMenuItemById(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });
  
  app.get("/api/categories/:categoryId/menu-items", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const menuItems = await storage.getMenuItemsByCategory(categoryId);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });
  
  // Reservations
  app.post("/api/reservations", async (req, res) => {
    try {
      const reservation = insertReservationSchema.parse(req.body);
      const createdReservation = await storage.createReservation(reservation);
      res.status(201).json(createdReservation);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Contact Messages
  app.post("/api/contact", async (req, res) => {
    try {
      const contactMessage = insertContactMessageSchema.parse(req.body);
      const createdMessage = await storage.createContactMessage(contactMessage);
      res.status(201).json(createdMessage);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const order = insertOrderSchema.parse(req.body);
      const createdOrder = await storage.createOrder(order);
      res.status(201).json(createdOrder);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Testimonials
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  
  // Currency Settings
  app.get("/api/currency-settings", async (_req, res) => {
    try {
      const currencySettings = await storage.getCurrencySettings();
      res.json(currencySettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch currency settings" });
    }
  });
  
  app.get("/api/currency-settings/default", async (_req, res) => {
    try {
      const defaultCurrency = await storage.getDefaultCurrency();
      if (!defaultCurrency) {
        return res.status(404).json({ message: "No default currency found" });
      }
      res.json(defaultCurrency);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch default currency" });
    }
  });
  
  app.post("/api/currency-settings/:id/set-default", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedCurrency = await storage.updateDefaultCurrency(id);
      if (!updatedCurrency) {
        return res.status(404).json({ message: "Currency not found" });
      }
      res.json(updatedCurrency);
    } catch (error) {
      res.status(500).json({ message: "Failed to update default currency" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
