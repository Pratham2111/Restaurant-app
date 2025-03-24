/**
 * Admin routes for restaurant management
 */
import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticate);

/**
 * Category Management
 */

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await req.app.locals.storage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: "Failed to get categories" });
  }
});

// Create category (admin only)
router.post('/categories', authorizeAdmin, async (req, res) => {
  try {
    const categoryData = req.body;
    
    if (!categoryData.name || !categoryData.description) {
      return res.status(400).json({
        message: "Category name and description are required"
      });
    }
    
    const category = await req.app.locals.storage.createCategory(categoryData);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: "Failed to create category" });
  }
});

/**
 * Menu Item Management
 */

// Get all menu items
router.get('/menu-items', async (req, res) => {
  try {
    const menuItems = await req.app.locals.storage.getMenuItems();
    res.json(menuItems);
  } catch (error) {
    console.error('Error getting menu items:', error);
    res.status(500).json({ message: "Failed to get menu items" });
  }
});

// Create menu item (admin only)
router.post('/menu-items', authorizeAdmin, async (req, res) => {
  try {
    const menuItemData = req.body;
    
    if (!menuItemData.name || !menuItemData.description || 
        !menuItemData.price || !menuItemData.categoryId) {
      return res.status(400).json({
        message: "Menu item name, description, price, and categoryId are required"
      });
    }
    
    const menuItem = await req.app.locals.storage.createMenuItem(menuItemData);
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: "Failed to create menu item" });
  }
});

/**
 * Order Management
 */

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await req.app.locals.storage.getOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: "Failed to get orders" });
  }
});

// Update order status (both admin and sub-admin)
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const order = await req.app.locals.storage.updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

/**
 * Reservation Management
 */

// Get all reservations
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await req.app.locals.storage.getReservations();
    res.json(reservations);
  } catch (error) {
    console.error('Error getting reservations:', error);
    res.status(500).json({ message: "Failed to get reservations" });
  }
});

// Update reservation status (both admin and sub-admin)
router.put('/reservations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const reservation = await req.app.locals.storage.updateReservationStatus(id, status);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    
    res.json(reservation);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ message: "Failed to update reservation status" });
  }
});

/**
 * Contact Message Management
 */

// Get all contact messages (admin only)
router.get('/contact-messages', authorizeAdmin, async (req, res) => {
  try {
    const contactMessages = await req.app.locals.storage.getContactMessages();
    res.json(contactMessages);
  } catch (error) {
    console.error('Error getting contact messages:', error);
    res.status(500).json({ message: "Failed to get contact messages" });
  }
});

/**
 * Currency Management
 */

// Get all currency settings (admin only)
router.get('/currency-settings', authorizeAdmin, async (req, res) => {
  try {
    const currencySettings = await req.app.locals.storage.getCurrencySettings();
    res.json(currencySettings);
  } catch (error) {
    console.error('Error getting currency settings:', error);
    res.status(500).json({ message: "Failed to get currency settings" });
  }
});

// Create currency setting (admin only)
router.post('/currency-settings', authorizeAdmin, async (req, res) => {
  try {
    const currencyData = req.body;
    
    if (!currencyData.code || !currencyData.symbol || 
        !currencyData.name || currencyData.rate === undefined) {
      return res.status(400).json({
        message: "Currency code, symbol, name, and rate are required"
      });
    }
    
    const currency = await req.app.locals.storage.createCurrencySetting(currencyData);
    res.status(201).json(currency);
  } catch (error) {
    console.error('Error creating currency setting:', error);
    res.status(500).json({ message: "Failed to create currency setting" });
  }
});

// Update default currency (admin only)
router.put('/currency-settings/:id/default', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const currency = await req.app.locals.storage.updateDefaultCurrency(id);
    if (!currency) {
      return res.status(404).json({ message: "Currency setting not found" });
    }
    
    res.json(currency);
  } catch (error) {
    console.error('Error updating default currency:', error);
    res.status(500).json({ message: "Failed to update default currency" });
  }
});

export default router;