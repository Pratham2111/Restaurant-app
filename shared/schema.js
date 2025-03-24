import { z } from "zod";

// Categories
const insertCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

// Menu Items
const insertMenuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Image must be a valid URL").optional(),
  categoryId: z.number().int("Category ID must be an integer"),
  featured: z.boolean().optional().default(false),
});

// Reservations
const insertReservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  date: z.string().or(z.date()),  // Can accept date string or Date object
  time: z.string().min(1, "Time is required"),
  guests: z.number().int().positive("Number of guests must be positive"),
  specialRequests: z.string().optional(),
});

// Contact Messages
const insertContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

// Orders
const insertOrderSchema = z.object({
  // Customer information
  customer: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number is required"),
  }),
  
  // Order items
  items: z.array(
    z.object({
      menuItemId: z.union([z.string(), z.number()]).optional(), // For client-side usage
      menuItem: z.union([z.string(), z.number()]).optional(), // For server-side usage
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      specialInstructions: z.string().optional(),
    })
    // Make one of menuItemId or menuItem required
    .refine(data => data.menuItemId || data.menuItem, {
      message: "Either menuItemId or menuItem must be provided",
      path: ["menuItem"]
    })
  ).min(1, "Order must have at least one item"),
  
  // Order calculations
  subtotal: z.number().positive("Subtotal must be positive"),
  tax: z.number().min(0, "Tax must be non-negative"),
  deliveryFee: z.number().min(0, "Delivery fee must be non-negative"),
  total: z.number().positive("Total must be positive"),
  
  // Delivery information
  delivery: z.boolean().optional().default(false),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional().nullable(),
  
  // Payment and notes
  paymentMethod: z.enum(["cash", "card", "creditCard", "paypal"]),
  specialInstructions: z.string().optional(),
});

// Testimonials
const insertTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Image must be a valid URL").optional(),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(1, "Comment is required"),
});

// Currency Settings
const insertCurrencySettingSchema = z.object({
  code: z.string().min(1, "Currency code is required"),
  symbol: z.string().min(1, "Currency symbol is required"),
  name: z.string().min(1, "Currency name is required"),
  rate: z.number().positive("Exchange rate must be positive"),
  isDefault: z.boolean().optional().default(false),
});

// User
const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "subadmin"]).default("subadmin"),
});

const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Cart Item type
const CartItem = z.object({
  menuItemId: z.union([z.string(), z.number()]), // Accept both string IDs (MongoDB) and number IDs
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export {
  insertCategorySchema,
  insertMenuItemSchema,
  insertReservationSchema,
  insertContactMessageSchema,
  insertOrderSchema,
  insertTestimonialSchema,
  insertCurrencySettingSchema,
  insertUserSchema,
  loginUserSchema,
  CartItem,
};