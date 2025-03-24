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
const User = mongoose.model('User', new mongoose.Schema({}));

// Create test reservations
async function createTestReservations() {
  try {
    // Get users from database
    const users = await User.find({});
    if (users.length === 0) {
      throw new Error('No users found in the database');
    }
    console.log(`Found ${users.length} users`);
    
    // Generate test reservations
    for (const user of users) {
      // Skip admin users
      if (user.role === 'admin') {
        console.log(`Skipping admin user: ${user.email}`);
        continue;
      }
      
      console.log(`Creating test reservations for user: ${user.email} (ID: ${user._id})`);
      
      // Create 2 reservations per user
      for (let i = 0; i < 2; i++) {
        // Create random dates within the next 14 days
        const daysToAdd = Math.floor(Math.random() * 14) + 1;
        const reservationDate = new Date();
        reservationDate.setDate(reservationDate.getDate() + daysToAdd);
        
        // Random time slots
        const timeSlots = [
          '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', 
          '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
        ];
        const randomTimeIndex = Math.floor(Math.random() * timeSlots.length);
        const randomTime = timeSlots[randomTimeIndex];
        
        // Random guest count
        const guests = Math.floor(Math.random() * 6) + 1;
        
        // Vary reservation status
        const statusOptions = ['pending', 'confirmed', 'completed'];
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        const reservation = new Reservation({
          userId: user._id,
          name: user.name || user.username || 'Customer',
          email: user.email,
          phone: user.phone || '555-123-4567',
          date: reservationDate,
          time: randomTime,
          guests: guests,
          status: randomStatus,
          specialRequests: i % 2 === 0 ? "Window seat preferred" : "",
          createdAt: new Date(),
        });
        
        await reservation.save();
        console.log(`Created reservation ${i+1} for user ${user.email} - Date: ${reservationDate.toLocaleDateString()}, Time: ${randomTime}, Status: ${randomStatus}`);
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