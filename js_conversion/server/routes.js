const { Server } = require("http");
const express = require("express");
const { z } = require("zod");
const { storage } = require("./storage");
const {
  insertCategorySchema,
  insertMenuItemSchema,
  insertReservationSchema,
  insertContactMessageSchema,
  insertOrderSchema,
  insertTestimonialSchema,
  insertCurrencySettingSchema,
} = require("../shared/schema");

/**
 * Handles Zod validation errors and returns a formatted response
 * @param {unknown} error - The error object
 * @param {express.Response} res - Express response object 
 */
const handleZodError = (error, res) => {
  if (error instanceof z.ZodError) {
    const errorMessages = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    
    return res.status(400).json({
      message: "Validation error",
      errors: errorMessages,
    });
  }
  
  console.error("Unexpected validation error:", error);
  return res.status(500).json({
    message: "An unexpected error occurred during validation",
  });
};

/**
 * Registers all API routes
 * @param {express.Express} app - Express application
 * @returns {Promise<Server>} HTTP server
 */
async function registerRoutes(app) {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Menu Items
  app.get("/api/menu-items", async (req, res) => {
    try {
      const menuItems = await storage.getMenuItems();
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
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
      console.error("Error fetching menu item:", error);
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  app.get("/api/menu-items/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const menuItems = await storage.getMenuItemsByCategory(categoryId);
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });

  app.get("/api/menu-items/featured", async (req, res) => {
    try {
      const featuredItems = await storage.getFeaturedMenuItems();
      res.json(featuredItems);
    } catch (error) {
      console.error("Error fetching featured menu items:", error);
      res.status(500).json({ message: "Failed to fetch featured menu items" });
    }
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(menuItem);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Reservations
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  app.get("/api/reservations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reservation = await storage.getReservationById(id);
      
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      res.json(reservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ message: "Failed to fetch reservation" });
    }
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const reservationData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(reservationData);
      res.status(201).json(reservation);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.patch("/api/reservations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status must be a string" });
      }
      
      const reservation = await storage.updateReservationStatus(id, status);
      
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      res.json(reservation);
    } catch (error) {
      console.error("Error updating reservation status:", error);
      res.status(500).json({ message: "Failed to update reservation status" });
    }
  });

  // Contact Messages
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status must be a string" });
      }
      
      const order = await storage.updateOrderStatus(id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Currency Settings
  app.get("/api/currency-settings", async (req, res) => {
    try {
      const currencySettings = await storage.getCurrencySettings();
      res.json(currencySettings);
    } catch (error) {
      console.error("Error fetching currency settings:", error);
      res.status(500).json({ message: "Failed to fetch currency settings" });
    }
  });

  app.get("/api/currency-settings/default", async (req, res) => {
    try {
      const defaultCurrency = await storage.getDefaultCurrency();
      
      if (!defaultCurrency) {
        return res.status(404).json({ message: "Default currency not found" });
      }
      
      res.json(defaultCurrency);
    } catch (error) {
      console.error("Error fetching default currency:", error);
      res.status(500).json({ message: "Failed to fetch default currency" });
    }
  });

  app.post("/api/currency-settings", async (req, res) => {
    try {
      const currencyData = insertCurrencySettingSchema.parse(req.body);
      const currency = await storage.createCurrencySetting(currencyData);
      res.status(201).json(currency);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.patch("/api/currency-settings/:id/default", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const currency = await storage.updateDefaultCurrency(id);
      
      if (!currency) {
        return res.status(404).json({ message: "Currency not found" });
      }
      
      res.json(currency);
    } catch (error) {
      console.error("Error updating default currency:", error);
      res.status(500).json({ message: "Failed to update default currency" });
    }
  });

  return app.get("server");
}

module.exports = { registerRoutes };