/**
 * Reservation model for table reservations
 */

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // Use Mixed to handle different ID formats
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
    trim: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Reservation model
const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;