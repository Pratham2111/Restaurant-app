/**
 * Restaurant information used throughout the site
 */
export const RESTAURANT_INFO = {
  name: "La Maison",
  tagline: "Fine French Cuisine",
  address: "123 Gourmet Street, Cuisine City, CC 12345",
  phone: "(555) 123-4567",
  email: "info@lamaison.com",
  hours: [
    { day: "Monday - Thursday", hours: "11:30 AM - 10:00 PM" },
    { day: "Friday - Saturday", hours: "11:30 AM - 11:00 PM" },
    { day: "Sunday", hours: "11:30 AM - 9:00 PM" },
  ],
  social: {
    facebook: "https://facebook.com/lamaison",
    instagram: "https://instagram.com/lamaison",
    twitter: "https://twitter.com/lamaison",
  }
};

/**
 * Currency options for the currency selector
 */
export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD", symbol: "$", rate: 1 },
  { value: "EUR", label: "EUR", symbol: "€", rate: 0.85 },
  { value: "GBP", label: "GBP", symbol: "£", rate: 0.75 },
];

/**
 * Content for the hero section
 */
export const HERO_SECTION = {
  title: "Experience Authentic French Cuisine",
  subtitle: "Indulge in the flavors of France in the heart of the city. Our dishes are crafted with passion and tradition.",
  imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  cta: "Reserve a Table"
};

/**
 * Content for the about section
 */
export const ABOUT_SECTION = {
  title: "Our Story",
  imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  paragraphs: [
    "La Maison was founded in 2005 by Chef Jean-Pierre Dubois, who dreamed of bringing authentic French cuisine to the heart of the city.",
    "Our philosophy is simple: use fresh, high-quality ingredients to create dishes that celebrate the rich culinary traditions of France while embracing modern techniques and local influences."
  ],
  features: [
    "Award-winning chefs",
    "Locally sourced ingredients",
    "Extensive wine selection",
    "Elegant dining atmosphere"
  ]
};

/**
 * Content for the menu section
 */
export const MENU_SECTION = {
  title: "Our Menu",
  description: "Explore our carefully crafted menu featuring traditional French dishes with a modern twist.",
  categories: [
    { id: 1, name: "Appetizers" },
    { id: 2, name: "Main Courses" },
    { id: 3, name: "Desserts" },
    { id: 4, name: "Beverages" }
  ],
  items: [
    {
      id: 1,
      name: "French Onion Soup",
      description: "Caramelized onions in a rich beef broth, topped with a crusty baguette and melted Gruyère cheese.",
      price: 11.99,
      image: "https://images.unsplash.com/photo-1583953596952-51a39dd13051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 1,
      featured: true,
      dietary: ["vegetarian"]
    },
    {
      id: 2,
      name: "Escargots de Bourgogne",
      description: "Burgundy snails baked in garlic and parsley butter, served with a crusty baguette.",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 1,
      featured: false
    },
    {
      id: 3,
      name: "Beef Bourguignon",
      description: "Tender beef slow-cooked in red wine with carrots, pearl onions, and mushrooms, served with mashed potatoes.",
      price: 26.99,
      image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 2,
      featured: true
    },
    {
      id: 4,
      name: "Coq au Vin",
      description: "Chicken braised with wine, bacon, mushrooms, and garlic, served with roasted potatoes.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 2,
      featured: false
    },
    {
      id: 5,
      name: "Crème Brûlée",
      description: "Rich vanilla custard topped with a layer of caramelized sugar.",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 3,
      featured: true,
      dietary: ["vegetarian"]
    },
    {
      id: 6,
      name: "Chocolate Mousse",
      description: "Light and airy chocolate dessert topped with whipped cream and chocolate shavings.",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1511715282680-fbf93a50e721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 3,
      featured: false,
      dietary: ["vegetarian"]
    },
    {
      id: 7,
      name: "French Press Coffee",
      description: "Freshly brewed artisanal coffee.",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1522992319-0365e5f081ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 4,
      featured: false,
      dietary: ["vegan"]
    },
    {
      id: 8,
      name: "House Red Wine",
      description: "Glass of our premium house red wine.",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 4,
      featured: false,
      dietary: ["vegan"]
    }
  ],
  featuredItems: [
    {
      id: 1,
      name: "French Onion Soup",
      description: "Caramelized onions in a rich beef broth, topped with a crusty baguette and melted Gruyère cheese.",
      price: 11.99,
      image: "https://images.unsplash.com/photo-1583953596952-51a39dd13051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 1
    },
    {
      id: 3,
      name: "Beef Bourguignon",
      description: "Tender beef slow-cooked in red wine with carrots, pearl onions, and mushrooms, served with mashed potatoes.",
      price: 26.99,
      image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 2
    },
    {
      id: 5,
      name: "Crème Brûlée",
      description: "Rich vanilla custard topped with a layer of caramelized sugar.",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 3
    }
  ],
};

/**
 * Content for the booking section
 */
export const BOOKING_SECTION = {
  title: "Book a Table",
  imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  policies: [
    "Reservations must be made at least 2 hours in advance.",
    "Parties larger than 8 should call the restaurant directly.",
    "We hold reservations for 15 minutes past the scheduled time.",
    "For special occasions, please note it in the special requests."
  ]
};

/**
 * Content for the order section
 */
export const ORDER_SECTION = {
  title: "Order Online",
  subtitle: "Enjoy our delicious food from the comfort of your home.",
  deliveryFee: 5.99,
  minimumOrder: 15.00,
  deliveryTime: "30-45 minutes",
  pickupTime: "15-20 minutes",
  categories: [
    { id: 1, name: "Appetizers" },
    { id: 2, name: "Main Courses" },
    { id: 3, name: "Desserts" },
    { id: 4, name: "Beverages" }
  ],
  items: [
    {
      id: 1,
      name: "French Onion Soup",
      description: "Caramelized onions in a rich beef broth, topped with a crusty baguette and melted Gruyère cheese.",
      price: 11.99,
      image: "https://images.unsplash.com/photo-1583953596952-51a39dd13051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 1
    },
    {
      id: 2,
      name: "Escargots de Bourgogne",
      description: "Burgundy snails baked in garlic and parsley butter, served with a crusty baguette.",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 1
    },
    {
      id: 3,
      name: "Beef Bourguignon",
      description: "Tender beef slow-cooked in red wine with carrots, pearl onions, and mushrooms, served with mashed potatoes.",
      price: 26.99,
      image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 2
    },
    {
      id: 4,
      name: "Coq au Vin",
      description: "Chicken braised with wine, bacon, mushrooms, and garlic, served with roasted potatoes.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 2
    },
    {
      id: 5,
      name: "Crème Brûlée",
      description: "Rich vanilla custard topped with a layer of caramelized sugar.",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 3
    },
    {
      id: 6,
      name: "Chocolate Mousse",
      description: "Light and airy chocolate dessert topped with whipped cream and chocolate shavings.",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1511715282680-fbf93a50e721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 3
    },
    {
      id: 7,
      name: "French Press Coffee",
      description: "Freshly brewed artisanal coffee.",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1522992319-0365e5f081ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 4
    },
    {
      id: 8,
      name: "House Red Wine",
      description: "Glass of our premium house red wine.",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      categoryId: 4
    }
  ]
};

/**
 * Content for the testimonials section
 */
export const TESTIMONIALS_SECTION = {
  title: "What Our Customers Say",
  description: "We're honored to have served so many satisfied customers. Here's what some of them have to say about their dining experience with us.",
  testimonials: [
    {
      id: 1,
      name: "Sophie Martin",
      date: "August 15, 2023",
      rating: 5,
      comment: "Amazing food and impeccable service! The Beef Bourguignon was cooked to perfection, and the wine pairing recommendation was spot on. Will definitely be back!",
      avatar: "https://randomuser.me/api/portraits/women/62.jpg"
    },
    {
      id: 2,
      name: "James Thompson",
      date: "July 28, 2023",
      rating: 5,
      comment: "La Maison offers an authentic French dining experience. The ambiance is elegant, and the food transported me straight to Paris. The Crème Brûlée is a must-try!",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg"
    },
    {
      id: 3,
      name: "Marie Dupont",
      date: "September 5, 2023",
      rating: 4,
      comment: "As a French native, I'm very particular about French cuisine. La Maison didn't disappoint! The flavors were authentic, and the service was friendly.",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    }
  ]
};

/**
 * Content for the contact section
 */
export const CONTACT_SECTION = {
  title: "Contact Us",
  subtitle: "We'd love to hear from you! Reach out with any questions, feedback, or to discuss special events and catering options.",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.789012345678!2d-73.98765432109876!3d40.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDA3JzI0LjQiTiA3M8KwNTknMTUuNiJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus",
  formPlaceholders: {
    name: "Your Name",
    email: "Your Email",
    phone: "Your Phone Number",
    subject: "Subject",
    message: "Your Message"
  }
};