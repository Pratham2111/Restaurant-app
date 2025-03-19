import { z } from "zod";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  totalPoints: number;
  currentTierId: number | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isSpecial: boolean;
  nutritionInfo: string[];
  ingredients: string[];
  chefsStory?: string;
  preparationTime?: string;
  spicyLevel?: string;
  allergens: string[];
  servingSize?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: number;
  name: string;
  section: string;
  seats: number;
  shape: string;
  status: string;
  isActive: boolean;
  minimumSpend?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableAssignment {
  id: number;
  tableId: number;
  serverId: number;
  startTime: Date;
  endTime?: Date;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Server {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: number;
  tableId: number;
  date: Date;
  name: string;
  email: string;
  phone: string;
  guestCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  items: Array<{
    id: number;
    quantity: number;
    name: string;
    price: number;
  }>;
  total: number;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTier {
  id: number;
  name: string;
  minimumPoints: number;
  pointsMultiplier: number;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyPoint {
  id: number;
  userId: number;
  points: number;
  description: string;
  orderId?: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyReward {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: number;
  language: string;
  country: string;
  currency: string;
  translations: Record<string, Record<string, string>>;
  privacyPolicy: string;
  cookiePolicy: string;
  termsConditions: string;
  updatedAt: Date;
}

// Zod Schemas for validation
export const insertUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.string().default("customer"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertMenuItemSchema = z.object({
  categoryId: z.number(),
  name: z.string().min(1),
  description: z.string(),
  price: z.union([
    z.number(),
    z.string().transform((val) => parseFloat(val))
  ]).refine((val) => !isNaN(val) && val > 0, {
    message: "Price must be a positive number"
  }),
  imageUrl: z.string().url(),
  isSpecial: z.boolean().default(false),
  nutritionInfo: z.array(z.string()).optional().default([]),
  ingredients: z.array(z.string()).optional().default([]),
  allergens: z.array(z.string()).optional().default([]),
  chefsStory: z.string().optional(),
  preparationTime: z.string().optional(),
  spicyLevel: z.string().optional(),
  servingSize: z.string().optional()
});

export const insertTableSchema = z.object({
  name: z.string(),
  section: z.enum(['main', 'outdoor', 'private', 'bar']),
  seats: z.number().int().positive(),
  shape: z.enum(['round', 'square', 'rectangular']),
  status: z.enum(['available', 'occupied', 'reserved', 'maintenance']),
  isActive: z.boolean().default(true),
  minimumSpend: z.number().optional(),
  notes: z.string().optional()
});

export const insertBookingSchema = z.object({
  tableId: z.number(),
  date: z.string().transform(str => new Date(str)),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  guestCount: z.number().int().positive()
});

export const insertOrderSchema = z.object({
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().positive()
  })),
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().min(1, "Phone is required"),
  total: z.number().positive("Total must be greater than 0"),
  status: z.string().default("pending")
});

export const insertEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  date: z.string().transform(str => new Date(str)),
  featured: z.boolean().default(false)
});

export const insertCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().url()
});

export const insertTableAssignmentSchema = z.object({
  tableId: z.number(),
  serverId: z.number(),
  startTime: z.date(),
  endTime: z.date().optional(),
  status: z.string(),
  notes: z.string().optional()
});

export const insertServerSchema = z.object({
  name: z.string(),
  code: z.string(),
  isActive: z.boolean().default(true)
});

export const insertLoyaltyTierSchema = z.object({
  name: z.string(),
  minimumPoints: z.number(),
  pointsMultiplier: z.number(),
  benefits: z.array(z.string())
});

export const insertLoyaltyPointSchema = z.object({
  userId: z.number(),
  points: z.number(),
  description: z.string(),
  orderId: z.number().optional(),
  type: z.string()
});

export const insertLoyaltyRewardSchema = z.object({
  name: z.string(),
  description: z.string(),
  pointsCost: z.number(),
  isActive: z.boolean().default(true)
});

export const insertSiteSettingsSchema = z.object({
  language: z.string(),
  country: z.string(),
  currency: z.string(),
  translations: z.record(z.string(), z.record(z.string(), z.string())),
  privacyPolicy: z.string(),
  cookiePolicy: z.string(),
  termsConditions: z.string()
});

// Insert Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertTable = z.infer<typeof insertTableSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertTableAssignment = z.infer<typeof insertTableAssignmentSchema>;
export type InsertServer = z.infer<typeof insertServerSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertLoyaltyTier = z.infer<typeof insertLoyaltyTierSchema>;
export type InsertLoyaltyPoint = z.infer<typeof insertLoyaltyPointSchema>;
export type InsertLoyaltyReward = z.infer<typeof insertLoyaltyRewardSchema>;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;