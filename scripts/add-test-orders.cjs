/**
 * Script to add test orders to MongoDB database
 * Run with: node scripts/add-test-orders.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs').promises;

// Load environment variables
dotenv.config();

// MongoDB connection
async function connectToMongoDB() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define schemas
const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  menuItemId: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  specialInstructions: {
    type: String,
    trim: true,
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User',
    required: true,
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryFee: {
    type: Number,
    min: 0,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  delivery: {
    type: Boolean,
    default: false,
  },
  address: {
    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
  },
  paymentMethod: {
    type: String,
    enum: ['creditCard', 'cash', 'paypal'],
    default: 'cash',
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'],
    default: 'pending',
  },
  specialInstructions: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  estimatedDeliveryTime: {
    type: Date,
  },
});

// Create models
const Order = mongoose.model('Order', orderSchema);
const User = mongoose.model('User', new mongoose.Schema({}));
const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({}));

// Create test orders
async function createTestOrders() {
  try {
    // Get users from database
    const users = await User.find({});
    if (users.length === 0) {
      throw new Error('No users found in the database');
    }
    console.log(`Found ${users.length} users`);
    
    // Get menu items from database
    const menuItems = await MenuItem.find({});
    if (menuItems.length === 0) {
      throw new Error('No menu items found in the database');
    }
    console.log(`Found ${menuItems.length} menu items`);

    // Generate test orders
    for (const user of users) {
      // Skip admin users
      if (user.role === 'admin') {
        console.log(`Skipping admin user: ${user.email}`);
        continue;
      }
      
      console.log(`Creating test orders for user: ${user.email} (ID: ${user._id})`);
      
      // Create 2 orders per user with random menu items
      for (let i = 0; i < 2; i++) {
        // Select 1-3 random menu items
        const numItems = Math.floor(Math.random() * 3) + 1;
        const orderItems = [];
        let subtotal = 0;
        
        for (let j = 0; j < numItems; j++) {
          const randomIndex = Math.floor(Math.random() * menuItems.length);
          const menuItem = menuItems[randomIndex];
          const quantity = Math.floor(Math.random() * 3) + 1;
          const price = parseFloat(menuItem.price);
          
          orderItems.push({
            menuItem: menuItem._id,
            menuItemId: menuItem._id,
            name: menuItem.name,
            price: price,
            quantity: quantity,
            specialInstructions: Math.random() > 0.7 ? "Extra spicy, please" : ""
          });
          
          subtotal += price * quantity;
        }
        
        const tax = subtotal * 0.08; // 8% tax
        const deliveryFee = Math.random() > 0.5 ? 5.99 : 0;
        const total = subtotal + tax + deliveryFee;
        const isDelivery = deliveryFee > 0;
        
        // Create random dates within the last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - daysAgo);
        
        // Vary order status
        const statusOptions = ['pending', 'preparing', 'ready', 'delivered', 'completed'];
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        // Estimate delivery time (30-60 minutes from order creation)
        const estimatedDeliveryTime = new Date(orderDate);
        estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + Math.floor(Math.random() * 30) + 30);
        
        const order = new Order({
          userId: user._id,
          customer: {
            name: user.name || user.username || 'Customer',
            email: user.email,
            phone: user.phone || '555-123-4567',
          },
          items: orderItems,
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          deliveryFee: deliveryFee,
          total: parseFloat(total.toFixed(2)),
          delivery: isDelivery,
          address: isDelivery ? {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '90210',
          } : null,
          paymentMethod: Math.random() > 0.5 ? 'creditCard' : 'cash',
          status: randomStatus,
          specialInstructions: Math.random() > 0.8 ? "Please ring the doorbell" : "",
          createdAt: orderDate,
          estimatedDeliveryTime: estimatedDeliveryTime,
        });
        
        await order.save();
        console.log(`Created order ${i+1} for user ${user.email} with ${numItems} items, status: ${randomStatus}`);
      }
    }
    
    console.log('Test orders created successfully');
  } catch (error) {
    console.error('Error creating test orders:', error);
  }
}

// Main function
async function main() {
  try {
    const db = await connectToMongoDB();
    
    // Check if we already have orders in the database
    const orderCount = await Order.countDocuments();
    console.log(`Found ${orderCount} existing orders`);
    
    if (orderCount < 5) {
      await createTestOrders();
    } else {
      console.log('Database already has orders, skipping test data creation');
    }
    
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Run the script
main();