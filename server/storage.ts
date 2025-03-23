import {
  Category, InsertCategory, MenuItem, InsertMenuItem,
  Reservation, InsertReservation, ContactMessage, InsertContactMessage,
  Order, InsertOrder, Testimonial, InsertTestimonial,
  CurrencySetting, InsertCurrencySetting, CartItem
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  getFeaturedMenuItems(): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;

  // Reservations
  getReservations(): Promise<Reservation[]>;
  getReservationById(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservationStatus(id: number, status: string): Promise<Reservation | undefined>;

  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Currency Settings
  getCurrencySettings(): Promise<CurrencySetting[]>;
  getDefaultCurrency(): Promise<CurrencySetting | undefined>;
  createCurrencySetting(currencySetting: InsertCurrencySetting): Promise<CurrencySetting>;
  updateDefaultCurrency(id: number): Promise<CurrencySetting | undefined>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private menuItems: Map<number, MenuItem>;
  private reservations: Map<number, Reservation>;
  private contactMessages: Map<number, ContactMessage>;
  private orders: Map<number, Order>;
  private testimonials: Map<number, Testimonial>;
  private currencySettings: Map<number, CurrencySetting>;

  private categoryId: number = 1;
  private menuItemId: number = 1;
  private reservationId: number = 1;
  private contactMessageId: number = 1;
  private orderId: number = 1;
  private testimonialId: number = 1;
  private currencySettingId: number = 1;

  constructor() {
    this.categories = new Map();
    this.menuItems = new Map();
    this.reservations = new Map();
    this.contactMessages = new Map();
    this.orders = new Map();
    this.testimonials = new Map();
    this.currencySettings = new Map();
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add default currencies
    const usd: CurrencySetting = {
      id: this.currencySettingId++,
      code: "USD",
      symbol: "$",
      rate: 1.0,
      isDefault: true
    };
    
    const eur: CurrencySetting = {
      id: this.currencySettingId++,
      code: "EUR",
      symbol: "€",
      rate: 0.93,
      isDefault: false
    };
    
    const gbp: CurrencySetting = {
      id: this.currencySettingId++,
      code: "GBP",
      symbol: "£",
      rate: 0.79,
      isDefault: false
    };
    
    this.currencySettings.set(usd.id, usd);
    this.currencySettings.set(eur.id, eur);
    this.currencySettings.set(gbp.id, gbp);

    // Add categories
    const categories: InsertCategory[] = [
      { name: "Starters", description: "Begin your meal with our delicious appetizers", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
      { name: "Main Courses", description: "Exquisite main dishes prepared by our expert chefs", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
      { name: "Desserts", description: "Sweet treats to complete your dining experience", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
      { name: "Beverages", description: "Refreshing drinks and fine wines", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
    ];
    
    categories.forEach(category => this.createCategory(category));

    // Add menu items
    const menuItems: InsertMenuItem[] = [
      // Starters
      { 
        name: "Bruschetta", 
        description: "Toasted bread topped with fresh tomatoes, basil, and garlic.", 
        price: "12", 
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 1, 
        featured: false 
      },
      { 
        name: "Calamari", 
        description: "Crispy fried calamari served with spicy marinara sauce.", 
        price: "15", 
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 1, 
        featured: false 
      },
      { 
        name: "Mushroom Arancini", 
        description: "Crispy rice balls filled with mushrooms and mozzarella.", 
        price: "14", 
        image: "https://images.unsplash.com/photo-1603903681619-45181ef999de?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 1, 
        featured: false 
      },
      { 
        name: "Caprese Salad", 
        description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze.", 
        price: "13", 
        image: "https://images.unsplash.com/photo-1600326145552-451be41e426c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 1, 
        featured: false 
      },
      
      // Main Courses
      { 
        name: "Herb Roasted Salmon", 
        description: "Fresh Atlantic salmon with a blend of herbs, served with roasted vegetables and lemon butter sauce.", 
        price: "26", 
        image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 2, 
        featured: true 
      },
      { 
        name: "Truffle Risotto", 
        description: "Creamy Arborio rice with wild mushrooms, finished with truffle oil and aged Parmesan.", 
        price: "22", 
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 2, 
        featured: true 
      },
      { 
        name: "Filet Mignon", 
        description: "8oz prime beef tenderloin, grilled to perfection with garlic herb butter and truffle mashed potatoes.", 
        price: "34", 
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 2, 
        featured: true 
      },
      { 
        name: "Pasta Primavera", 
        description: "Fresh seasonal vegetables tossed with linguine in a light cream sauce.", 
        price: "19", 
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 2, 
        featured: false 
      },
      
      // Desserts
      { 
        name: "Chocolate Lava Cake", 
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream.", 
        price: "10", 
        image: "https://images.unsplash.com/photo-1511911063855-9a072c3e25b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 3, 
        featured: false 
      },
      { 
        name: "Tiramisu", 
        description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.", 
        price: "9", 
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 3, 
        featured: false 
      },
      
      // Beverages
      { 
        name: "Craft Cocktails", 
        description: "Handcrafted specialty cocktails made with premium spirits.", 
        price: "12", 
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 4, 
        featured: false 
      },
      { 
        name: "Wine Selection", 
        description: "Curated selection of fine wines by the glass.", 
        price: "14", 
        image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        categoryId: 4, 
        featured: false 
      }
    ];
    
    menuItems.forEach(item => this.createMenuItem(item));

    // Add testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Sarah Johnson",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
        rating: 5,
        comment: "La Mason exceeded all my expectations. The food was phenomenal, service impeccable, and the ambiance created the perfect setting for our anniversary dinner."
      },
      {
        name: "Michael Chen",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        comment: "The truffle risotto is simply divine! Each bite is packed with flavor. I've been to many restaurants, but La Mason truly stands out for their attention to detail."
      },
      {
        name: "Olivia Martinez",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 4.5,
        comment: "I ordered takeout from La Mason and was impressed that the quality remained exceptional. The packaging was elegant and eco-friendly, and the food arrived still perfectly warm."
      }
    ];
    
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.categoryId === categoryId
    );
  }

  async getFeaturedMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.featured
    );
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemId++;
    const newMenuItem: MenuItem = { ...menuItem, id };
    this.menuItems.set(id, newMenuItem);
    return newMenuItem;
  }

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservationById(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = this.reservationId++;
    const newReservation: Reservation = { ...reservation, id, status: "pending" };
    this.reservations.set(id, newReservation);
    return newReservation;
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    
    const updatedReservation: Reservation = { ...reservation, status };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageId++;
    const newContactMessage: ContactMessage = { 
      ...contactMessage, 
      id, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, newContactMessage);
    return newContactMessage;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const newOrder: Order = { 
      ...order, 
      id, 
      status: "pending", 
      createdAt: new Date() 
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const newTestimonial: Testimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  // Currency Settings
  async getCurrencySettings(): Promise<CurrencySetting[]> {
    return Array.from(this.currencySettings.values());
  }

  async getDefaultCurrency(): Promise<CurrencySetting | undefined> {
    return Array.from(this.currencySettings.values()).find(
      (currency) => currency.isDefault
    );
  }

  async createCurrencySetting(currencySetting: InsertCurrencySetting): Promise<CurrencySetting> {
    const id = this.currencySettingId++;
    const newCurrencySetting: CurrencySetting = { ...currencySetting, id };
    this.currencySettings.set(id, newCurrencySetting);
    return newCurrencySetting;
  }

  async updateDefaultCurrency(id: number): Promise<CurrencySetting | undefined> {
    const currency = this.currencySettings.get(id);
    if (!currency) return undefined;
    
    // First unset any existing default
    Array.from(this.currencySettings.values()).forEach(c => {
      if (c.isDefault) {
        const updated = { ...c, isDefault: false };
        this.currencySettings.set(c.id, updated);
      }
    });
    
    // Then set the new default
    const updatedCurrency: CurrencySetting = { ...currency, isDefault: true };
    this.currencySettings.set(id, updatedCurrency);
    return updatedCurrency;
  }
}

export const storage = new MemStorage();
