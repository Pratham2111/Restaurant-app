/**
 * Script to add a specific test order to MongoDB database
 * Run with: node scripts/add-specific-order.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
const Order = mongoose.model('Order', orderSchema, 'orders');
const User = mongoose.model('User', new mongoose.Schema({}), 'users');
const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({}), 'menuItems');

// Create a specific test order for a user
async function createSpecificOrder() {
  try {
    // Find a specific user (you can replace this with a specific email)
    const user = await User.findOne({ email: 'tl@tl.com' });
    if (!user) {
      console.log('User not found. Looking for any user...');
      // Try to find any user
      const anyUser = await User.findOne({});
      if (!anyUser) {
        throw new Error('No users found in the database');
      }
      console.log(`Using user: ${anyUser.email} (ID: ${anyUser._id})`);
      return createOrderForUser(anyUser);
    }
    
    console.log(`Found user: ${user.email} (ID: ${user._id})`);
    return createOrderForUser(user);
    
  } catch (error) {
    console.error('Error creating test order:', error);
  }
}

async function createOrderForUser(user) {
  // Find some menu items
  const menuItems = await MenuItem.find({}).limit(3);
  if (menuItems.length === 0) {
    throw new Error('No menu items found in the database');
  }
  console.log(`Found ${menuItems.length} menu items`);
  
  // Create order items
  const orderItems = [];
  let subtotal = 0;
  
  for (const menuItem of menuItems) {
    const quantity = Math.ceil(Math.random() * 2); // 1 or 2
    const price = parseFloat(menuItem.price);
    
    orderItems.push({
      menuItem: menuItem._id,
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: price,
      quantity: quantity,
      specialInstructions: ""
    });
    
    subtotal += price * quantity;
  }
  
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = 5.99;
  const total = subtotal + tax + deliveryFee;
  
  // Create the order
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
    delivery: true,
    address: {
      street: '123 Main St',
      city: 'Anytown', 
      state: 'CA',
      zipCode: '90210',
    },
    paymentMethod: 'creditCard',
    status: 'delivered',
    specialInstructions: "Please deliver to the back door",
    createdAt: new Date(),
    estimatedDeliveryTime: new Date(Date.now() + 1000 * 60 * 45), // 45 min from now
  });
  
  await order.save();
  console.log(`Created test order for user ${user.email} with ${orderItems.length} items`);
  return order;
}

// Main function
async function main() {
  try {
    const db = await connectToMongoDB();
    await createSpecificOrder();
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Run the script
main();