/**
 * Simple script to create a test order
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    
    // Get user
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      name: String,
      role: String
    }));
    
    const user = await User.findOne({ role: 'customer' });
    console.log('User found:', JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }, null, 2));
    
    // Get menu items with full details for debugging
    const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({
      name: String,
      price: Number,
      description: String
    }));
    
    const menuItems = await MenuItem.find({}).limit(3);
    console.log('Menu items found:', menuItems.length);
    
    // Log each menu item in detail
    menuItems.forEach((item, index) => {
      console.log(`Menu item ${index + 1}:`, JSON.stringify({
        id: item._id,
        name: item.name,
        price: item.price,
        price_type: typeof item.price,
        description: item.description
      }, null, 2));
    });
    
    // Define a simpler Order schema for testing
    const Order = mongoose.model('Order', new mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      items: [{
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: true
        },
        name: String,
        price: Number,
        quantity: Number
      }],
      total: Number,
      status: {
        type: String,
        default: 'pending'
      },
      customer: {
        name: String,
        email: String,
        phone: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }));
    
    // Create a very simple order
    const item = menuItems[0];
    const quantity = 1;
    const price = Number(item.price);
    
    console.log('Creating order with:');
    console.log(`- MenuItem ID: ${item._id}`);
    console.log(`- Name: ${item.name}`);
    console.log(`- Price: ${price} (${typeof price})`);
    console.log(`- Quantity: ${quantity}`);
    console.log(`- Total: ${price * quantity}`);
    
    const order = new Order({
      userId: user._id,
      customer: {
        name: user.name,
        email: user.email,
        phone: '555-123-4567'
      },
      items: [{
        menuItem: item._id,
        name: item.name,
        price: price,
        quantity: quantity
      }],
      total: price * quantity
    });
    
    await order.save();
    console.log('Order created successfully with ID:', order._id);
    
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();