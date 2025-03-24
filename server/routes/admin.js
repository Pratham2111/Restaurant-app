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

// Get category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await req.app.locals.storage.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error getting category by ID:', error);
    res.status(500).json({ message: "Failed to get category" });
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

// Update category (admin only)
router.put('/categories/:id', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    
    if (!categoryData.name && !categoryData.description) {
      return res.status(400).json({
        message: "At least one field to update is required"
      });
    }
    
    const category = await req.app.locals.storage.updateCategory(id, categoryData);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: "Failed to update category" });
  }
});

// Delete category (admin only)
router.delete('/categories/:id', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has menu items
    const menuItems = await req.app.locals.storage.getMenuItemsByCategory(id);
    if (menuItems && menuItems.length > 0) {
      return res.status(400).json({
        message: "Cannot delete category with associated menu items"
      });
    }
    
    const success = await req.app.locals.storage.deleteCategory(id);
    
    if (!success) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: "Failed to delete category" });
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

// Get menu item by ID
router.get('/menu-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await req.app.locals.storage.getMenuItemById(id);
    
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    
    res.json(menuItem);
  } catch (error) {
    console.error('Error getting menu item by ID:', error);
    res.status(500).json({ message: "Failed to get menu item" });
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

// Update menu item (admin only)
router.put('/menu-items/:id', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const menuItemData = req.body;
    
    // Validate if any field is provided
    if (Object.keys(menuItemData).length === 0) {
      return res.status(400).json({
        message: "At least one field to update is required"
      });
    }
    
    // Validate price if provided
    if (menuItemData.price && isNaN(Number(menuItemData.price))) {
      return res.status(400).json({
        message: "Price must be a valid number"
      });
    }
    
    const menuItem = await req.app.locals.storage.updateMenuItem(id, menuItemData);
    
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    
    res.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: "Failed to update menu item" });
  }
});

// Delete menu item (admin only)
router.delete('/menu-items/:id', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the item is in any active orders before deleting
    // This is a safety check that would need to be implemented
    // in a real-world scenario to prevent data inconsistencies
    
    const success = await req.app.locals.storage.deleteMenuItem(id);
    
    if (!success) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: "Failed to delete menu item" });
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

// Mark contact message as read (admin only)
router.put('/contact-messages/:id/read', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const contactMessage = await req.app.locals.storage.updateContactMessageStatus(id, { read: true });
    if (!contactMessage) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    
    res.json(contactMessage);
  } catch (error) {
    console.error('Error marking contact message as read:', error);
    res.status(500).json({ message: "Failed to update contact message" });
  }
});

/**
 * Testimonial Management
 */

// Get all testimonials (admin and public)
router.get('/testimonials', async (req, res) => {
  try {
    // Admin can see all testimonials, public only sees approved ones
    const showAll = req.user?.role === 'admin';
    const testimonials = await req.app.locals.storage.getTestimonials(showAll);
    res.json(testimonials);
  } catch (error) {
    console.error('Error getting testimonials:', error);
    res.status(500).json({ message: "Failed to get testimonials" });
  }
});

// Approve/reject testimonial (admin only)
router.put('/testimonials/:id/status', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const testimonial = await req.app.locals.storage.updateTestimonialStatus(id, status);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    
    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    res.status(500).json({ message: "Failed to update testimonial status" });
  }
});

// Delete testimonial (admin only)
router.delete('/testimonials/:id', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await req.app.locals.storage.deleteTestimonial(id);
    if (!success) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: "Failed to delete testimonial" });
  }
});

/**
 * Admin Dashboard Statistics
 */

// Get restaurant statistics (admin only)
router.get('/dashboard/statistics', authorizeAdmin, async (req, res) => {
  try {
    const storage = req.app.locals.storage;
    
    // Get counts of various entities
    const orders = await storage.getOrders();
    const reservations = await storage.getReservations();
    const menuItems = await storage.getMenuItems();
    const categories = await storage.getCategories();
    const users = await storage.getUsers();
    const contactMessages = await storage.getContactMessages();
    const testimonials = await storage.getTestimonials(true); // Get all testimonials including pending ones
    
    // Calculate statistics
    const statistics = {
      // Order statistics
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      processingOrders: orders.filter(order => order.status === 'processing').length,
      completedOrders: orders.filter(order => order.status === 'completed').length,
      cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
      
      // Calculate average order value
      averageOrderValue: orders.length ? 
        orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
      
      // Reservation statistics
      totalReservations: reservations.length,
      pendingReservations: reservations.filter(res => res.status === 'pending').length,
      confirmedReservations: reservations.filter(res => res.status === 'confirmed').length,
      cancelledReservations: reservations.filter(res => res.status === 'cancelled').length,
      
      // Menu statistics
      totalMenuItems: menuItems.length,
      featuredMenuItems: menuItems.filter(item => item.featured).length,
      totalCategories: categories.length,
      
      // User statistics
      totalUsers: users.length,
      adminUsers: users.filter(user => user.role === 'admin').length,
      subadminUsers: users.filter(user => user.role === 'subadmin').length,
      
      // Contact message statistics
      totalContactMessages: contactMessages.length,
      unreadContactMessages: contactMessages.filter(msg => !msg.read).length,
      
      // Testimonial statistics
      totalTestimonials: testimonials.length,
      pendingTestimonials: testimonials.filter(t => t.status === 'pending').length,
      approvedTestimonials: testimonials.filter(t => t.status === 'approved').length,
      rejectedTestimonials: testimonials.filter(t => t.status === 'rejected').length
    };
    
    res.json(statistics);
  } catch (error) {
    console.error('Error getting admin dashboard statistics:', error);
    res.status(500).json({ message: "Failed to get statistics" });
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