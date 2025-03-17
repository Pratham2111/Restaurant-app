import {
  type Category, type MenuItem, type Table, type Booking, type Order,
  type TableAssignment, type Server, type User,
  type InsertCategory, type InsertMenuItem, type InsertTable, type InsertBooking,
  type InsertOrder, type InsertTableAssignment, type InsertServer, type InsertUser,
  type Event, type InsertEvent
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;

  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, "confirmPassword">): Promise<User>;

  // Tables
  getTables(): Promise<Table[]>;
  getTableById(id: number): Promise<Table | undefined>;
  getTablesBySection(section: string): Promise<Table[]>;
  getTablesByStatus(status: string): Promise<Table[]>;
  updateTableStatus(id: number, status: string): Promise<Table>;
  createTable(table: InsertTable): Promise<Table>;
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
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private menuItems: Map<number, MenuItem>;
  private tables: Map<number, Table>;
  private servers: Map<number, Server>;
  private tableAssignments: Map<number, TableAssignment>;
  private bookings: Map<number, Booking>;
  private orders: Map<number, Order>;
  private users: Map<number, User>;
  private events: Map<number, Event>;

  private currentIds: {
    category: number;
    menuItem: number;
    table: number;
    server: number;
    tableAssignment: number;
    booking: number;
    order: number;
    user: number;
    event: number;
  };

  constructor() {
    this.categories = new Map();
    this.menuItems = new Map();
    this.tables = new Map();
    this.servers = new Map();
    this.tableAssignments = new Map();
    this.bookings = new Map();
    this.orders = new Map();
    this.users = new Map();
    this.events = new Map();

    this.currentIds = {
      category: 1,
      menuItem: 1,
      table: 1,
      server: 1,
      tableAssignment: 1,
      booking: 1,
      order: 1,
      user: 1,
      event: 1
    };

    this.initSampleData();
  }

  // User Management Methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(userData: Omit<InsertUser, "confirmPassword">): Promise<User> {
    const id = this.currentIds.user++;
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      item => item.categoryId === categoryId
    );
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentIds.menuItem++;
    const newItem = { ...item, id };
    this.menuItems.set(id, newItem);
    return newItem;
  }

  async getTables(): Promise<Table[]> {
    return Array.from(this.tables.values());
  }

  async getTableById(id: number): Promise<Table | undefined> {
    return this.tables.get(id);
  }

  async getTablesBySection(section: string): Promise<Table[]> {
    return Array.from(this.tables.values()).filter(
      table => table.section === section
    );
  }

  async getTablesByStatus(status: string): Promise<Table[]> {
    return Array.from(this.tables.values()).filter(
      table => table.status === status
    );
  }

  async updateTableStatus(id: number, status: string): Promise<Table> {
    const table = this.tables.get(id);
    if (!table) throw new Error("Table not found");

    const updatedTable = { ...table, status };
    this.tables.set(id, updatedTable);
    return updatedTable;
  }

  async createTable(table: InsertTable): Promise<Table> {
    const id = this.currentIds.table++;
    const newTable = { ...table, id };
    this.tables.set(id, newTable);
    return newTable;
  }

  async getAvailableTables(date: Date): Promise<Table[]> {
    const bookings = Array.from(this.bookings.values()).filter(
      booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.toDateString() === date.toDateString();
      }
    );

    const bookedTableIds = new Set(bookings.map(b => b.tableId));
    return Array.from(this.tables.values()).filter(
      table => !bookedTableIds.has(table.id)
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentIds.booking++;
    const newBooking = { ...booking, id };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentIds.order++;
    const newOrder = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getServers(): Promise<Server[]> {
    return Array.from(this.servers.values());
  }

  async getActiveServers(): Promise<Server[]> {
    return Array.from(this.servers.values()).filter(
      server => server.isActive
    );
  }

  async createServer(server: InsertServer): Promise<Server> {
    const id = this.currentIds.server++;
    const newServer = { ...server, id };
    this.servers.set(id, newServer);
    return newServer;
  }

  async getTableAssignments(status?: string): Promise<TableAssignment[]> {
    const assignments = Array.from(this.tableAssignments.values());
    return status
      ? assignments.filter(assignment => assignment.status === status)
      : assignments;
  }

  async createTableAssignment(assignment: InsertTableAssignment): Promise<TableAssignment> {
    const id = this.currentIds.tableAssignment++;
    const newAssignment = { ...assignment, id };
    this.tableAssignments.set(id, newAssignment);
    return newAssignment;
  }

  async updateTableAssignment(id: number, endTime: Date): Promise<TableAssignment> {
    const assignment = this.tableAssignments.get(id);
    if (!assignment) throw new Error("Assignment not found");

    const updatedAssignment = { ...assignment, endTime, status: 'completed' };
    this.tableAssignments.set(id, updatedAssignment);
    return updatedAssignment;
  }

  async getActiveAssignmentsByServer(serverId: number): Promise<TableAssignment[]> {
    return Array.from(this.tableAssignments.values()).filter(
      assignment => assignment.serverId === serverId && assignment.status === 'active'
    );
  }


  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentIds.event++;
    const now = new Date();
    const newEvent = {
      ...event,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.events.set(id, newEvent);
    return newEvent;
  }

  private initSampleData() {
    const categories: InsertCategory[] = [
      {
        name: "Appetizers",
        description: "Start your meal with our delicious appetizers",
        imageUrl: "https://images.unsplash.com/photo-1599250300435-b9693f21830d"
      },
      {
        name: "Main Course",
        description: "Exquisite main dishes prepared by our master chefs",
        imageUrl: "https://images.unsplash.com/photo-1556742205-e10c9486e506"
      },
      {
        name: "Desserts",
        description: "Sweet endings to your perfect meal",
        imageUrl: "https://images.unsplash.com/photo-1498669374702-58e97ebbede3"
      },
      {
        name: "Beverages",
        description: "Refreshing drinks and fine wines",
        imageUrl: "https://images.unsplash.com/photo-1731412235213-678ada5cd36b"
      }
    ];

    categories.forEach(category => {
      const id = this.currentIds.category++;
      this.categories.set(id, { ...category, id });
    });

    const menuItems: InsertMenuItem[] = [
      {
        categoryId: 1,
        name: "Bruschetta",
        description: "Grilled bread rubbed with garlic and topped with tomatoes",
        price: "8.99",
        imageUrl: "https://images.unsplash.com/photo-1565895405137-3ca0cc5088c8"
      },
      {
        categoryId: 2,
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon with herbs and lemon",
        price: "24.99",
        imageUrl: "https://images.unsplash.com/photo-1564486054184-1c26aa52b1c3"
      }
    ];

    menuItems.forEach(item => {
      const id = this.currentIds.menuItem++;
      this.menuItems.set(id, { ...item, id });
    });

    const tables: InsertTable[] = [
      {
        name: "Table 1",
        section: "main",
        seats: 2,
        shape: "round",
        status: "available",
        isActive: true,
        minimumSpend: "0",
        notes: "Near window"
      },
      {
        name: "Table 2",
        section: "main",
        seats: 4,
        shape: "square",
        status: "available",
        isActive: true,
        minimumSpend: "0",
        notes: "Center area"
      },
      {
        name: "Table 3",
        section: "outdoor",
        seats: 6,
        shape: "rectangular",
        status: "available",
        isActive: true,
        minimumSpend: "0",
        notes: "Patio seating"
      }
    ];

    tables.forEach(table => {
      const id = this.currentIds.table++;
      this.tables.set(id, { ...table, id });
    });

    const servers: InsertServer[] = [
      { name: "John Smith", code: "JS001", isActive: true },
      { name: "Sarah Johnson", code: "SJ002", isActive: true }
    ];

    servers.forEach(server => {
      const id = this.currentIds.server++;
      this.servers.set(id, { ...server, id });
    });

    const sampleEvents = [
      {
        title: "Wine Tasting Evening",
        description: "Join us for an evening of fine wine tasting paired with exquisite appetizers",
        imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
        date: new Date("2025-04-15"),
        featured: true
      },
      {
        title: "Chef's Special Dinner",
        description: "Experience a unique 5-course meal prepared by our master chef",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
        date: new Date("2025-04-20"),
        featured: false
      }
    ];

    sampleEvents.forEach(event => {
      const id = this.currentIds.event++;
      const now = new Date();
      this.events.set(id, {
        ...event,
        id,
        createdAt: now,
        updatedAt: now
      });
    });
  }
}

export const storage = new MemStorage();