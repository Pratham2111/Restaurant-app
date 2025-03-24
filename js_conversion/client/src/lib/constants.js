/**
 * Restaurant information used throughout the site
 */
export const RESTAURANT_INFO = {
  name: "La Mason",
  description: "A fine dining experience featuring fusion cuisine from around the world.",
  address: "123 Gourmet Avenue, Culinary District, FS 12345",
  phone: "+1 (555) 123-4567",
  email: "contact@lamason.com",
  hours: {
    weekday: "11:00 AM - 10:00 PM",
    weekend: "10:00 AM - 11:00 PM"
  },
  social: {
    facebook: "https://facebook.com/lamason",
    instagram: "https://instagram.com/lamason",
    twitter: "https://twitter.com/lamason"
  }
};

/**
 * Currency options for the currency selector
 */
export const CURRENCY_OPTIONS = [
  { id: 1, code: "USD", symbol: "$", rate: 1, isDefault: true },
  { id: 2, code: "EUR", symbol: "€", rate: 0.93, isDefault: false },
  { id: 3, code: "GBP", symbol: "£", rate: 0.8, isDefault: false }
];

/**
 * Content for the hero section
 */
export const HERO_SECTION = {
  title: "Culinary Excellence in Every Bite",
  subtitle: "Experience the art of fine dining with our innovative fusion cuisine crafted by world-class chefs.",
  cta: {
    primary: {
      text: "Book a Table",
      link: "/booking"
    },
    secondary: {
      text: "View Menu",
      link: "/menu"
    }
  },
  features: [
    "Fine Dining",
    "Fusion Cuisine",
    "Private Events",
    "Award Winning"
  ]
};

/**
 * Content for the about section
 */
export const ABOUT_SECTION = {
  subtitle: "Our Story",
  title: "Tradition Meets Innovation",
  paragraphs: [
    "Founded in 2005, La Mason has been serving culinary masterpieces that blend traditional techniques with innovative flavors. Our commitment to excellence extends beyond our menu to the warm, inviting atmosphere and impeccable service.",
    "Each dish tells a story, crafted with locally-sourced, seasonal ingredients and prepared with passion by our team of expert chefs led by renowned Chef Michael Laurent."
  ],
  features: [
    "Locally Sourced",
    "Seasonal Menu",
    "Expert Chefs",
    "Sustainable Practices"
  ],
  image: {
    main: "https://images.unsplash.com/photo-1564759298141-cef86f51d4d4?w=600&auto=format&fit=crop&q=80",
    accent: "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=400&auto=format&fit=crop&q=80"
  },
  experience: {
    years: 18,
    text: "Years of Excellence"
  }
};

/**
 * Content for the menu section
 */
export const MENU_SECTION = {
  subtitle: "Our Menu",
  title: "Culinary Masterpieces",
  description: "Explore our diverse selection of dishes crafted with the finest ingredients and creative techniques.",
  categories: [
    "Appetizers",
    "Main Courses",
    "Seafood",
    "Vegetarian",
    "Desserts",
    "Beverages"
  ]
};

/**
 * Content for the booking section
 */
export const BOOKING_SECTION = {
  subtitle: "Reservations",
  title: "Book Your Dining Experience",
  description: "Reserve your table at La Mason for an unforgettable culinary journey.",
  cta: "Book Now"
};

/**
 * Content for the order section
 */
export const ORDER_SECTION = {
  subtitle: "Order Online",
  title: "Enjoy La Mason at Home",
  description: "Order your favorite La Mason dishes for delivery or pickup.",
  cta: "Order Now",
  features: [
    {
      title: "Fast Delivery",
      description: "Enjoy our dishes delivered to your doorstep within 45 minutes."
    },
    {
      title: "Carefully Packaged",
      description: "Every dish is carefully packaged to maintain flavor and quality."
    },
    {
      title: "Easy Ordering",
      description: "Simple, intuitive ordering process with real-time tracking."
    }
  ]
};

/**
 * Content for the testimonials section
 */
export const TESTIMONIALS_SECTION = {
  subtitle: "Testimonials",
  title: "What Our Guests Say",
  description: "Read about the experiences of our valued guests."
};

/**
 * Content for the contact section
 */
export const CONTACT_SECTION = {
  subtitle: "Contact Us",
  title: "Get in Touch",
  description: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  cta: "Send Message",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0608019392337!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzMwLjUiTiAxMjLCsDI1JzA5LjkiVw!5e0!3m2!1sen!2sus!4v1647882708559!5m2!1sen!2sus"
};