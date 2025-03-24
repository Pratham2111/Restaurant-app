/**
 * Restaurant information used throughout the site
 */
export const RESTAURANT_INFO = {
  name: "La Mason",
  tagline: "Authentic Italian Cuisine",
  description: "Experience the taste of Italy in the heart of the city. Our chefs use only the finest ingredients to create authentic Italian dishes that will transport you to the streets of Rome.",
  address: "123 Pasta Street, Foodville, FC 12345",
  phone: "+1 (555) 123-4567",
  email: "info@lamason.com",
  hours: {
    monday: "11:00 AM - 10:00 PM",
    tuesday: "11:00 AM - 10:00 PM",
    wednesday: "11:00 AM - 10:00 PM",
    thursday: "11:00 AM - 10:00 PM",
    friday: "11:00 AM - 11:00 PM",
    saturday: "11:00 AM - 11:00 PM",
    sunday: "11:00 AM - 9:00 PM"
  },
  social: {
    facebook: "https://facebook.com/lamason",
    instagram: "https://instagram.com/lamason",
    twitter: "https://twitter.com/lamason"
  },
  location: {
    lat: 40.7128,
    lng: -74.0060
  }
};

/**
 * Currency options for the currency selector
 */
export const CURRENCY_OPTIONS = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.78 }
];

/**
 * Content for the hero section
 */
export const HERO_SECTION = {
  title: "La Mason",
  subtitle: "Authentic Italian Cuisine",
  description: "Experience the taste of Italy in the heart of the city",
  cta: "Order Now",
  secondaryCta: "Book a Table"
};

/**
 * Content for the about section
 */
export const ABOUT_SECTION = {
  title: "Our Story",
  subtitle: "About La Mason",
  description: "Founded in 2005, La Mason has been serving authentic Italian cuisine made with the finest ingredients. Our chefs, trained in Italy, bring the traditional flavors and cooking techniques to create an unforgettable dining experience. We believe in the power of good food to bring people together and create lasting memories.",
  features: [
    { title: "Authentic Recipes", description: "Passed down through generations" },
    { title: "Fresh Ingredients", description: "Locally sourced and organic" },
    { title: "Expert Chefs", description: "Trained in the heart of Italy" }
  ],
  image: "/about-image.jpg"
};

/**
 * Content for the menu section
 */
export const MENU_SECTION = {
  title: "Our Menu",
  subtitle: "Discover our delicious options",
  description: "From hand-made pasta to wood-fired pizzas, our menu offers a wide range of authentic Italian dishes made with fresh, high-quality ingredients."
};

/**
 * Content for the booking section
 */
export const BOOKING_SECTION = {
  title: "Book a Table",
  subtitle: "Reserve your dining experience",
  description: "Make a reservation for a memorable dining experience. Please provide your details below and we'll confirm your booking shortly."
};

/**
 * Content for the order section
 */
export const ORDER_SECTION = {
  title: "Order Online",
  subtitle: "Enjoy our food at home",
  description: "Order your favorite dishes for takeout or delivery. Our food is carefully packaged to ensure it arrives fresh and delicious."
};

/**
 * Content for the testimonials section
 */
export const TESTIMONIALS_SECTION = {
  title: "What Our Customers Say",
  subtitle: "Testimonials",
  description: "Don't just take our word for it. Here's what our satisfied customers have to say about their dining experience at La Mason."
};

/**
 * Content for the contact section
 */
export const CONTACT_SECTION = {
  title: "Contact Us",
  subtitle: "Get in Touch",
  description: "Have a question or want to provide feedback? Fill out the form below and we'll get back to you as soon as possible.",
  info: [
    { title: "Address", value: "123 Pasta Street, Foodville, FC 12345" },
    { title: "Phone", value: "+1 (555) 123-4567" },
    { title: "Email", value: "info@lamason.com" }
  ]
};