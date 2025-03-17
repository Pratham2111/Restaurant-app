import {
  type Category, type MenuItem, type Table, type Booking, type Order,
  type TableAssignment, type Server, type User,
  type InsertCategory, type InsertMenuItem, type InsertTable, type InsertBooking,
  type InsertOrder, type InsertTableAssignment, type InsertServer, type InsertUser,
  type Event, type InsertEvent, type LoyaltyTier, type LoyaltyPoint, type LoyaltyReward,
  type InsertLoyaltyTier, type InsertLoyaltyPoint, type InsertLoyaltyReward
} from "@shared/schema";

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
  private loyaltyTiers: Map<number, LoyaltyTier>;
  private loyaltyPoints: Map<number, LoyaltyPoint>;
  private loyaltyRewards: Map<number, LoyaltyReward>;

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
    loyaltyTier: number;
    loyaltyPoint: number;
    loyaltyReward: number;
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
    this.loyaltyTiers = new Map();
    this.loyaltyPoints = new Map();
    this.loyaltyRewards = new Map();

    this.currentIds = {
      category: 1,
      menuItem: 1,
      table: 1,
      server: 1,
      tableAssignment: 1,
      booking: 1,
      order: 1,
      user: 1,
      event: 1,
      loyaltyTier: 1,
      loyaltyPoint: 1,
      loyaltyReward: 1
    };

    // Initialize dummy users
    const dummyUsers = [
      {
        id: this.currentIds.user++,
        name: "Admin User",
        email: "admin@lamaison.com",
        // Password: admin123
        password: "$2a$10$iEPj0lqpHkFgZPGxymYCqOgUk3XFxh1bVmG5XSIoQOvBZHdYT6kPi",
        totalPoints: 0,
        currentTierId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "admin"
      },
      {
        id: this.currentIds.user++,
        name: "John Customer",
        email: "customer@example.com",
        // Password: customer123
        password: "$2a$10$YRbjR7ckuygc0XS0a.C4JeYGU.UWyCIV7djPF5N8FYr5ZOLEPVz2O",
        totalPoints: 100,
        currentTierId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "customer"
      }
    ];

    dummyUsers.forEach(user => {
      this.users.set(user.id, user);
    });

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

  async updateMenuItem(id: number, item: InsertMenuItem): Promise<MenuItem> {
    const existingItem = this.menuItems.get(id);
    if (!existingItem) {
      throw new Error("Menu item not found");
    }

    const updatedItem = { ...existingItem, ...item, id };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<void> {
    if (!this.menuItems.has(id)) {
      throw new Error("Menu item not found");
    }
    this.menuItems.delete(id);
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

  async updateTable(id: number, tableData: InsertTable): Promise<Table> {
    const existingTable = this.tables.get(id);
    if (!existingTable) {
      throw new Error("Table not found");
    }

    const updatedTable = { ...existingTable, ...tableData, id };
    this.tables.set(id, updatedTable);
    return updatedTable;
  }

  async deleteTable(id: number): Promise<void> {
    if (!this.tables.has(id)) {
      throw new Error("Table not found");
    }
    this.tables.delete(id);
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

  async updateEvent(id: number, event: InsertEvent): Promise<Event> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) {
      throw new Error("Event not found");
    }

    const now = new Date();
    const updatedEvent = {
      ...existingEvent,
      ...event,
      id,
      updatedAt: now
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    if (!this.events.has(id)) {
      throw new Error("Event not found");
    }
    this.events.delete(id);
  }

  // Implement Loyalty Program Methods
  async getLoyaltyTiers(): Promise<LoyaltyTier[]> {
    return Array.from(this.loyaltyTiers.values());
  }

  async getLoyaltyTierById(id: number): Promise<LoyaltyTier | undefined> {
    return this.loyaltyTiers.get(id);
  }

  async createLoyaltyTier(tier: InsertLoyaltyTier): Promise<LoyaltyTier> {
    const id = this.currentIds.loyaltyTier++;
    const now = new Date();
    const newTier = {
      ...tier,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.loyaltyTiers.set(id, newTier);
    return newTier;
  }

  async getLoyaltyPoints(userId: number): Promise<LoyaltyPoint[]> {
    return Array.from(this.loyaltyPoints.values())
      .filter(point => point.userId === userId);
  }

  async addLoyaltyPoints(point: InsertLoyaltyPoint): Promise<LoyaltyPoint> {
    const id = this.currentIds.loyaltyPoint++;
    const newPoint = {
      ...point,
      id,
      createdAt: new Date()
    };
    this.loyaltyPoints.set(id, newPoint);
    return newPoint;
  }

  async getLoyaltyRewards(): Promise<LoyaltyReward[]> {
    return Array.from(this.loyaltyRewards.values());
  }

  async getLoyaltyRewardById(id: number): Promise<LoyaltyReward | undefined> {
    return this.loyaltyRewards.get(id);
  }

  async createLoyaltyReward(reward: InsertLoyaltyReward): Promise<LoyaltyReward> {
    const id = this.currentIds.loyaltyReward++;
    const now = new Date();
    const newReward = {
      ...reward,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.loyaltyRewards.set(id, newReward);
    return newReward;
  }

  async updateUserPoints(userId: number, pointsToAdd: number): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      totalPoints: user.totalPoints + pointsToAdd,
      updatedAt: new Date()
    };
    this.users.set(userId, updatedUser);

    // Check and update tier if necessary
    const tiers = await this.getLoyaltyTiers();
    const eligibleTier = tiers
      .filter(tier => tier.minimumPoints <= updatedUser.totalPoints)
      .sort((a, b) => b.minimumPoints - a.minimumPoints)[0];

    if (eligibleTier && eligibleTier.id !== user.currentTierId) {
      return this.updateUserTier(userId, eligibleTier.id);
    }

    return updatedUser;
  }

  async updateUserTier(userId: number, tierId: number): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      currentTierId: tierId,
      updatedAt: new Date()
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
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
        imageUrl: "https://images.unsplash.com/photo-1565895405137-3ca0cc5088c8",
        isSpecial: true,
        nutritionInfo: [
          "Calories: 220 kcal",
          "Protein: 5g",
          "Carbohydrates: 25g",
          "Fat: 12g",
          "Fiber: 3g"
        ],
        ingredients: [
          "Fresh crusty bread",
          "Ripe tomatoes",
          "Fresh basil",
          "Extra virgin olive oil",
          "Garlic cloves",
          "Sea salt",
          "Black pepper"
        ],
        chefsStory: "This classic Bruschetta recipe was inspired by my summers in Tuscany. Every morning, I would visit the local markets to select the ripest tomatoes and freshest basil. The key to perfect bruschetta lies in the quality of the bread and the tomatoes - each ingredient tells its own story of the Italian countryside.",
        preparationTime: "15-20 minutes",
        spicyLevel: "Not Spicy",
        allergens: ["Wheat", "Gluten"],
        servingSize: "3-4 pieces per serving"
      },
      {
        categoryId: 2,
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon with herbs and lemon",
        price: "24.99",
        imageUrl: "https://images.unsplash.com/photo-1564486054184-1c26aa52b1c3",
        isSpecial: true,
        nutritionInfo: [
          "Calories: 450 kcal",
          "Protein: 46g",
          "Omega-3: 4.4g",
          "Fat: 28g",
          "Vitamin D: 100% DV"
        ],
        ingredients: [
          "Fresh Atlantic salmon",
          "Fresh dill",
          "Lemon",
          "Garlic",
          "Olive oil",
          "Sea salt",
          "Black pepper",
          "Fresh herbs"
        ],
        chefsStory: "During my time in Norway, I learned the art of preparing salmon from local fishermen. This recipe combines traditional Nordic techniques with modern flavors. We source our salmon from sustainable fisheries, ensuring each fillet tells a story of both flavor and responsibility.",
        preparationTime: "25-30 minutes",
        spicyLevel: "Not Spicy",
        allergens: ["Fish"],
        servingSize: "1 6oz fillet per serving"
      },
      {
        categoryId: 2,
        name: "Wagyu Steak",
        description: "Premium Japanese Wagyu beef with truffle sauce",
        price: "89.99",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947",
        isSpecial: true,
        nutritionInfo: [
          "Calories: 650 kcal",
          "Protein: 48g",
          "Fat: 52g",
          "Iron: 35% DV",
          "Zinc: 50% DV"
        ],
        ingredients: [
          "A5 Wagyu beef",
          "Black truffle",
          "Garlic",
          "Thyme",
          "Rosemary",
          "Butter",
          "Sea salt",
          "Black pepper"
        ],
        chefsStory: "My journey to master Wagyu preparation took me to the heart of Japan, where I trained under Master Chef Tanaka. He taught me that preparing Wagyu is not just cooking - it's an art form that requires patience, respect for the ingredient, and precision. Each steak is carefully selected and aged to perfection.",
        preparationTime: "35-40 minutes",
        spicyLevel: "Not Spicy",
        allergens: ["Dairy"],
        servingSize: "8oz per serving"
      },
      {
        categoryId: 3,
        name: "Chocolate Soufflé",
        description: "Warm chocolate soufflé with vanilla ice cream",
        price: "12.99",
        imageUrl: "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e",
        isSpecial: true,
        nutritionInfo: [
          "Calories: 380 kcal",
          "Protein: 8g",
          "Carbohydrates: 45g",
          "Fat: 22g",
          "Iron: 15% DV"
        ],
        ingredients: [
          "Dark chocolate (70% cocoa)",
          "Fresh eggs",
          "Butter",
          "Sugar",
          "Vanilla extract",
          "Flour",
          "Cocoa powder",
          "Salt"
        ],
        chefsStory: "This soufflé recipe is the result of years of perfecting the technique in Paris. I learned the secrets of the perfect rise from a 3-star Michelin pastry chef. The key lies in the quality of the chocolate and the precise timing - each soufflé is made to order, ensuring a perfect, warm center that flows like liquid gold.",
        preparationTime: "20-25 minutes",
        spicyLevel: "Not Spicy",
        allergens: ["Eggs", "Dairy", "Gluten"],
        servingSize: "1 soufflé per person"
      },
      {
        categoryId: 2,
        name: "Lobster Thermidor",
        description: "Classic French dish with lobster in rich cream sauce",
        price: "59.99",
        imageUrl: "https://images.unsplash.com/photo-1533422902779-aff35862e462",
        isSpecial: true,
        nutritionInfo: [
          "Calories: 520 kcal",
          "Protein: 42g",
          "Fat: 35g",
          "Calcium: 25% DV",
          "Vitamin B12: 80% DV"
        ],
        ingredients: [
          "Fresh whole lobster",
          "Heavy cream",
          "Gruyère cheese",
          "Mushrooms",
          "Shallots",
          "Brandy",
          "Dijon mustard",
          "Fresh tarragon"
        ],
        chefsStory: "I mastered this classic French dish during my tenure at a historic Parisian restaurant. The recipe dates back to the 19th century, and we maintain its authentic preparation while adding our own modern twist. Each lobster is carefully selected from local fishermen who we've worked with for generations.",
        preparationTime: "45-50 minutes",
        spicyLevel: "Not Spicy",
        allergens: ["Shellfish", "Dairy", "Alcohol"],
        servingSize: "1 whole lobster per serving"
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

    // Initialize sample loyalty tiers
    const loyaltyTiers = [
      {
        name: "Bronze",
        minimumPoints: 0,
        pointsMultiplier: "1.0",
        benefits: ["Earn 1 point per dollar spent"],
      },
      {
        name: "Silver",
        minimumPoints: 1000,
        pointsMultiplier: "1.2",
        benefits: ["Earn 1.2 points per dollar spent", "Free dessert on your birthday"],
      },
      {
        name: "Gold",
        minimumPoints: 5000,
        pointsMultiplier: "1.5",
        benefits: [
          "Earn 1.5 points per dollar spent",
          "Free dessert on your birthday",
          "Priority reservations",
          "Exclusive monthly rewards"
        ],
      }
    ];

    loyaltyTiers.forEach(tier => {
      const id = this.currentIds.loyaltyTier++;
      const now = new Date();
      this.loyaltyTiers.set(id, {
        ...tier,
        id,
        createdAt: now,
        updatedAt: now
      });
    });

    // Initialize sample loyalty rewards
    const loyaltyRewards = [
      {
        name: "Free Appetizer",
        description: "Redeem points for a free appetizer of your choice",
        pointsCost: 500,
        isActive: true
      },
      {
        name: "Complimentary Dessert",
        description: "Enjoy a dessert on us",
        pointsCost: 300,
        isActive: true
      },
      {
        name: "VIP Table Reservation",
        description: "Skip the line with priority seating",
        pointsCost: 1000,
        isActive: true
      }
    ];

    loyaltyRewards.forEach(reward => {
      const id = this.currentIds.loyaltyReward++;
      const now = new Date();
      this.loyaltyRewards.set(id, {
        ...reward,
        id,
        createdAt: now,
        updatedAt: now
      });
    });
  }
}

export const storage = new MemStorage();