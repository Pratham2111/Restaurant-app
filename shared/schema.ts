import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull()
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull()
});

export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  seats: integer("seats").notNull(),
  name: text("name").notNull()
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  tableId: integer("table_id").notNull(),
  date: timestamp("date").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  guestCount: integer("guest_count").notNull()
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  items: text("items").array().notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  createdAt: timestamp("created_at").notNull()
});

export const insertCategorySchema = createInsertSchema(menuCategories);
export const insertMenuItemSchema = createInsertSchema(menuItems);
export const insertTableSchema = createInsertSchema(tables);

export const insertBookingSchema = createInsertSchema(bookings).extend({
  date: z.string().transform(str => new Date(str))
});

export const insertOrderSchema = createInsertSchema(orders).extend({
  items: z.array(z.object({
    id: z.number(),
    quantity: z.number(),
    name: z.string(),
    price: z.number()
  }))
});

export type Category = typeof menuCategories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Table = typeof tables.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Order = typeof orders.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertTable = z.infer<typeof insertTableSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
