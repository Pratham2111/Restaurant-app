const { z } = require('zod');
const { createInsertSchema } = require('drizzle-zod');

// Category schema
const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional()
});

const insertCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional()
});

// Menu item schema
const menuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryId: z.number(),
  description: z.string(),
  price: z.string(),
  image: z.string().nullable().optional(),
  featured: z.boolean().nullable().optional()
});

const insertMenuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  categoryId: z.number(),
  description: z.string(),
  price: z.string(),
  image: z.string().nullable().optional(),
  featured: z.boolean().nullable().optional()
});

// Reservation schema
const reservationSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.date(),
  time: z.string(),
  email: z.string().email(),
  phone: z.string(),
  guests: z.number().min(1).max(10),
  specialRequests: z.string().nullable().optional(),
  status: z.string().nullable().optional()
});

const insertReservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.date(),
  time: z.string(),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  guests: z.number().min(1, "At least 1 guest required").max(10, "Maximum 10 guests allowed"),
  specialRequests: z.string().nullable().optional()
});

// Contact message schema
const contactMessageSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
  createdAt: z.date()
});

const insertContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required")
});

// Order schema
const orderSchema = z.object({
  id: z.number(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  deliveryAddress: z.string(),
  orderItems: z.string(), // JSON string of items
  totalAmount: z.number(),
  status: z.string(),
  createdAt: z.date()
});

const insertOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  orderItems: z.string(), // JSON string of items
  totalAmount: z.number().min(0, "Total amount cannot be negative")
});

// Testimonial schema
const testimonialSchema = z.object({
  id: z.number(),
  name: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  image: z.string().nullable().optional()
});

const insertTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
  comment: z.string().min(1, "Comment is required"),
  image: z.string().nullable().optional()
});

// Currency settings schema
const currencySettingSchema = z.object({
  id: z.number(),
  symbol: z.string(),
  code: z.string(),
  rate: z.number(),
  isDefault: z.boolean().nullable().optional()
});

const insertCurrencySettingSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  code: z.string().min(1, "Code is required"),
  rate: z.number().min(0, "Rate must be positive"),
  isDefault: z.boolean().nullable().optional()
});

// Cart item type (used on the client-side)
const cartItemSchema = z.object({
  menuItemId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string().optional()
});

module.exports = {
  // Schemas
  categorySchema,
  insertCategorySchema,
  menuItemSchema,
  insertMenuItemSchema,
  reservationSchema,
  insertReservationSchema,
  contactMessageSchema,
  insertContactMessageSchema,
  orderSchema,
  insertOrderSchema,
  testimonialSchema,
  insertTestimonialSchema,
  currencySettingSchema,
  insertCurrencySettingSchema,
  cartItemSchema
};