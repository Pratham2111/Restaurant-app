import {
  type Category, type MenuItem, type Table, type Booking, type Order,
  type InsertCategory, type InsertMenuItem, type InsertTable, type InsertBooking, type InsertOrder
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  
  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  
  // Tables
  getTables(): Promise<Table[]>;
  getAvailableTables(date: Date): Promise<Table[]>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<Booking[]>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private menuItems: Map<number, MenuItem>;
  private tables: Map<number, Table>;
  private bookings: Map<number, Booking>;
  private orders: Map<number, Order>;
  
  private currentIds: {
    category: number;
    menuItem: number;
    table: number;
    booking: number;
    order: number;
  };

  constructor() {
    this.categories = new Map();
    this.menuItems = new Map();
    this.tables = new Map();
    this.bookings = new Map();
    this.orders = new Map();
    
    this.currentIds = {
      category: 1,
      menuItem: 1,
      table: 1,
      booking: 1,
      order: 1
    };

    // Initialize with sample data
    this.initSampleData();
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

  async getTables(): Promise<Table[]> {
    return Array.from(this.tables.values());
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

  private initSampleData() {
    // Sample Categories
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

    // Sample Menu Items
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
      // Add more items as needed
    ];

    menuItems.forEach(item => {
      const id = this.currentIds.menuItem++;
      this.menuItems.set(id, { ...item, id });
    });

    // Sample Tables
    const tables: InsertTable[] = [
      { name: "Table 1", seats: 2 },
      { name: "Table 2", seats: 4 },
      { name: "Table 3", seats: 6 }
    ];

    tables.forEach(table => {
      const id = this.currentIds.table++;
      this.tables.set(id, { ...table, id });
    });
  }
}

export const storage = new MemStorage();
