/**
 * MongoDB configuration using Mongoose ODM
 * This module handles connection to MongoDB and provides the database instance
 */

import mongoose from 'mongoose';

/**
 * Initialize MongoDB connection
 * @param {string} mongoURI - MongoDB connection URI
 * @returns {Promise<mongoose.Connection>} Mongoose connection
 */
export async function connectDB(mongoURI) {
  try {
    if (!mongoURI) {
      throw new Error('MongoDB URI is required');
    }
    
    // Configure mongoose connection
    mongoose.set('strictQuery', false);
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      // Mongoose 6+ no longer needs these options, they're set by default
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit process, allow application to fall back to in-memory storage
    // process.exit(1);
    throw error;
  }
}

/**
 * Closes the MongoDB connection
 * @returns {Promise<void>}
 */
export async function closeDB() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
    throw error;
  }
}

export default mongoose;