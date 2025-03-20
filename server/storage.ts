import { promises as fs } from 'fs';
import { join } from 'path';
import {
  type Category, type MenuItem, type Table, type Booking, type Order,
  type TableAssignment, type Server, type User,
  type InsertCategory, type InsertMenuItem, type InsertTable, type InsertBooking,
  type InsertOrder, type InsertTableAssignment, type InsertServer, type InsertUser,
  type Event, type InsertEvent, type LoyaltyTier, type LoyaltyPoint, type LoyaltyReward,
  type InsertLoyaltyTier, type InsertLoyaltyPoint, type InsertLoyaltyReward,
  type SiteSettings, type InsertSiteSettings,
} from "@shared/schema";

/**
 * IStorage defines the interface for data persistence.
 * This implementation uses in-memory storage with JSON file persistence
 * for development and testing purposes.
 */
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
  updateUserPassword(id: number, hashedPassword: string): Promise<User>; // Added method

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

const DATA_DIR = join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Generic function to read JSON file
async function readJsonFile<T>(filename: string): Promise<T[]> {
  try {
    const filepath = join(DATA_DIR, filename);
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Generic function to write JSON file
async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  try {
    const filepath = join(DATA_DIR, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    throw error;
  }
}

/**
 * In-memory storage implementation that persists data to JSON files.
 * This implementation is designed for development and testing.
 */
export class MemStorage implements IStorage {
  private users: User[] = [];
  private menuItems: MenuItem[] = [];
  private categories: Category[] = [];
  private tables: Table[] = [];
  private bookings: Booking[] = [];
  private orders: Order[] = [];
  private servers: Server[] = [];
  private tableAssignments: TableAssignment[] = [];
  private events: Event[] = [];
  private loyaltyTiers: LoyaltyTier[] = [];
  private loyaltyPoints: LoyaltyPoint[] = [];
  private loyaltyRewards: LoyaltyReward[] = [];
  private settings: SiteSettings | null = null;

  constructor() {
    this.loadData();
  }

  private async loadData() {
    await ensureDataDir();
    this.users = await readJsonFile<User>('users.json');
    this.menuItems = await readJsonFile<MenuItem>('menu-items.json');
    this.categories = await readJsonFile<Category>('categories.json');
    this.tables = await readJsonFile<Table>('tables.json');
    this.bookings = await readJsonFile<Booking>('bookings.json');
    this.orders = await readJsonFile<Order>('orders.json');
    this.servers = await readJsonFile<Server>('servers.json');
    this.tableAssignments = await readJsonFile<TableAssignment>('table-assignments.json');
    this.events = await readJsonFile<Event>('events.json');
    this.loyaltyTiers = await readJsonFile<LoyaltyTier>('loyalty-tiers.json');
    this.loyaltyPoints = await readJsonFile<LoyaltyPoint>('loyalty-points.json');
    this.loyaltyRewards = await readJsonFile<LoyaltyReward>('loyalty-rewards.json');

    const settings = await readJsonFile<SiteSettings>('site-settings.json');
    this.settings = settings[0] || null;
  }

  private async saveData(type: string, data: any[]) {
    await writeJsonFile(`${type}.json`, data);
  }

  // Users
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async createUser(userData: Omit<InsertUser, "confirmPassword">): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      ...userData,
      isActive: true,
      totalPoints: 0,
      currentTierId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    await this.saveData('users', this.users);
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    user.isActive = isActive;
    user.updatedAt = new Date();
    await this.saveData('users', this.users);
    return user;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return this.menuItems;
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return this.menuItems.filter(item => item.categoryId === categoryId);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const newItem: MenuItem = {
      id: this.menuItems.length + 1,
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.menuItems.push(newItem);
    await this.saveData('menu-items', this.menuItems);
    return newItem;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: this.categories.length + 1,
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.categories.push(newCategory);
    await this.saveData('categories', this.categories);
    return newCategory;
  }

  async updateMenuItem(id: number, item: InsertMenuItem): Promise<MenuItem> {
    const index = this.menuItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Menu Item not found');
    this.menuItems[index] = { ...this.menuItems[index], ...item, updatedAt: new Date() };
    await this.saveData('menu-items', this.menuItems);
    return this.menuItems[index];
  }

  async deleteMenuItem(id: number): Promise<void> {
    this.menuItems = this.menuItems.filter(item => item.id !== id);
    await this.saveData('menu-items', this.menuItems);
  }

  async getTables(): Promise<Table[]> {
    return this.tables;
  }

  async getTableById(id: number): Promise<Table | undefined> {
    return this.tables.find(table => table.id === id);
  }

  async getTablesBySection(section: string): Promise<Table[]> {
    return this.tables.filter(table => table.section === section);
  }

  async getTablesByStatus(status: string): Promise<Table[]> {
    return this.tables.filter(table => table.status === status);
  }

  async updateTableStatus(id: number, status: string): Promise<Table> {
    const table = this.tables.find(t => t.id === id);
    if (!table) throw new Error('Table not found');
    table.status = status;
    table.updatedAt = new Date();
    await this.saveData('tables', this.tables);
    return table;
  }

  async createTable(table: InsertTable): Promise<Table> {
    const newTable: Table = {
      id: this.tables.length + 1,
      ...table,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tables.push(newTable);
    await this.saveData('tables', this.tables);
    return newTable;
  }

  async updateTable(id: number, table: InsertTable): Promise<Table> {
    const index = this.tables.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Table not found');
    this.tables[index] = { ...this.tables[index], ...table, updatedAt: new Date() };
    await this.saveData('tables', this.tables);
    return this.tables[index];
  }

  async deleteTable(id: number): Promise<void> {
    this.tables = this.tables.filter(table => table.id !== id);
    await this.saveData('tables', this.tables);
  }

  async getAvailableTables(date: Date): Promise<Table[]> {
    return this.tables.filter(table => table.status === 'available' && table.isActive);
  }

  async getEvents(): Promise<Event[]> {
    return this.events;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const newEvent: Event = {
      id: this.events.length + 1,
      ...event,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.events.push(newEvent);
    await this.saveData('events', this.events);
    return newEvent;
  }

  async updateEvent(id: number, event: InsertEvent): Promise<Event> {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    this.events[index] = { ...this.events[index], ...event, updatedAt: new Date() };
    await this.saveData('events', this.events);
    return this.events[index];
  }

  async deleteEvent(id: number): Promise<void> {
    this.events = this.events.filter(event => event.id !== id);
    await this.saveData('events', this.events);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const newBooking: Booking = {
      id: this.bookings.length + 1,
      ...booking,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookings.push(newBooking);
    await this.saveData('bookings', this.bookings);
    return newBooking;
  }

  async getBookings(): Promise<Booking[]> {
    return this.bookings;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      id: this.orders.length + 1,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items: order.items,
      total: order.total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.push(newOrder);
    await this.saveData('orders', this.orders);
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.find(order => order.id === id);
  }

  async getOrders(): Promise<Order[]> {
    return this.orders;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.updatedAt = new Date();
    await this.saveData('orders', this.orders);
    return order;
  }

  async getServers(): Promise<Server[]> {
    return this.servers;
  }

  async getActiveServers(): Promise<Server[]> {
    return this.servers.filter(server => server.isActive);
  }

  async createServer(server: InsertServer): Promise<Server> {
    const newServer: Server = {
      id: this.servers.length + 1,
      ...server,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.servers.push(newServer);
    await this.saveData('servers', this.servers);
    return newServer;
  }

  async getTableAssignments(status?: string): Promise<TableAssignment[]> {
    if (status) {
      return this.tableAssignments.filter(assignment => assignment.status === status);
    }
    return this.tableAssignments;
  }

  async createTableAssignment(assignment: InsertTableAssignment): Promise<TableAssignment> {
    const newAssignment: TableAssignment = {
      id: this.tableAssignments.length + 1,
      ...assignment,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tableAssignments.push(newAssignment);
    await this.saveData('table-assignments', this.tableAssignments);
    return newAssignment;
  }

  async updateTableAssignment(id: number, endTime: Date): Promise<TableAssignment> {
    const assignment = this.tableAssignments.find(a => a.id === id);
    if (!assignment) throw new Error('Table assignment not found');
    assignment.endTime = endTime;
    assignment.status = 'completed';
    assignment.updatedAt = new Date();
    await this.saveData('table-assignments', this.tableAssignments);
    return assignment;
  }

  async getActiveAssignmentsByServer(serverId: number): Promise<TableAssignment[]> {
    return this.tableAssignments.filter(assignment =>
      assignment.serverId === serverId && assignment.status === 'active' && !assignment.endTime
    );
  }

  async getLoyaltyTiers(): Promise<LoyaltyTier[]> {
    return this.loyaltyTiers;
  }

  async getLoyaltyTierById(id: number): Promise<LoyaltyTier | undefined> {
    return this.loyaltyTiers.find(tier => tier.id === id);
  }

  async createLoyaltyTier(tier: InsertLoyaltyTier): Promise<LoyaltyTier> {
    const newTier: LoyaltyTier = {
      id: this.loyaltyTiers.length + 1,
      ...tier,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.loyaltyTiers.push(newTier);
    await this.saveData('loyalty-tiers', this.loyaltyTiers);
    return newTier;
  }

  async getLoyaltyPoints(userId: number): Promise<LoyaltyPoint[]> {
    return this.loyaltyPoints.filter(point => point.userId === userId);
  }

  async addLoyaltyPoints(point: InsertLoyaltyPoint): Promise<LoyaltyPoint> {
    const newPoint: LoyaltyPoint = {
      id: this.loyaltyPoints.length + 1,
      ...point,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.loyaltyPoints.push(newPoint);
    await this.saveData('loyalty-points', this.loyaltyPoints);
    return newPoint;
  }

  async getLoyaltyRewards(): Promise<LoyaltyReward[]> {
    return this.loyaltyRewards;
  }

  async getLoyaltyRewardById(id: number): Promise<LoyaltyReward | undefined> {
    return this.loyaltyRewards.find(reward => reward.id === id);
  }

  async createLoyaltyReward(reward: InsertLoyaltyReward): Promise<LoyaltyReward> {
    const newReward: LoyaltyReward = {
      id: this.loyaltyRewards.length + 1,
      ...reward,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.loyaltyRewards.push(newReward);
    await this.saveData('loyalty-rewards', this.loyaltyRewards);
    return newReward;
  }

  async updateUserPoints(userId: number, pointsToAdd: number): Promise<User> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.totalPoints += pointsToAdd;
    user.updatedAt = new Date();
    await this.saveData('users', this.users);
    return user;
  }

  async updateUserTier(userId: number, tierId: number): Promise<User> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.currentTierId = tierId;
    user.updatedAt = new Date();
    await this.saveData('users', this.users);
    return user;
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    if (!this.settings) {
      this.settings = {
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
      await this.saveData('site-settings', [this.settings]);
    }
    return this.settings;
  }

  async updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    this.settings = {
      ...settings,
      id: 1,
      updatedAt: new Date()
    };
    await this.saveData('site-settings', [this.settings]);
    return this.settings;
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');

    user.password = hashedPassword;
    user.updatedAt = new Date();
    await this.saveData('users', this.users);
    return user;
  }
}

export const storage = new MemStorage();