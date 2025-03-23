const express = require('express');
const { z } = require('zod');
const { storage } = require('./storage');
const {
  insertCategorySchema,
  insertMenuItemSchema,
  insertReservationSchema,
  insertContactMessageSchema,
  insertOrderSchema,
  insertTestimonialSchema,
  insertCurrencySettingSchema
} = require('../shared/schema');

// Helper function to handle Zod validation errors
const handleZodError = (error, res) => {
  if (error instanceof z.ZodError) {
    const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    res.status(400).json({ message: errorMessages });
  } else {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

async function registerRoutes(app) {
  // Categories endpoints
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({ message: 'Failed to retrieve categories' });
    }
  });

  app.get('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      console.error('Error getting category:', error);
      res.status(500).json({ message: 'Failed to retrieve category' });
    }
  });

  app.post('/api/categories', async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Menu Items endpoints
  app.get('/api/menu-items', async (req, res) => {
    try {
      const menuItems = await storage.getMenuItems();
      res.json(menuItems);
    } catch (error) {
      console.error('Error getting menu items:', error);
      res.status(500).json({ message: 'Failed to retrieve menu items' });
    }
  });

  app.get('/api/menu-items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const menuItem = await storage.getMenuItemById(id);
      
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      res.json(menuItem);
    } catch (error) {
      console.error('Error getting menu item:', error);
      res.status(500).json({ message: 'Failed to retrieve menu item' });
    }
  });

  app.get('/api/menu-items/category/:categoryId', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const menuItems = await storage.getMenuItemsByCategory(categoryId);
      res.json(menuItems);
    } catch (error) {
      console.error('Error getting menu items by category:', error);
      res.status(500).json({ message: 'Failed to retrieve menu items by category' });
    }
  });

  app.get('/api/menu-items/featured', async (req, res) => {
    try {
      const featuredItems = await storage.getFeaturedMenuItems();
      res.json(featuredItems);
    } catch (error) {
      console.error('Error getting featured menu items:', error);
      res.status(500).json({ message: 'Failed to retrieve featured menu items' });
    }
  });

  app.post('/api/menu-items', async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const newMenuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(newMenuItem);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Reservations endpoints
  app.get('/api/reservations', async (req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      console.error('Error getting reservations:', error);
      res.status(500).json({ message: 'Failed to retrieve reservations' });
    }
  });

  app.get('/api/reservations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reservation = await storage.getReservationById(id);
      
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      
      res.json(reservation);
    } catch (error) {
      console.error('Error getting reservation:', error);
      res.status(500).json({ message: 'Failed to retrieve reservation' });
    }
  });

  app.post('/api/reservations', async (req, res) => {
    try {
      // Ensure date is properly converted from string to Date
      const data = { ...req.body };
      if (typeof data.date === 'string') {
        data.date = new Date(data.date);
      }
      
      const reservationData = insertReservationSchema.parse(data);
      const newReservation = await storage.createReservation(reservationData);
      res.status(201).json(newReservation);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.patch('/api/reservations/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: 'Status is required and must be a string' });
      }
      
      const updatedReservation = await storage.updateReservationStatus(id, status);
      
      if (!updatedReservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      
      res.json(updatedReservation);
    } catch (error) {
      console.error('Error updating reservation status:', error);
      res.status(500).json({ message: 'Failed to update reservation status' });
    }
  });

  // Contact Messages endpoints
  app.get('/api/contact-messages', async (req, res) => {
    try {
      const contactMessages = await storage.getContactMessages();
      res.json(contactMessages);
    } catch (error) {
      console.error('Error getting contact messages:', error);
      res.status(500).json({ message: 'Failed to retrieve contact messages' });
    }
  });

  app.post('/api/contact-messages', async (req, res) => {
    try {
      const contactMessageData = insertContactMessageSchema.parse(req.body);
      const newContactMessage = await storage.createContactMessage(contactMessageData);
      res.status(201).json(newContactMessage);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Orders endpoints
  app.get('/api/orders', async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({ message: 'Failed to retrieve orders' });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error getting order:', error);
      res.status(500).json({ message: 'Failed to retrieve order' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const newOrder = await storage.createOrder(orderData);
      res.status(201).json(newOrder);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.patch('/api/orders/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: 'Status is required and must be a string' });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Failed to update order status' });
    }
  });

  // Testimonials endpoints
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error('Error getting testimonials:', error);
      res.status(500).json({ message: 'Failed to retrieve testimonials' });
    }
  });

  app.post('/api/testimonials', async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(newTestimonial);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Currency Settings endpoints
  app.get('/api/currency-settings', async (req, res) => {
    try {
      const currencySettings = await storage.getCurrencySettings();
      res.json(currencySettings);
    } catch (error) {
      console.error('Error getting currency settings:', error);
      res.status(500).json({ message: 'Failed to retrieve currency settings' });
    }
  });

  app.get('/api/currency-settings/default', async (req, res) => {
    try {
      const defaultCurrency = await storage.getDefaultCurrency();
      
      if (!defaultCurrency) {
        return res.status(404).json({ message: 'Default currency not found' });
      }
      
      res.json(defaultCurrency);
    } catch (error) {
      console.error('Error getting default currency:', error);
      res.status(500).json({ message: 'Failed to retrieve default currency' });
    }
  });

  app.post('/api/currency-settings', async (req, res) => {
    try {
      const currencySettingData = insertCurrencySettingSchema.parse(req.body);
      const newCurrencySetting = await storage.createCurrencySetting(currencySettingData);
      res.status(201).json(newCurrencySetting);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.patch('/api/currency-settings/:id/default', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedCurrency = await storage.updateDefaultCurrency(id);
      
      if (!updatedCurrency) {
        return res.status(404).json({ message: 'Currency not found' });
      }
      
      res.json(updatedCurrency);
    } catch (error) {
      console.error('Error updating default currency:', error);
      res.status(500).json({ message: 'Failed to update default currency' });
    }
  });

  return app;
}

module.exports = { registerRoutes };