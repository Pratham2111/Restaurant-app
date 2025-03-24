import { Server } from "http";
import express from "express";
import { z } from "zod";
import { storage } from "./storage.js";
import {
  insertCategorySchema,
  insertMenuItemSchema,
  insertReservationSchema,
  insertContactMessageSchema,
  insertOrderSchema,
  insertTestimonialSchema,
  insertCurrencySettingSchema,
  insertUserSchema,
  loginUserSchema,
} from "../shared/schema.js";

// Import route modules
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import { authenticate } from './middleware/auth.js';

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
  // Store storage as a local variable for middleware to access
  app.locals.storage = storage;
  
  // Register auth and admin routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
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
      const id = req.params.id;
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

  app.get("/api/menu-items/featured", async (req, res) => {
    try {
      const featuredItems = await storage.getFeaturedMenuItems();
      res.json(featuredItems);
    } catch (error) {
      console.error("Error fetching featured menu items:", error);
      res.status(500).json({ message: "Failed to fetch featured menu items" });
    }
  });

  app.get("/api/menu-items/category/:categoryId", async (req, res) => {
    try {
      const categoryId = req.params.categoryId; // Keep as string for MongoDB ObjectId
      const menuItems = await storage.getMenuItemsByCategory(categoryId);
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });

  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = req.params.id;
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

  app.post("/api/menu-items", async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(menuItem);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Custom middleware for optional authentication
  const optionalAuth = (req, res, next) => {
    // Save the original status method
    const originalStatus = res.status;
    
    // Override the status method temporarily
    res.status = (code) => {
      // Only override 401 errors - auth failures
      if (code === 401) {
        // Just continue to the next middleware instead of returning 401
        console.log('Authentication optional - continuing without auth');
        next();
        return res;
      }
      
      // For non-401 status codes, use the original method
      return originalStatus.call(res, code);
    };
    
    // Call the authenticate middleware
    authenticate(req, res, () => {
      // Restore the original status method
      res.status = originalStatus;
      next();
    });
  };
  
  // Reservations - with optional authentication
  app.get("/api/reservations", optionalAuth, async (req, res) => {
    try {
      // Get all reservations first
      const allReservations = await storage.getReservations();
      
      // Check if there's a user in the request (authenticated)
      // If authenticated, filter for this user's reservations only
      if (req.user) {
        const userId = req.user.id || req.user._id;
        const userEmail = req.user.email?.toLowerCase();
        const userName = req.user.name?.toLowerCase();
        
        console.log('Filtering reservations for user:', { id: userId, email: userEmail, name: userName });
        
        // Filter reservations by user id, email or name
        const userReservations = allReservations.filter(reservation => {
          const reservationUserId = reservation.userId || reservation._id;
          const reservationEmail = (reservation.email || '').toLowerCase();
          const reservationName = (reservation.name || '').toLowerCase();
          
          return (userId && reservationUserId && reservationUserId.toString() === userId.toString()) || 
                 (userEmail && reservationEmail === userEmail) ||
                 (userName && reservationName.includes(userName));
        });
        
        console.log(`Found ${userReservations.length} reservations for user ${userEmail}`);
        return res.json(userReservations);
      }
      
      // If no user in request (not authenticated), return all reservations
      // This is fine for non-authenticated requests since we filter client-side
      res.json(allReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  app.get("/api/reservations/:id", async (req, res) => {
    try {
      const id = req.params.id;
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
      // Try to authenticate but proceed even if it fails
      optionalAuth(req, res, async () => {
        try {
          const reservationData = insertReservationSchema.parse(req.body);
          
          // If user is authenticated, associate the reservation with their userId
          if (req.user) {
            const userId = req.user.id || req.user._id;
            console.log(`Associating reservation with authenticated user ID: ${userId}`);
            reservationData.userId = userId;
            
            // Also ensure email matches the logged-in user if possible
            if (!reservationData.email && req.user.email) {
              reservationData.email = req.user.email;
            }
            
            // Also ensure name matches the logged-in user if possible
            if (!reservationData.name && req.user.name) {
              reservationData.name = req.user.name;
            }
          }
          
          const reservation = await storage.createReservation(reservationData);
          res.status(201).json(reservation);
        } catch (error) {
          handleZodError(error, res);
        }
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({ message: "Failed to create reservation" });
    }
  });

  app.patch("/api/reservations/:id/status", async (req, res) => {
    try {
      const id = req.params.id;
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

  // Orders - requires authentication
  app.get("/api/orders", authenticate, async (req, res) => {
    try {
      // Get all orders first
      const allOrders = await storage.getOrders();
      
      // Check if there's a user in the request (authenticated)
      // If authenticated, filter for this user's orders only
      if (req.user) {
        const userId = req.user.id || req.user._id;
        const userEmail = req.user.email?.toLowerCase();
        
        console.log('Filtering orders for user:', { id: userId, email: userEmail });
        
        // Filter orders by user id or email
        const userOrders = allOrders.filter(order => {
          const orderUserId = order.userId || order._id;
          const customerEmail = (order.customerEmail || order.email || '').toLowerCase();
          
          return (userId && orderUserId && orderUserId.toString() === userId.toString()) || 
                 (userEmail && customerEmail === userEmail);
        });
        
        console.log(`Found ${userOrders.length} orders for user ${userEmail}`);
        return res.json(userOrders);
      }
      
      // If no user in request (not authenticated), return all orders
      // This is fine for non-authenticated requests since we filter client-side
      res.json(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", authenticate, async (req, res) => {
    try {
      const id = req.params.id;
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

  app.post("/api/orders", authenticate, async (req, res) => {
    try {
      // Log the incoming order data for debugging
      console.log("Received order data:", JSON.stringify(req.body));
      
      // Handle pickup orders differently - they don't need a detailed address
      let orderData;
      if (req.body.orderType === 'pickup') {
        // For pickup orders, extend the schema to make address optional
        const pickupOrderSchema = insertOrderSchema.extend({
          address: z.string().min(1, "Address is required").default("Pickup")
        });
        
        // Set a default address value for pickup orders if it's too short
        if (!req.body.address || req.body.address.length < 5) {
          req.body.address = "Pickup at restaurant";
        }
        
        orderData = pickupOrderSchema.parse(req.body);
      } else {
        // For delivery orders, use the standard schema where address is required
        orderData = insertOrderSchema.parse(req.body);
      }
      
      // User is authenticated (required), so associate the order with their userId
      const userId = req.user.id || req.user._id;
      console.log(`Associating order with authenticated user ID: ${userId}`);
      orderData.userId = userId;
      
      // Format menu item IDs if needed (MongoDB ObjectId handling)
      if (orderData.items && orderData.items.length > 0) {
        // Ensure the menuItemId values are numbers (or strings that can be converted if needed)
        orderData.items = orderData.items.map(item => ({
          ...item,
          // Keep menuItemId as is, storage layer will handle conversion if needed
        }));
      }
      
      console.log("Processed order data:", JSON.stringify(orderData));
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      handleZodError(error, res);
    }
  });

  app.patch("/api/orders/:id/status", authenticate, async (req, res) => {
    try {
      const id = req.params.id;
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

export { registerRoutes };