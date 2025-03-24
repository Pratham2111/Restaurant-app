/**
 * Script to add test reservations to MongoDB database
 * Run with: node scripts/add-test-reservations.cjs
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

// Define User schema to properly retrieve user data
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  phone: String,
  role: String
});

// Define Reservation schema
const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User',
  },
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
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const Reservation = mongoose.model('Reservation', reservationSchema);
const User = mongoose.model('User', userSchema);

// Create test reservations
async function createTestReservations() {
  try {
    // Create fixed test reservations to ensure we have good data
    const testReservations = [
      {
        name: "Rock",
        email: "tl@tl.com",
        phone: "555-123-4567",
        date: new Date(2025, 2, 26), // March 26, 2025
        time: "7:00 PM",
        guests: 4,
        status: "confirmed",
        specialRequests: "Anniversary dinner"
      },
      {
        name: "Rock",
        email: "tl@tl.com", 
        phone: "555-123-4567",
        date: new Date(2025, 3, 15), // April 15, 2025
        time: "6:30 PM",
        guests: 2,
        status: "pending",
        specialRequests: ""
      },
      {
        name: "Peter Patel",
        email: "tl2@tl.com",
        phone: "555-987-6543",
        date: new Date(2025, 2, 30), // March 30, 2025
        time: "8:00 PM",
        guests: 6,
        status: "confirmed",
        specialRequests: "Birthday celebration"
      },
      {
        name: "Peter Patel",
        email: "tl2@tl.com",
        phone: "555-987-6543",
        date: new Date(2025, 3, 10), // April 10, 2025
        time: "12:30 PM",
        guests: 3,
        status: "completed",
        specialRequests: "Window seat preferred"
      }
    ];

    // Try to find matching users for our test reservations
    for (const reservation of testReservations) {
      try {
        // Find user by email
        const user = await User.findOne({ email: reservation.email });
        
        if (user) {
          console.log(`Found user for ${reservation.email}: ${user._id}`);
          reservation.userId = user._id;
        } else {
          console.log(`No user found for ${reservation.email}, creating reservation without userId`);
        }
        
        // Create the reservation
        const newReservation = new Reservation(reservation);
        await newReservation.save();
        console.log(`Created reservation for ${reservation.name} on ${reservation.date.toLocaleDateString()} at ${reservation.time}`);
      } catch (error) {
        console.error(`Error creating reservation for ${reservation.email}:`, error.message);
      }
    }
    
    console.log('Test reservations created successfully');
  } catch (error) {
    console.error('Error creating test reservations:', error);
  }
}

// Main function
async function main() {
  try {
    const db = await connectToMongoDB();
    
    // Check if we already have reservations in the database
    const reservationCount = await Reservation.countDocuments();
    console.log(`Found ${reservationCount} existing reservations`);
    
    // Get user count for diagnostics
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in the database`);
    
    if (userCount > 0) {
      // Show some user data to debug
      const users = await User.find().limit(5);
      users.forEach(user => {
        console.log(`User: ${user.name || 'unnamed'} | Email: ${user.email || 'no email'} | Role: ${user.role || 'no role'}`);
      });
    }
    
    if (reservationCount < 5) {
      await createTestReservations();
    } else {
      console.log('Database already has reservations, skipping test data creation');
    }
    
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Run the script
main();