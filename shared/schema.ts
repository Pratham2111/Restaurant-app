import { pgTable, text, serial, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
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
  name: text("name").notNull(),
  section: text("section").notNull(),
  seats: integer("seats").notNull(),
  shape: text("shape").notNull(), // 'round', 'square', 'rectangular'
  status: text("status").notNull().default('available'), // 'available', 'occupied', 'reserved', 'maintenance'
  isActive: boolean("is_active").notNull().default(true),
  minimumSpend: decimal("minimum_spend", { precision: 10, scale: 2 }),
  notes: text("notes"),
});

export const tableAssignments = pgTable("table_assignments", {
  id: serial("id").primaryKey(),
  tableId: integer("table_id").notNull(),
  serverId: integer("server_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: text("status").notNull(), // 'active', 'completed', 'cancelled'
  notes: text("notes")
});

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  isActive: boolean("is_active").notNull().default(true)
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
export const insertTableSchema = createInsertSchema(tables).extend({
  section: z.enum(['main', 'outdoor', 'private', 'bar']),
  shape: z.enum(['round', 'square', 'rectangular']),
  status: z.enum(['available', 'occupied', 'reserved', 'maintenance']),
});

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

export const insertTableAssignmentSchema = createInsertSchema(tableAssignments);
export const insertServerSchema = createInsertSchema(servers);

export type Category = typeof menuCategories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Table = typeof tables.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type TableAssignment = typeof tableAssignments.$inferSelect;
export type Server = typeof servers.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertTable = z.infer<typeof insertTableSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertTableAssignment = z.infer<typeof insertTableAssignmentSchema>;
export type InsertServer = z.infer<typeof insertServerSchema>;