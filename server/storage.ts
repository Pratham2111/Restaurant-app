import {
  type Category, type MenuItem, type Table, type Booking, type Order,
  type TableAssignment, type Server, type User,
  type InsertCategory, type InsertMenuItem, type InsertTable, type InsertBooking,
  type InsertOrder, type InsertTableAssignment, type InsertServer, type InsertUser,
  type Event, type InsertEvent, type LoyaltyTier, type LoyaltyPoint, type LoyaltyReward,
  type InsertLoyaltyTier, type InsertLoyaltyPoint, type InsertLoyaltyReward,
  users, menuItems, menuCategories
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: InsertMenuItem): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;

  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, "confirmPassword">): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUserStatus(id: number, isActive: boolean): Promise<User>;

  // Tables
  getTables(): Promise<Table[]>;
  getTableById(id: number): Promise<Table | undefined>;
  getTablesBySection(section: string): Promise<Table[]>;
  getTablesByStatus(status: string): Promise<Table[]>;
  updateTableStatus(id: number, status: string): Promise<Table>;
  createTable(table: InsertTable): Promise<Table>;
  updateTable(id: number, table: InsertTable): Promise<Table>;
  deleteTable(id: number): Promise<void>;
  getAvailableTables(date: Date): Promise<Table[]>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<Booking[]>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;

  // Server Management
  getServers(): Promise<Server[]>;
  getActiveServers(): Promise<Server[]>;
  createServer(server: InsertServer): Promise<Server>;

  // Table Assignment Management
  getTableAssignments(status?: string): Promise<TableAssignment[]>;
  createTableAssignment(assignment: InsertTableAssignment): Promise<TableAssignment>;
  updateTableAssignment(id: number, endTime: Date): Promise<TableAssignment>;
  getActiveAssignmentsByServer(serverId: number): Promise<TableAssignment[]>;

  // Events
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: InsertEvent): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Loyalty Program Methods
  getLoyaltyTiers(): Promise<LoyaltyTier[]>;
  getLoyaltyTierById(id: number): Promise<LoyaltyTier | undefined>;
  createLoyaltyTier(tier: InsertLoyaltyTier): Promise<LoyaltyTier>;

  getLoyaltyPoints(userId: number): Promise<LoyaltyPoint[]>;
  addLoyaltyPoints(point: InsertLoyaltyPoint): Promise<LoyaltyPoint>;

  getLoyaltyRewards(): Promise<LoyaltyReward[]>;
  getLoyaltyRewardById(id: number): Promise<LoyaltyReward | undefined>;
  createLoyaltyReward(reward: InsertLoyaltyReward): Promise<LoyaltyReward>;

  updateUserPoints(userId: number, pointsToAdd: number): Promise<User>;
  updateUserTier(userId: number, tierId: number): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(userData: Omit<InsertUser, "confirmPassword">): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems);
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return db.select()
      .from(menuItems)
      .where(eq(menuItems.categoryId, categoryId));
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(menuCategories);
  }
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db.insert(menuItems).values(item).returning();
    return menuItem;
  }

  async updateMenuItem(id: number, item: InsertMenuItem): Promise<MenuItem> {
    const [updatedItem] = await db
      .update(menuItems)
      .set(item)
      .where(eq(menuItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }
  async getTables(): Promise<Table[]> { throw new Error("Not implemented"); }
  async getTableById(id: number): Promise<Table | undefined> { throw new Error("Not implemented"); }
  async getTablesBySection(section: string): Promise<Table[]> { throw new Error("Not implemented"); }
  async getTablesByStatus(status: string): Promise<Table[]> { throw new Error("Not implemented"); }
  async updateTableStatus(id: number, status: string): Promise<Table> { throw new Error("Not implemented"); }
  async createTable(table: InsertTable): Promise<Table> { throw new Error("Not implemented"); }
  async updateTable(id: number, table: InsertTable): Promise<Table> { throw new Error("Not implemented"); }
  async deleteTable(id: number): Promise<void> { throw new Error("Not implemented"); }
  async getAvailableTables(date: Date): Promise<Table[]> { throw new Error("Not implemented"); }
  async createBooking(booking: InsertBooking): Promise<Booking> { throw new Error("Not implemented"); }
  async getBookings(): Promise<Booking[]> { throw new Error("Not implemented"); }
  async createOrder(order: InsertOrder): Promise<Order> { throw new Error("Not implemented"); }
  async getOrder(id: number): Promise<Order | undefined> { throw new Error("Not implemented"); }
  async getServers(): Promise<Server[]> { throw new Error("Not implemented"); }
  async getActiveServers(): Promise<Server[]> { throw new Error("Not implemented"); }
  async createServer(server: InsertServer): Promise<Server> { throw new Error("Not implemented"); }
  async getTableAssignments(status?: string): Promise<TableAssignment[]> { throw new Error("Not implemented"); }
  async createTableAssignment(assignment: InsertTableAssignment): Promise<TableAssignment> { throw new Error("Not implemented"); }
  async updateTableAssignment(id: number, endTime: Date): Promise<TableAssignment> { throw new Error("Not implemented"); }
  async getActiveAssignmentsByServer(serverId: number): Promise<TableAssignment[]> { throw new Error("Not implemented"); }
  async getEvents(): Promise<Event[]> { throw new Error("Not implemented"); }
  async createEvent(event: InsertEvent): Promise<Event> { throw new Error("Not implemented"); }
  async updateEvent(id: number, event: InsertEvent): Promise<Event> { throw new Error("Not implemented"); }
  async deleteEvent(id: number): Promise<void> { throw new Error("Not implemented"); }
  async getLoyaltyTiers(): Promise<LoyaltyTier[]> { throw new Error("Not implemented"); }
  async getLoyaltyTierById(id: number): Promise<LoyaltyTier | undefined> { throw new Error("Not implemented"); }
  async createLoyaltyTier(tier: InsertLoyaltyTier): Promise<LoyaltyTier> { throw new Error("Not implemented"); }
  async getLoyaltyPoints(userId: number): Promise<LoyaltyPoint[]> { throw new Error("Not implemented"); }
  async addLoyaltyPoints(point: InsertLoyaltyPoint): Promise<LoyaltyPoint> { throw new Error("Not implemented"); }
  async getLoyaltyRewards(): Promise<LoyaltyReward[]> { throw new Error("Not implemented"); }
  async getLoyaltyRewardById(id: number): Promise<LoyaltyReward | undefined> { throw new Error("Not implemented"); }
  async createLoyaltyReward(reward: InsertLoyaltyReward): Promise<LoyaltyReward> { throw new Error("Not implemented"); }
  async updateUserPoints(userId: number, pointsToAdd: number): Promise<User> { throw new Error("Not implemented"); }
  async updateUserTier(userId: number, tierId: number): Promise<User> { throw new Error("Not implemented"); }
}

export const storage = new DatabaseStorage();