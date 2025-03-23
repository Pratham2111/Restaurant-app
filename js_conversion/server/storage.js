/**
 * Storage interface and implementation
 */

// Implementation of in-memory storage
class MemStorage {
  constructor() {
    this.categories = new Map();
    this.menuItems = new Map();
    this.reservations = new Map();
    this.contactMessages = new Map();
    this.orders = new Map();
    this.testimonials = new Map();
    this.currencySettings = new Map();
    
    this.categoryId = 1;
    this.menuItemId = 1;
    this.reservationId = 1;
    this.contactMessageId = 1;
    this.orderId = 1;
    this.testimonialId = 1;
    this.currencySettingId = 1;
    
    this.initializeData();
  }
  
  initializeData() {
    // Add some initial categories
    const appetizers = {
      id: this.categoryId++,
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image: null
    };
    this.categories.set(appetizers.id, appetizers);
    
    const mainCourses = {
      id: this.categoryId++,
      name: "Main Courses",
      description: "Exquisite main dishes crafted by our master chefs",
      image: null
    };
    this.categories.set(mainCourses.id, mainCourses);
    
    const desserts = {
      id: this.categoryId++,
      name: "Desserts",
      description: "Sweet endings to a perfect meal",
      image: null
    };
    this.categories.set(desserts.id, desserts);
    
    const beverages = {
      id: this.categoryId++,
      name: "Beverages",
      description: "Refreshing drinks and fine wines",
      image: null
    };
    this.categories.set(beverages.id, beverages);
    
    // Add some initial menu items
    const calamari = {
      id: this.menuItemId++,
      name: "Crispy Calamari",
      categoryId: appetizers.id,
      description: "Lightly fried squid with our signature aioli sauce",
      price: "14.95",
      image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80",
      featured: false
    };
    this.menuItems.set(calamari.id, calamari);
    
    const bruschetta = {
      id: this.menuItemId++,
      name: "Bruschetta",
      categoryId: appetizers.id,
      description: "Grilled bread rubbed with garlic and topped with olive oil, salt, tomato, and herbs",
      price: "10.95",
      image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80",
      featured: true
    };
    this.menuItems.set(bruschetta.id, bruschetta);
    
    const steak = {
      id: this.menuItemId++,
      name: "Ribeye Steak",
      categoryId: mainCourses.id,
      description: "Prime 12oz ribeye cooked to perfection, served with roasted vegetables and chimichurri",
      price: "32.95",
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      featured: true
    };
    this.menuItems.set(steak.id, steak);
    
    const salmon = {
      id: this.menuItemId++,
      name: "Herb Roasted Salmon",
      categoryId: mainCourses.id,
      description: "Atlantic salmon roasted with Mediterranean herbs, served with quinoa pilaf and seasonal vegetables",
      price: "26.95",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      featured: true
    };
    this.menuItems.set(salmon.id, salmon);
    
    const risotto = {
      id: this.menuItemId++,
      name: "Wild Mushroom Risotto",
      categoryId: mainCourses.id,
      description: "Creamy Arborio rice with assorted wild mushrooms, finished with truffle oil and Parmesan",
      price: "22.95",
      image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80",
      featured: false
    };
    this.menuItems.set(risotto.id, risotto);
    
    const tiramisu = {
      id: this.menuItemId++,
      name: "Tiramisu",
      categoryId: desserts.id,
      description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
      price: "9.95",
      image: "https://images.unsplash.com/photo-1542124948-dc391252a940?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80",
      featured: true
    };
    this.menuItems.set(tiramisu.id, tiramisu);
    
    const wine = {
      id: this.menuItemId++,
      name: "House Red Wine",
      categoryId: beverages.id,
      description: "Our specially selected house red wine, served by the glass",
      price: "8.95",
      image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80",
      featured: false
    };
    this.menuItems.set(wine.id, wine);
    
    // Add sample testimonials
    const testimonial1 = {
      id: this.testimonialId++,
      name: "Sarah Johnson",
      rating: 5,
      comment: "The best dining experience I've had in years! The atmosphere was elegant yet cozy, and every dish was a masterpiece. The wild mushroom risotto is to die for!",
      image: "https://randomuser.me/api/portraits/women/42.jpg"
    };
    this.testimonials.set(testimonial1.id, testimonial1);
    
    const testimonial2 = {
      id: this.testimonialId++,
      name: "James Wilson",
      rating: 4,
      comment: "Excellent food and attentive service. The ribeye steak was cooked perfectly to my preference. Will definitely be coming back soon!",
      image: "https://randomuser.me/api/portraits/men/41.jpg"
    };
    this.testimonials.set(testimonial2.id, testimonial2);
    
    const testimonial3 = {
      id: this.testimonialId++,
      name: "Emily Chen",
      rating: 5,
      comment: "I celebrated my anniversary here and it couldn't have been more perfect. The staff went above and beyond to make our night special. The herb roasted salmon was exceptional!",
      image: "https://randomuser.me/api/portraits/women/63.jpg"
    };
    this.testimonials.set(testimonial3.id, testimonial3);
    
    // Add currency settings
    const usd = {
      id: this.currencySettingId++,
      symbol: "$",
      code: "USD",
      rate: 1.0,
      isDefault: true
    };
    this.currencySettings.set(usd.id, usd);
    
    const eur = {
      id: this.currencySettingId++,
      symbol: "€",
      code: "EUR",
      rate: 0.85,
      isDefault: false
    };
    this.currencySettings.set(eur.id, eur);
    
    const gbp = {
      id: this.currencySettingId++,
      symbol: "£",
      code: "GBP",
      rate: 0.75,
      isDefault: false
    };
    this.currencySettings.set(gbp.id, gbp);
  }
  
  // Categories
  async getCategories() {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id) {
    return this.categories.get(id);
  }
  
  async createCategory(category) {
    const id = this.categoryId++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Menu Items
  async getMenuItems() {
    return Array.from(this.menuItems.values());
  }
  
  async getMenuItemById(id) {
    return this.menuItems.get(id);
  }
  
  async getMenuItemsByCategory(categoryId) {
    return Array.from(this.menuItems.values()).filter(item => item.categoryId === categoryId);
  }
  
  async getFeaturedMenuItems() {
    return Array.from(this.menuItems.values()).filter(item => item.featured);
  }
  
  async createMenuItem(menuItem) {
    const id = this.menuItemId++;
    const newMenuItem = { ...menuItem, id };
    this.menuItems.set(id, newMenuItem);
    return newMenuItem;
  }
  
  // Reservations
  async getReservations() {
    return Array.from(this.reservations.values());
  }
  
  async getReservationById(id) {
    return this.reservations.get(id);
  }
  
  async createReservation(reservation) {
    const id = this.reservationId++;
    const newReservation = { ...reservation, id, status: "pending" };
    this.reservations.set(id, newReservation);
    return newReservation;
  }
  
  async updateReservationStatus(id, status) {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    
    const updatedReservation = { ...reservation, status };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }
  
  // Contact Messages
  async getContactMessages() {
    return Array.from(this.contactMessages.values());
  }
  
  async createContactMessage(contactMessage) {
    const id = this.contactMessageId++;
    const newContactMessage = { 
      ...contactMessage, 
      id, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, newContactMessage);
    return newContactMessage;
  }
  
  // Orders
  async getOrders() {
    return Array.from(this.orders.values());
  }
  
  async getOrderById(id) {
    return this.orders.get(id);
  }
  
  async createOrder(order) {
    const id = this.orderId++;
    const newOrder = { 
      ...order, 
      id, 
      status: "pending", 
      createdAt: new Date() 
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Testimonials
  async getTestimonials() {
    return Array.from(this.testimonials.values());
  }
  
  async createTestimonial(testimonial) {
    const id = this.testimonialId++;
    const newTestimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }
  
  // Currency Settings
  async getCurrencySettings() {
    return Array.from(this.currencySettings.values());
  }
  
  async getDefaultCurrency() {
    return Array.from(this.currencySettings.values()).find(c => c.isDefault);
  }
  
  async createCurrencySetting(currencySetting) {
    const id = this.currencySettingId++;
    const newCurrencySetting = { ...currencySetting, id };
    this.currencySettings.set(id, newCurrencySetting);
    return newCurrencySetting;
  }
  
  async updateDefaultCurrency(id) {
    // Reset all currencies to non-default
    for (const [currencyId, currency] of this.currencySettings.entries()) {
      this.currencySettings.set(currencyId, { ...currency, isDefault: false });
    }
    
    // Set the selected currency as default
    const currency = this.currencySettings.get(id);
    if (!currency) return undefined;
    
    const updatedCurrency = { ...currency, isDefault: true };
    this.currencySettings.set(id, updatedCurrency);
    return updatedCurrency;
  }
}

// Create and export a singleton instance
const storage = new MemStorage();

module.exports = { storage };