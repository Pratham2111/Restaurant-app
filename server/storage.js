/**
 * Storage implementation for the restaurant application.
 * This module provides storage for categories, menu items, reservations,
 * contact messages, orders, testimonials, and currency settings.
 * 
 * It automatically uses MongoDB if connection is available, otherwise falls back to in-memory storage.
 */

import MongoStorage from './db/MongoStorage.js';

/**
 * Interface for storage operations
 * @interface
 */
class IStorage {
  // Categories
  async getCategories() { throw new Error("Not implemented"); }
  async getCategoryById(id) { throw new Error("Not implemented"); }
  async createCategory(category) { throw new Error("Not implemented"); }

  // Menu Items
  async getMenuItems() { throw new Error("Not implemented"); }
  async getMenuItemById(id) { throw new Error("Not implemented"); }
  async getMenuItemsByCategory(categoryId) { throw new Error("Not implemented"); }
  async getFeaturedMenuItems() { throw new Error("Not implemented"); }
  async createMenuItem(menuItem) { throw new Error("Not implemented"); }

  // Reservations
  async getReservations() { throw new Error("Not implemented"); }
  async getReservationById(id) { throw new Error("Not implemented"); }
  async createReservation(reservation) { throw new Error("Not implemented"); }
  async updateReservationStatus(id, status) { throw new Error("Not implemented"); }

  // Contact Messages
  async getContactMessages() { throw new Error("Not implemented"); }
  async createContactMessage(contactMessage) { throw new Error("Not implemented"); }

  // Orders
  async getOrders() { throw new Error("Not implemented"); }
  async getOrderById(id) { throw new Error("Not implemented"); }
  async createOrder(order) { throw new Error("Not implemented"); }
  async updateOrderStatus(id, status) { throw new Error("Not implemented"); }

  // Testimonials
  async getTestimonials() { throw new Error("Not implemented"); }
  async createTestimonial(testimonial) { throw new Error("Not implemented"); }

  // Currency Settings
  async getCurrencySettings() { throw new Error("Not implemented"); }
  async getDefaultCurrency() { throw new Error("Not implemented"); }
  async createCurrencySetting(currencySetting) { throw new Error("Not implemented"); }
  async updateDefaultCurrency(id) { throw new Error("Not implemented"); }
}

/**
 * In-memory implementation of the storage interface
 */
class MemStorage {
  constructor() {
    // Data stores
    this.categories = new Map();
    this.menuItems = new Map();
    this.reservations = new Map();
    this.contactMessages = new Map();
    this.orders = new Map();
    this.testimonials = new Map();
    this.currencySettings = new Map();
    
    // Auto-increment IDs
    this.categoryId = 1;
    this.menuItemId = 1;
    this.reservationId = 1;
    this.contactMessageId = 1;
    this.orderId = 1;
    this.testimonialId = 1;
    this.currencySettingId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  /**
   * Initializes storage with sample data
   */
  initializeData() {
    // Initialize Categories
    const categories = [
      { name: "Appetizers", description: "Start your meal with our delicious appetizers" },
      { name: "Main Courses", description: "Exquisite main dishes prepared by our expert chefs" },
      { name: "Desserts", description: "Sweet treats to end your meal on a high note" },
      { name: "Beverages", description: "Refreshing drinks to complement your meal" },
    ];
    
    categories.forEach(category => this.createCategory(category));
    
    // Initialize Menu Items
    const menuItems = [
      {
        name: "Bruschetta",
        description: "Toasted bread topped with fresh tomatoes, basil, and garlic",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=500&h=350",
        categoryId: 1,
        featured: false,
      },
      {
        name: "Herb Roasted Salmon",
        description: "Fresh salmon roasted with herbs, served with lemon butter sauce",
        price: 22.99,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&h=350",
        categoryId: 2,
        featured: true,
      },
      {
        name: "Tiramisu",
        description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&h=350",
        categoryId: 3,
        featured: false,
      },
      {
        name: "Artisanal Cheese Plate",
        description: "Selection of fine cheeses served with crackers and seasonal fruits",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1536624737225-b03b415140ca?auto=format&fit=crop&w=500&h=350",
        categoryId: 1,
        featured: true,
      },
      {
        name: "Grilled Filet Mignon",
        description: "Prime beef tenderloin grilled to perfection, served with truffle mashed potatoes",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&h=350",
        categoryId: 2,
        featured: true,
      },
      {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?auto=format&fit=crop&w=500&h=350",
        categoryId: 3,
        featured: false,
      },
    ];
    
    menuItems.forEach(item => this.createMenuItem(item));
    
    // Initialize Testimonials
    const testimonials = [
      {
        name: "Sarah Johnson",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
        rating: 5,
        comment: "The food was absolutely amazing! The atmosphere was elegant yet comfortable. Will definitely be coming back.",
      },
      {
        name: "Michael Chen",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        rating: 4,
        comment: "Great service and delicious food. The herb roasted salmon was cooked to perfection.",
      },
      {
        name: "Emily Rodriguez",
        image: "https://randomuser.me/api/portraits/women/28.jpg",
        rating: 5,
        comment: "Had my anniversary dinner here and it was perfect. The staff went above and beyond to make our night special.",
      },
    ];
    
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
    
    // Initialize Currency Settings
    const usd = {
      code: "USD",
      symbol: "$",
      name: "US Dollar",
      rate: 1.0,
      isDefault: true,
    };
    
    const eur = {
      code: "EUR",
      symbol: "€",
      name: "Euro",
      rate: 0.93,
      isDefault: false,
    };
    
    const gbp = {
      code: "GBP",
      symbol: "£",
      name: "British Pound",
      rate: 0.79,
      isDefault: false,
    };
    
    this.createCurrencySetting(usd);
    this.createCurrencySetting(eur);
    this.createCurrencySetting(gbp);
  }
  
  /**
   * Retrieves all categories
   * @returns {Promise<Array>} Array of category objects
   */
  async getCategories() {
    return Array.from(this.categories.values());
  }
  
  /**
   * Retrieves a category by ID
   * @param {number} id - The category ID
   * @returns {Promise<Object|undefined>} The category object or undefined
   */
  async getCategoryById(id) {
    return this.categories.get(id);
  }
  
  /**
   * Creates a new category
   * @param {Object} category - The category data
   * @returns {Promise<Object>} The created category with ID
   */
  async createCategory(category) {
    const id = this.categoryId++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  /**
   * Retrieves all menu items
   * @returns {Promise<Array>} Array of menu item objects
   */
  async getMenuItems() {
    return Array.from(this.menuItems.values());
  }
  
  /**
   * Retrieves a menu item by ID
   * @param {number} id - The menu item ID
   * @returns {Promise<Object|undefined>} The menu item object or undefined
   */
  async getMenuItemById(id) {
    return this.menuItems.get(id);
  }
  
  /**
   * Retrieves menu items by category ID
   * @param {number} categoryId - The category ID
   * @returns {Promise<Array>} Array of menu item objects in the category
   */
  async getMenuItemsByCategory(categoryId) {
    return Array.from(this.menuItems.values()).filter(
      item => item.categoryId === categoryId
    );
  }
  
  /**
   * Retrieves featured menu items
   * @returns {Promise<Array>} Array of featured menu item objects
   */
  async getFeaturedMenuItems() {
    return Array.from(this.menuItems.values()).filter(
      item => item.featured
    );
  }
  
  /**
   * Creates a new menu item
   * @param {Object} menuItem - The menu item data
   * @returns {Promise<Object>} The created menu item with ID
   */
  async createMenuItem(menuItem) {
    const id = this.menuItemId++;
    const newMenuItem = { ...menuItem, id };
    this.menuItems.set(id, newMenuItem);
    return newMenuItem;
  }
  
  /**
   * Retrieves all reservations
   * @returns {Promise<Array>} Array of reservation objects
   */
  async getReservations() {
    return Array.from(this.reservations.values());
  }
  
  /**
   * Retrieves a reservation by ID
   * @param {number} id - The reservation ID
   * @returns {Promise<Object|undefined>} The reservation object or undefined
   */
  async getReservationById(id) {
    return this.reservations.get(id);
  }
  
  /**
   * Creates a new reservation
   * @param {Object} reservation - The reservation data
   * @returns {Promise<Object>} The created reservation with ID and status
   */
  async createReservation(reservation) {
    const id = this.reservationId++;
    const newReservation = { ...reservation, id, status: "pending" };
    this.reservations.set(id, newReservation);
    return newReservation;
  }
  
  /**
   * Updates the status of a reservation
   * @param {number} id - The reservation ID
   * @param {string} status - The new status
   * @returns {Promise<Object|undefined>} The updated reservation or undefined
   */
  async updateReservationStatus(id, status) {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    
    const updatedReservation = { ...reservation, status };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }
  
  /**
   * Retrieves all contact messages
   * @returns {Promise<Array>} Array of contact message objects
   */
  async getContactMessages() {
    return Array.from(this.contactMessages.values());
  }
  
  /**
   * Creates a new contact message
   * @param {Object} contactMessage - The contact message data
   * @returns {Promise<Object>} The created contact message with ID and timestamp
   */
  async createContactMessage(contactMessage) {
    const id = this.contactMessageId++;
    const newContactMessage = { 
      ...contactMessage, 
      id, 
      createdAt: new Date().toISOString() 
    };
    this.contactMessages.set(id, newContactMessage);
    return newContactMessage;
  }
  
  /**
   * Retrieves all orders
   * @returns {Promise<Array>} Array of order objects
   */
  async getOrders() {
    return Array.from(this.orders.values());
  }
  
  /**
   * Retrieves an order by ID
   * @param {number} id - The order ID
   * @returns {Promise<Object|undefined>} The order object or undefined
   */
  async getOrderById(id) {
    return this.orders.get(id);
  }
  
  /**
   * Creates a new order
   * @param {Object} order - The order data
   * @returns {Promise<Object>} The created order with ID, status, and timestamp
   */
  async createOrder(order) {
    const id = this.orderId++;
    const newOrder = { 
      ...order, 
      id, 
      status: "pending",
      createdAt: new Date().toISOString()
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  /**
   * Updates the status of an order
   * @param {number} id - The order ID
   * @param {string} status - The new status
   * @returns {Promise<Object|undefined>} The updated order or undefined
   */
  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  /**
   * Retrieves all testimonials
   * @returns {Promise<Array>} Array of testimonial objects
   */
  async getTestimonials() {
    return Array.from(this.testimonials.values());
  }
  
  /**
   * Creates a new testimonial
   * @param {Object} testimonial - The testimonial data
   * @returns {Promise<Object>} The created testimonial with ID
   */
  async createTestimonial(testimonial) {
    const id = this.testimonialId++;
    const newTestimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }
  
  /**
   * Retrieves all currency settings
   * @returns {Promise<Array>} Array of currency setting objects
   */
  async getCurrencySettings() {
    return Array.from(this.currencySettings.values());
  }
  
  /**
   * Retrieves the default currency setting
   * @returns {Promise<Object|undefined>} The default currency setting or undefined
   */
  async getDefaultCurrency() {
    return Array.from(this.currencySettings.values()).find(
      currency => currency.isDefault
    );
  }
  
  /**
   * Creates a new currency setting
   * @param {Object} currencySetting - The currency setting data
   * @returns {Promise<Object>} The created currency setting with ID
   */
  async createCurrencySetting(currencySetting) {
    const id = this.currencySettingId++;
    const newCurrencySetting = { ...currencySetting, id };
    this.currencySettings.set(id, newCurrencySetting);
    return newCurrencySetting;
  }
  
  /**
   * Updates the default currency
   * @param {number} id - The currency setting ID to set as default
   * @returns {Promise<Object|undefined>} The updated currency setting or undefined
   */
  async updateDefaultCurrency(id) {
    const currency = this.currencySettings.get(id);
    if (!currency) return undefined;
    
    // Update all currencies to non-default
    for (const [currencyId, currencySetting] of this.currencySettings.entries()) {
      if (currencySetting.isDefault) {
        this.currencySettings.set(currencyId, {
          ...currencySetting,
          isDefault: false
        });
      }
    }
    
    // Set the selected currency as default
    const updatedCurrency = { ...currency, isDefault: true };
    this.currencySettings.set(id, updatedCurrency);
    return updatedCurrency;
  }
}

// Export singleton instance
const storage = new MemStorage();

export {
  IStorage,
  MemStorage,
  storage
};