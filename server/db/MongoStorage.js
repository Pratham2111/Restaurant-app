/**
 * MongoDB storage implementation for the restaurant application.
 * This module provides storage for categories, menu items, reservations,
 * contact messages, orders, testimonials, and currency settings using MongoDB.
 */

import mongoose from 'mongoose';
import { Category, MenuItem, Reservation, Order, User } from './models/index.js';
import { createDefaultAdminIfNeeded } from './createDefaultAdmin.js';

/**
 * MongoDB implementation of the storage interface
 */
class MongoStorage {
  constructor() {
    // These will be dynamically created in MongoDB
    this.contactMessages = [];
    this.testimonials = [];
    this.currencySettings = [];
    this.defaultCurrency = null;
  }

  /**
   * Initializes storage with sample data if collections are empty
   */
  async initializeData() {
    try {
      // Only initialize if collections are empty
      const categoryCount = await Category.countDocuments();
      
      if (categoryCount === 0) {
        console.log('Initializing MongoDB with sample data...');
        
        // Sample categories
        const categories = [
          {
            name: 'Appetizers',
            description: 'Start your meal with our delicious appetizers',
            slug: 'appetizers',
            sortOrder: 1
          },
          {
            name: 'Main Courses',
            description: 'Exquisite main dishes prepared by our chef',
            slug: 'main-courses',
            sortOrder: 2
          },
          {
            name: 'Desserts',
            description: 'Sweet treats to end your meal',
            slug: 'desserts',
            sortOrder: 3
          },
          {
            name: 'Beverages',
            description: 'Refresh yourself with our selection of drinks',
            slug: 'beverages',
            sortOrder: 4
          }
        ];
        
        // Insert sample categories
        const savedCategories = await Category.insertMany(categories);
        
        // Sample menu items with references to the created categories
        const appetizersId = savedCategories.find(cat => cat.slug === 'appetizers')._id;
        const mainCoursesId = savedCategories.find(cat => cat.slug === 'main-courses')._id;
        const dessertsId = savedCategories.find(cat => cat.slug === 'desserts')._id;
        const beveragesId = savedCategories.find(cat => cat.slug === 'beverages')._id;
        
        const menuItems = [
          {
            name: 'Bruschetta',
            description: 'Toasted bread topped with diced tomatoes, garlic, basil, and olive oil',
            price: 8.99,
            category: appetizersId,
            ingredients: ['Bread', 'Tomatoes', 'Garlic', 'Basil', 'Olive oil'],
            allergens: ['Gluten'],
            featured: true,
            spicyLevel: 0,
            vegetarian: true,
            sortOrder: 1
          },
          {
            name: 'Calamari',
            description: 'Crispy fried squid rings served with lemon aioli',
            price: 12.99,
            category: appetizersId,
            ingredients: ['Squid', 'Flour', 'Eggs', 'Breadcrumbs', 'Lemon', 'Garlic'],
            allergens: ['Gluten', 'Eggs', 'Seafood'],
            featured: false,
            spicyLevel: 1,
            sortOrder: 2
          },
          {
            name: 'Filet Mignon',
            description: 'Premium beef tenderloin cooked to perfection, served with truffle mashed potatoes',
            price: 34.99,
            category: mainCoursesId,
            ingredients: ['Beef tenderloin', 'Butter', 'Herbs', 'Potatoes', 'Truffle oil'],
            allergens: ['Dairy'],
            featured: true,
            spicyLevel: 0,
            sortOrder: 1
          },
          {
            name: 'Lobster Risotto',
            description: 'Creamy risotto with fresh lobster meat, finished with butter and parmesan',
            price: 29.99,
            category: mainCoursesId,
            ingredients: ['Arborio rice', 'Lobster', 'White wine', 'Butter', 'Parmesan cheese', 'Shallots'],
            allergens: ['Dairy', 'Shellfish', 'Alcohol'],
            featured: true,
            spicyLevel: 0,
            sortOrder: 2
          },
          {
            name: 'Tiramisu',
            description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
            price: 9.99,
            category: dessertsId,
            ingredients: ['Ladyfingers', 'Mascarpone', 'Coffee', 'Cocoa', 'Eggs', 'Sugar'],
            allergens: ['Dairy', 'Eggs', 'Gluten'],
            featured: true,
            spicyLevel: 0,
            vegetarian: true,
            sortOrder: 1
          },
          {
            name: 'Espresso',
            description: 'Rich, full-bodied Italian espresso',
            price: 3.99,
            category: beveragesId,
            ingredients: ['Coffee beans'],
            allergens: [],
            featured: false,
            spicyLevel: 0,
            vegetarian: true,
            vegan: true,
            glutenFree: true,
            sortOrder: 1
          }
        ];
        
        // Insert sample menu items
        await MenuItem.insertMany(menuItems);
        
        // For contact messages, testimonials, and currency settings, 
        // we'll use the in-memory approach until we create models for them
        this.currencySettings = [
          { id: 1, code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, isDefault: true },
          { id: 2, code: 'EUR', symbol: '€', name: 'Euro', rate: 0.93, isDefault: false },
          { id: 3, code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, isDefault: false }
        ];
        
        this.defaultCurrency = this.currencySettings.find(c => c.isDefault);
        
        console.log('Sample data initialized successfully');
      } else {
        console.log('MongoDB collections already contain data, skipping initialization');
      }
      
      // Create default admin user if needed
      await createDefaultAdminIfNeeded();
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }

  /**
   * Retrieves all categories
   * @returns {Promise<Array>} Array of category objects
   */
  async getCategories() {
    try {
      return await Category.find().sort({ sortOrder: 1 });
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  /**
   * Retrieves a category by ID
   * @param {string} id - The category ID
   * @returns {Promise<Object|undefined>} The category object or undefined
   */
  async getCategoryById(id) {
    try {
      return await Category.findById(id);
    } catch (error) {
      console.error('Error getting category by ID:', error);
      return undefined;
    }
  }

  /**
   * Creates a new category
   * @param {Object} category - The category data
   * @returns {Promise<Object>} The created category with ID
   */
  async createCategory(category) {
    try {
      const newCategory = new Category(category);
      return await newCategory.save();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }
  
  /**
   * Updates a category
   * @param {string} id - The category ID
   * @param {Object} categoryData - The category data to update
   * @returns {Promise<Object|undefined>} The updated category or undefined
   */
  async updateCategory(id, categoryData) {
    try {
      return await Category.findByIdAndUpdate(
        id,
        categoryData,
        { new: true }
      );
    } catch (error) {
      console.error('Error updating category:', error);
      return undefined;
    }
  }
  
  /**
   * Deletes a category
   * @param {string} id - The category ID
   * @returns {Promise<boolean>} Whether the category was deleted
   */
  async deleteCategory(id) {
    try {
      const result = await Category.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  /**
   * Retrieves all menu items
   * @returns {Promise<Array>} Array of menu item objects
   */
  async getMenuItems() {
    try {
      return await MenuItem.find().populate('category').sort({ sortOrder: 1 });
    } catch (error) {
      console.error('Error getting menu items:', error);
      return [];
    }
  }

  /**
   * Retrieves a menu item by ID
   * @param {string} id - The menu item ID
   * @returns {Promise<Object|undefined>} The menu item object or undefined
   */
  async getMenuItemById(id) {
    try {
      return await MenuItem.findById(id).populate('category');
    } catch (error) {
      console.error('Error getting menu item by ID:', error);
      return undefined;
    }
  }

  /**
   * Retrieves menu items by category ID
   * @param {string} categoryId - The category ID
   * @returns {Promise<Array>} Array of menu item objects in the category
   */
  async getMenuItemsByCategory(categoryId) {
    try {
      return await MenuItem.find({ category: categoryId }).sort({ sortOrder: 1 });
    } catch (error) {
      console.error('Error getting menu items by category:', error);
      return [];
    }
  }

  /**
   * Retrieves featured menu items
   * @returns {Promise<Array>} Array of featured menu item objects
   */
  async getFeaturedMenuItems() {
    try {
      return await MenuItem.find({ featured: true }).populate('category').sort({ sortOrder: 1 });
    } catch (error) {
      console.error('Error getting featured menu items:', error);
      return [];
    }
  }

  /**
   * Creates a new menu item
   * @param {Object} menuItem - The menu item data
   * @returns {Promise<Object>} The created menu item with ID
   */
  async createMenuItem(menuItem) {
    try {
      const newMenuItem = new MenuItem(menuItem);
      return await newMenuItem.save();
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  }
  
  /**
   * Updates a menu item
   * @param {string} id - The menu item ID
   * @param {Object} menuItemData - The menu item data to update
   * @returns {Promise<Object|undefined>} The updated menu item or undefined
   */
  async updateMenuItem(id, menuItemData) {
    try {
      return await MenuItem.findByIdAndUpdate(
        id,
        menuItemData,
        { new: true }
      ).populate('category');
    } catch (error) {
      console.error('Error updating menu item:', error);
      return undefined;
    }
  }
  
  /**
   * Deletes a menu item
   * @param {string} id - The menu item ID
   * @returns {Promise<boolean>} Whether the menu item was deleted
   */
  async deleteMenuItem(id) {
    try {
      const result = await MenuItem.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return false;
    }
  }

  /**
   * Retrieves all reservations
   * @returns {Promise<Array>} Array of reservation objects
   */
  async getReservations() {
    try {
      return await Reservation.find().sort({ date: 1, time: 1 });
    } catch (error) {
      console.error('Error getting reservations:', error);
      return [];
    }
  }

  /**
   * Retrieves a reservation by ID
   * @param {string} id - The reservation ID
   * @returns {Promise<Object|undefined>} The reservation object or undefined
   */
  async getReservationById(id) {
    try {
      return await Reservation.findById(id);
    } catch (error) {
      console.error('Error getting reservation by ID:', error);
      return undefined;
    }
  }

  /**
   * Creates a new reservation
   * @param {Object} reservation - The reservation data
   * @returns {Promise<Object>} The created reservation with ID and status
   */
  async createReservation(reservation) {
    try {
      const newReservation = new Reservation(reservation);
      return await newReservation.save();
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  /**
   * Updates the status of a reservation
   * @param {string} id - The reservation ID
   * @param {string} status - The new status
   * @returns {Promise<Object|undefined>} The updated reservation or undefined
   */
  async updateReservationStatus(id, status) {
    try {
      return await Reservation.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating reservation status:', error);
      return undefined;
    }
  }

  /**
   * Retrieves all contact messages
   * @returns {Promise<Array>} Array of contact message objects
   */
  async getContactMessages() {
    // Using in-memory approach until we create a model for contact messages
    return this.contactMessages;
  }

  /**
   * Creates a new contact message
   * @param {Object} contactMessage - The contact message data
   * @returns {Promise<Object>} The created contact message with ID and timestamp
   */
  async createContactMessage(contactMessage) {
    // Using in-memory approach until we create a model for contact messages
    const newContactMessage = {
      id: Date.now(),
      ...contactMessage,
      read: false,
      timestamp: new Date().toISOString()
    };
    this.contactMessages.push(newContactMessage);
    return newContactMessage;
  }
  
  /**
   * Updates a contact message status
   * @param {number} id - The contact message ID
   * @param {Object} statusData - The status data to update
   * @returns {Promise<Object|undefined>} The updated contact message or undefined
   */
  async updateContactMessageStatus(id, statusData) {
    // Using in-memory approach until we create a model for contact messages
    const index = this.contactMessages.findIndex(msg => msg.id === parseInt(id));
    if (index === -1) return undefined;
    
    this.contactMessages[index] = {
      ...this.contactMessages[index],
      ...statusData
    };
    
    return this.contactMessages[index];
  }

  /**
   * Retrieves all orders
   * @returns {Promise<Array>} Array of order objects
   */
  async getOrders() {
    try {
      return await Order.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  /**
   * Retrieves an order by ID
   * @param {string} id - The order ID
   * @returns {Promise<Object|undefined>} The order object or undefined
   */
  async getOrderById(id) {
    try {
      return await Order.findById(id);
    } catch (error) {
      console.error('Error getting order by ID:', error);
      return undefined;
    }
  }

  /**
   * Creates a new order
   * @param {Object} order - The order data
   * @returns {Promise<Object>} The created order with ID, status, and timestamp
   */
  async createOrder(order) {
    try {
      const newOrder = new Order(order);
      return await newOrder.save();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Updates the status of an order
   * @param {string} id - The order ID
   * @param {string} status - The new status
   * @returns {Promise<Object|undefined>} The updated order or undefined
   */
  async updateOrderStatus(id, status) {
    try {
      return await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      return undefined;
    }
  }

  /**
   * Retrieves all testimonials
   * @param {boolean} showAll - Whether to show all testimonials or just approved ones
   * @returns {Promise<Array>} Array of testimonial objects
   */
  async getTestimonials(showAll = false) {
    // Using in-memory approach until we create a model for testimonials
    if (showAll) {
      return this.testimonials;
    } else {
      return this.testimonials.filter(t => t.status === 'approved');
    }
  }

  /**
   * Creates a new testimonial
   * @param {Object} testimonial - The testimonial data
   * @returns {Promise<Object>} The created testimonial with ID
   */
  async createTestimonial(testimonial) {
    // Using in-memory approach until we create a model for testimonials
    const newTestimonial = {
      id: Date.now(),
      ...testimonial,
      status: 'pending', // All new testimonials start as pending for admin approval
      createdAt: new Date().toISOString()
    };
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }
  
  /**
   * Updates a testimonial status
   * @param {number} id - The testimonial ID
   * @param {string} status - The new status (pending, approved, rejected)
   * @returns {Promise<Object|undefined>} The updated testimonial or undefined
   */
  async updateTestimonialStatus(id, status) {
    // Using in-memory approach until we create a model for testimonials
    const index = this.testimonials.findIndex(t => t.id === parseInt(id));
    if (index === -1) return undefined;
    
    this.testimonials[index] = {
      ...this.testimonials[index],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return this.testimonials[index];
  }
  
  /**
   * Deletes a testimonial
   * @param {number} id - The testimonial ID
   * @returns {Promise<boolean>} Whether the testimonial was deleted
   */
  async deleteTestimonial(id) {
    // Using in-memory approach until we create a model for testimonials
    const initialLength = this.testimonials.length;
    this.testimonials = this.testimonials.filter(t => t.id !== parseInt(id));
    return initialLength > this.testimonials.length;
  }

  /**
   * Retrieves all currency settings
   * @returns {Promise<Array>} Array of currency setting objects
   */
  async getCurrencySettings() {
    // Using in-memory approach until we create a model for currency settings
    return this.currencySettings;
  }

  /**
   * Retrieves the default currency setting
   * @returns {Promise<Object|undefined>} The default currency setting or undefined
   */
  async getDefaultCurrency() {
    // Using in-memory approach until we create a model for currency settings
    return this.defaultCurrency;
  }

  /**
   * Creates a new currency setting
   * @param {Object} currencySetting - The currency setting data
   * @returns {Promise<Object>} The created currency setting with ID
   */
  async createCurrencySetting(currencySetting) {
    // Using in-memory approach until we create a model for currency settings
    const newCurrencySetting = {
      id: this.currencySettings.length + 1,
      ...currencySetting,
      isDefault: false
    };
    this.currencySettings.push(newCurrencySetting);
    return newCurrencySetting;
  }

  /**
   * Updates the default currency
   * @param {number} id - The currency setting ID to set as default
   * @returns {Promise<Object|undefined>} The updated currency setting or undefined
   */
  async updateDefaultCurrency(id) {
    // Using in-memory approach until we create a model for currency settings
    const index = this.currencySettings.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    // Reset all to not default
    this.currencySettings.forEach(c => c.isDefault = false);
    
    // Set the new default
    this.currencySettings[index].isDefault = true;
    this.defaultCurrency = this.currencySettings[index];
    
    return this.currencySettings[index];
  }

  /**
   * Retrieves all users
   * @returns {Promise<Array>} Array of user objects
   */
  async getUsers() {
    try {
      const users = await User.find().select('-password');
      
      // Convert Mongoose documents to plain objects with consistent id property
      return users.map(user => {
        const userObj = user.toObject();
        userObj.id = userObj._id.toString();
        return userObj;
      });
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  /**
   * Retrieves a user by ID
   * @param {string} id - The user ID
   * @param {boolean} includePassword - Whether to include the password field
   * @returns {Promise<Object|undefined>} The user object or undefined
   */
  async getUserById(id, includePassword = false) {
    try {
      // If includePassword is true, don't exclude the password field
      const selection = includePassword ? '' : '-password';
      const user = await User.findById(id).select(selection);
      if (!user) return undefined;
      
      // Convert Mongoose document to plain object and ensure consistent id field
      const userObject = user.toObject();
      userObject.id = userObject._id.toString();
      
      return userObject;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  /**
   * Retrieves a user by email
   * @param {string} email - The user email
   * @returns {Promise<Object|undefined>} The user object or undefined
   */
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) return undefined;
      
      // Keep original Mongoose document because we need the password for validation
      // Add id field for consistency if needed later
      const userDoc = user;
      
      // Add id property if it doesn't exist
      if (!userDoc.id && userDoc._id) {
        userDoc.id = userDoc._id.toString();
      }
      
      return userDoc;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  /**
   * Creates a new user
   * @param {Object} userData - The user data
   * @returns {Promise<Object>} The created user with ID
   */
  async createUser(userData) {
    try {
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      
      // Ensure the returned user has a consistent id property
      // For registration, we DO want to return the full user object (with password)
      // Password is filtered out in the route handler when sending the response
      if (savedUser && savedUser._id && !savedUser.id) {
        savedUser.id = savedUser._id.toString();
      }
      
      return savedUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Updates a user
   * @param {string} id - The user ID
   * @param {Object} userData - The user data to update
   * @returns {Promise<Object|undefined>} The updated user or undefined
   */
  async updateUser(id, userData) {
    try {
      // Check if we're updating the password
      if (userData.password) {
        // We need to hash the password before updating
        // since findByIdAndUpdate bypasses the pre-save middleware
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
        console.log('Password hashed before update');
      }
      
      // Find and update the user, returning the updated document
      const updatedUser = await User.findByIdAndUpdate(
        id,
        userData,
        { new: true }
      ).select('-password');
      
      // Ensure ID is consistent
      if (updatedUser) {
        const userObj = updatedUser.toObject();
        // Add id field that matches _id for consistency
        userObj.id = userObj._id.toString();
        return userObj;
      }
      
      return undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  /**
   * Deletes a user
   * @param {string} id - The user ID
   * @returns {Promise<boolean>} Whether the user was deleted
   */
  async deleteUser(id) {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}

export default MongoStorage;