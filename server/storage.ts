import {
  type Category, type MenuItem, type Table, type Booking, type Order,
  type TableAssignment, type Server, type User,
  type InsertCategory, type InsertMenuItem, type InsertTable, type InsertBooking,
  type InsertOrder, type InsertTableAssignment, type InsertServer, type InsertUser,
  type Event, type InsertEvent, type LoyaltyTier, type LoyaltyPoint, type LoyaltyReward,
  type InsertLoyaltyTier, type InsertLoyaltyPoint, type InsertLoyaltyReward,
  users, menuItems, menuCategories, tables, events, servers, tableAssignments,
  loyaltyTiers, loyaltyPoints, loyaltyRewards, bookings, siteSettings, type SiteSettings, type InsertSiteSettings,
  orders
} from "@shared/schema";
import { db } from "./db";
import { eq, and, isNull } from "drizzle-orm";

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
  getOrders(): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order>;

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

  //Site Settings
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;
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
  async getTables(): Promise<Table[]> {
    return db.select().from(tables);
  }

  async getTableById(id: number): Promise<Table | undefined> {
    const [table] = await db.select()
      .from(tables)
      .where(eq(tables.id, id));
    return table;
  }

  async getTablesBySection(section: string): Promise<Table[]> {
    return db.select()
      .from(tables)
      .where(eq(tables.section, section));
  }

  async getTablesByStatus(status: string): Promise<Table[]> {
    return db.select()
      .from(tables)
      .where(eq(tables.status, status));
  }

  async updateTableStatus(id: number, status: string): Promise<Table> {
    const [updatedTable] = await db
      .update(tables)
      .set({ status })
      .where(eq(tables.id, id))
      .returning();
    return updatedTable;
  }

  async createTable(table: InsertTable): Promise<Table> {
    const [newTable] = await db.insert(tables).values(table).returning();
    return newTable;
  }

  async updateTable(id: number, table: InsertTable): Promise<Table> {
    const [updatedTable] = await db
      .update(tables)
      .set(table)
      .where(eq(tables.id, id))
      .returning();
    return updatedTable;
  }

  async deleteTable(id: number): Promise<void> {
    await db.delete(tables).where(eq(tables.id, id));
  }

  async getAvailableTables(date: Date): Promise<Table[]> {
    return db.select()
      .from(tables)
      .where(eq(tables.status, 'available'))
      .where(eq(tables.isActive, true));
  }

  async getEvents(): Promise<Event[]> {
    return db.select().from(events);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, event: InsertEvent): Promise<Event> {
    const [updatedEvent] = await db
      .update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    try {
      const [newBooking] = await db
        .insert(bookings)
        .values({
          tableId: booking.tableId,
          date: booking.date,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          guestCount: booking.guestCount
        })
        .returning();
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  }
  async getBookings(): Promise<Booking[]> {
    return db.select().from(bookings);
  }
  async createOrder(order: InsertOrder): Promise<Order> {
    try {
      // Convert order.items to an array if it's not already
      const itemsArray = Array.isArray(order.items) ? order.items : [];

      const orderData = {
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        items: itemsArray, // Store directly as array since column type is ARRAY
        total: order.total.toString(), // Convert to string for numeric type
        status: 'pending',
        createdAt: new Date()
      };

      const [newOrder] = await db.insert(orders).values(orderData).returning();

      // Return the order with properly typed items array
      return {
        ...newOrder,
        items: Array.isArray(newOrder.items) ? newOrder.items : []
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async getOrder(id: number): Promise<Order | undefined> {
    try {
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) return undefined;

      return {
        ...order,
        items: Array.isArray(order.items) ? order.items : []
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const ordersList = await db.select().from(orders);
      return ordersList.map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : []
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    try {
      const [updatedOrder] = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, id))
        .returning();

      return {
        ...updatedOrder,
        items: Array.isArray(updatedOrder.items) ? updatedOrder.items : []
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  async getServers(): Promise<Server[]> {
    return db.select().from(servers);
  }

  async getActiveServers(): Promise<Server[]> {
    return db.select()
      .from(servers)
      .where(eq(servers.isActive, true));
  }

  async createServer(server: InsertServer): Promise<Server> {
    const [newServer] = await db.insert(servers).values(server).returning();
    return newServer;
  }

  async getTableAssignments(status?: string): Promise<TableAssignment[]> {
    let query = db.select().from(tableAssignments);
    if (status) {
      query = query.where(eq(tableAssignments.status, status));
    }
    return query;
  }

  async createTableAssignment(assignment: InsertTableAssignment): Promise<TableAssignment> {
    const [newAssignment] = await db.insert(tableAssignments).values(assignment).returning();
    return newAssignment;
  }

  async updateTableAssignment(id: number, endTime: Date): Promise<TableAssignment> {
    const [updatedAssignment] = await db
      .update(tableAssignments)
      .set({
        endTime,
        status: 'completed'
      })
      .where(eq(tableAssignments.id, id))
      .returning();
    return updatedAssignment;
  }

  async getActiveAssignmentsByServer(serverId: number): Promise<TableAssignment[]> {
    return db.select()
      .from(tableAssignments)
      .where(
        and(
          eq(tableAssignments.serverId, serverId),
          eq(tableAssignments.status, 'active'),
          isNull(tableAssignments.endTime)
        )
      );
  }

  async getLoyaltyTiers(): Promise<LoyaltyTier[]> {
    return db.select().from(loyaltyTiers);
  }

  async getLoyaltyTierById(id: number): Promise<LoyaltyTier | undefined> {
    const [tier] = await db.select()
      .from(loyaltyTiers)
      .where(eq(loyaltyTiers.id, id));
    return tier;
  }

  async createLoyaltyTier(tier: InsertLoyaltyTier): Promise<LoyaltyTier> {
    const [newTier] = await db.insert(loyaltyTiers).values(tier).returning();
    return newTier;
  }

  async getLoyaltyPoints(userId: number): Promise<LoyaltyPoint[]> {
    return db.select()
      .from(loyaltyPoints)
      .where(eq(loyaltyPoints.userId, userId));
  }

  async addLoyaltyPoints(point: InsertLoyaltyPoint): Promise<LoyaltyPoint> {
    const [newPoint] = await db.insert(loyaltyPoints).values(point).returning();
    return newPoint;
  }

  async getLoyaltyRewards(): Promise<LoyaltyReward[]> {
    return db.select().from(loyaltyRewards);
  }

  async getLoyaltyRewardById(id: number): Promise<LoyaltyReward | undefined> {
    const [reward] = await db.select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.id, id));
    return reward;
  }

  async createLoyaltyReward(reward: InsertLoyaltyReward): Promise<LoyaltyReward> {
    const [newReward] = await db.insert(loyaltyRewards).values(reward).returning();
    return newReward;
  }

  async updateUserPoints(userId: number, pointsToAdd: number): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        totalPoints: user.totalPoints + pointsToAdd,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  async updateUserTier(userId: number, tierId: number): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        currentTierId: tierId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const [settings] = await db.select().from(siteSettings);
      if (!settings) {
        // Return default settings if none exist
        return {
          id: 1,
          language: "en",
          country: "US",
          currency: "USD",
          translations: {},
          privacyPolicy: "",
          cookiePolicy: "",
          termsConditions: "",
          updatedAt: new Date()
        };
      }
      return settings;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      throw new Error('Failed to fetch site settings');
    }
  }

  async updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    try {
      const [existingSettings] = await db.select().from(siteSettings);

      if (existingSettings) {
        // Update existing settings
        const [updatedSettings] = await db
          .update(siteSettings)
          .set({
            ...settings,
            updatedAt: new Date()
          })
          .where(eq(siteSettings.id, existingSettings.id))
          .returning();
        return updatedSettings;
      } else {
        // Create new settings
        const [newSettings] = await db
          .insert(siteSettings)
          .values({
            ...settings,
            id: 1,
            updatedAt: new Date()
          })
          .returning();
        return newSettings;
      }
    } catch (error) {
      console.error('Error updating site settings:', error);
      throw new Error('Failed to update site settings');
    }
  }
}

export const storage = new DatabaseStorage();