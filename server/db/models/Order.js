/**
 * Order model for restaurant orders
 */

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.Mixed, // Using Mixed type to accept both ObjectId and other formats
    ref: 'MenuItem',
    required: true,
  },
  menuItemId: {
    type: mongoose.Schema.Types.Mixed, // Allow for either string or number IDs
    required: false, // Not required as we might use menuItem directly
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
    type: mongoose.Schema.Types.Mixed, // Use Mixed to handle different ID formats
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

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);

export default Order;