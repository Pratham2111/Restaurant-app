/**
 * Category model for menu categories
 */

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  }
});

// Create and export the Category model
const Category = mongoose.model('Category', categorySchema);

export default Category;