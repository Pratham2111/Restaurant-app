/**
 * Script to add a specific test order to MongoDB database
 * Run with: node scripts/add-specific-order.cjs
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
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
    type: mongoose.Schema.Types.ObjectId,
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

// Create a specific order for testing
async function createOrderForUser() {
  try {
    // Get customer user (not admin)
    const user = await User.findOne({ role: 'customer' });
    if (!user) {
      throw new Error('No customer user found in the database');
    }
    console.log(`Found user: ${user.email} (ID: ${user._id})`);
    
    // Get menu items
    const menuItems = await MenuItem.find({}).limit(3);
    if (menuItems.length === 0) {
      throw new Error('No menu items found in the database');
    }
    console.log(`Found ${menuItems.length} menu items to use in the order`);

    // Create order items
    const orderItems = [];
    let subtotal = 0;
    
    // Add 2 of the first item
    const item1 = menuItems[0];
    const quantity1 = 2;
    orderItems.push({
      menuItem: item1._id,
      name: item1.name,
      price: item1.price,
      quantity: quantity1,
      specialInstructions: "Extra sauce, please"
    });
    subtotal += item1.price * quantity1;
    
    // Add 1 of the second item if available
    if (menuItems.length > 1) {
      const item2 = menuItems[1];
      const quantity2 = 1;
      orderItems.push({
        menuItem: item2._id,
        name: item2.name,
        price: item2.price,
        quantity: quantity2
      });
      subtotal += item2.price * quantity2;
    }
    
    const tax = parseFloat((subtotal * 0.08).toFixed(2)); // 8% tax
    const deliveryFee = 5.99;
    const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));
    
    // Create order
    const order = new Order({
      userId: user._id,
      customer: {
        name: user.name || "Customer",
        email: user.email,
        phone: "555-123-4567"
      },
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      total: total,
      delivery: true,
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "90210"
      },
      paymentMethod: "creditCard",
      status: "pending",
      specialInstructions: "Please deliver to the back door",
      createdAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) // 45 minutes from now
    });
    
    await order.save();
    console.log(`Created order with ID: ${order._id}`);
    console.log(`Order total: $${order.total.toFixed(2)}`);
    console.log(`Order items: ${order.items.length}`);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Create a completed order in the past
async function createCompletedOrder() {
  try {
    // Get customer user (not admin)
    const user = await User.findOne({ role: 'customer' });
    if (!user) {
      throw new Error('No customer user found in the database');
    }
    
    // Get menu items
    const menuItems = await MenuItem.find({}).limit(3);
    if (menuItems.length === 0) {
      throw new Error('No menu items found in the database');
    }

    // Create order items for a past order
    const orderItems = [];
    let subtotal = 0;
    
    // Add some items
    menuItems.forEach((item, index) => {
      const quantity = index === 0 ? 2 : 1;
      orderItems.push({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: quantity
      });
      subtotal += item.price * quantity;
    });
    
    const tax = parseFloat((subtotal * 0.08).toFixed(2)); // 8% tax
    const deliveryFee = 0; // Pickup order
    const total = parseFloat((subtotal + tax).toFixed(2));
    
    // Create a past order (7 days ago)
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);
    
    const order = new Order({
      userId: user._id,
      customer: {
        name: user.name || "Customer",
        email: user.email,
        phone: "555-123-4567"
      },
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      total: total,
      delivery: false, // Pickup
      paymentMethod: "cash",
      status: "completed", // Already completed
      createdAt: pastDate,
    });
    
    await order.save();
    console.log(`Created completed order with ID: ${order._id} (dated ${pastDate.toLocaleDateString()})`);
    return order;
  } catch (error) {
    console.error('Error creating completed order:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    await connectToMongoDB();
    
    // Check if we already have orders in the database
    const orderCount = await Order.countDocuments();
    console.log(`Found ${orderCount} existing orders`);
    
    // Create two sample orders (one current, one past)
    await createOrderForUser();
    await createCompletedOrder();
    
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Run the script
main();