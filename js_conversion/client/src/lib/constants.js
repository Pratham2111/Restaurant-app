/**
 * Restaurant information used throughout the site
 */
export const RESTAURANT_INFO = {
  name: "La Mason",
  slogan: "Fine Dining & Culinary Excellence",
  description: "A culinary journey through Mediterranean flavors in an elegant setting",
  founded: 2015,
  address: "123 Gourmet Avenue, Culinary District, NY 10001",
  phone: "(212) 555-7890",
  email: "info@lamason.com",
  openingHours: {
    weekdays: "11:00 AM - 10:00 PM",
    weekends: "10:00 AM - 11:00 PM"
  },
  socialMedia: {
    facebook: "https://facebook.com/lamason",
    instagram: "https://instagram.com/lamason",
    twitter: "https://twitter.com/lamason"
  }
};

/**
 * Currency options for the currency selector
 */
export const CURRENCY_OPTIONS = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" }
];

/**
 * Content for the hero section
 */
export const HERO_SECTION = {
  title: "Experience Culinary Excellence",
  subtitle: "At La Mason, we blend tradition with innovation to create an unforgettable dining experience",
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
    "Elegant Atmosphere",
    "Seasonal Ingredients",
    "Award-Winning Chef",
    "Mediterranean Inspired"
  ]
};

/**
 * Content for the about section
 */
export const ABOUT_SECTION = {
  title: "Our Story",
  subtitle: "Passion for Culinary Excellence",
  description: `La Mason was founded in 2015 by Chef Michael Laurent with a vision to create a dining experience that celebrates Mediterranean flavors with a modern twist. Our restaurant has quickly become a local favorite, known for its elegant atmosphere and commitment to quality.
  
  We source the finest ingredients from local farmers and suppliers, ensuring that each dish is prepared with care and attention to detail. Our team of talented chefs and staff are dedicated to providing an exceptional dining experience for every guest.`,
  values: [
    {
      title: "Quality Ingredients",
      description: "We source the finest, freshest ingredients from local farmers and suppliers."
    },
    {
      title: "Culinary Artistry",
      description: "Our chefs blend traditional techniques with innovative approaches."
    },
    {
      title: "Warm Hospitality",
      description: "We believe in creating a welcoming atmosphere for every guest."
    },
    {
      title: "Sustainability",
      description: "We're committed to eco-friendly practices throughout our operations."
    }
  ],
  chef: {
    name: "Michael Laurent",
    title: "Executive Chef & Founder",
    bio: "With over 20 years of culinary experience in top restaurants across Europe and America, Chef Michael brings his passion for Mediterranean cuisine and innovative cooking techniques to every dish at La Mason.",
    image: "https://randomuser.me/api/portraits/men/42.jpg"
  }
};

/**
 * Content for the menu section
 */
export const MENU_SECTION = {
  title: "Our Menu",
  subtitle: "Crafted with Passion & Precision",
  description: "Explore our diverse menu featuring seasonal ingredients and chef's specialties. Each dish is prepared with care to deliver exceptional flavors and presentation.",
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
  title: "Reserve Your Table",
  subtitle: "Join Us for an Unforgettable Dining Experience",
  description: "Make a reservation at La Mason for a special occasion or a delightful evening. We recommend booking in advance to secure your preferred date and time.",
  phone: RESTAURANT_INFO.phone,
  email: RESTAURANT_INFO.email,
  address: RESTAURANT_INFO.address,
  openingHours: [
    { day: "Monday", hours: "11:00 AM - 10:00 PM" },
    { day: "Tuesday", hours: "11:00 AM - 10:00 PM" },
    { day: "Wednesday", hours: "11:00 AM - 10:00 PM" },
    { day: "Thursday", hours: "11:00 AM - 10:00 PM" },
    { day: "Friday", hours: "11:00 AM - 11:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 11:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 10:00 PM" }
  ],
  specialEvents: {
    title: "Private Events & Celebrations",
    description: "Our private dining room is perfect for celebrations, corporate events, and special occasions. Contact us for details and availability."
  }
};

/**
 * Content for the order section
 */
export const ORDER_SECTION = {
  title: "Order Online",
  subtitle: "Enjoy La Mason at Home",
  description: "Can't dine with us? Order your favorite dishes for delivery or pickup. We ensure the same quality and care for every order.",
  features: [
    {
      title: "Fast Delivery",
      description: "We deliver within 5 miles of our location, typically within 30-45 minutes."
    },
    {
      title: "Quality Guaranteed",
      description: "Special packaging ensures your food arrives hot and fresh."
    },
    {
      title: "Easy Pickup",
      description: "Prefer to pickup? Your order will be ready at your chosen time."
    }
  ],
  policies: {
    title: "Delivery Information",
    details: [
      "Delivery available within 5 miles",
      "Minimum order of $25 for delivery",
      "Delivery fee: $5 (free for orders over $50)",
      "30-45 minute estimated delivery time"
    ]
  }
};

/**
 * Content for the testimonials section
 */
export const TESTIMONIALS_SECTION = {
  title: "Guest Experiences",
  subtitle: "What Our Guests Say",
  description: "We take pride in creating memorable dining experiences for our guests. Here are some thoughts from our valued patrons."
};

/**
 * Content for the contact section
 */
export const CONTACT_SECTION = {
  title: "Contact Us",
  subtitle: "We'd Love to Hear from You",
  description: "Whether you have a question, feedback, or want to inquire about special events, we're here to help. Reach out to us using any of the methods below.",
  address: RESTAURANT_INFO.address,
  phone: RESTAURANT_INFO.phone,
  email: RESTAURANT_INFO.email,
  hours: "Monday-Friday: 11AM-10PM, Saturday-Sunday: 10AM-11PM",
  faqs: [
    {
      question: "Do you accommodate dietary restrictions?",
      answer: "Yes, we offer various options for different dietary needs including vegetarian, vegan, and gluten-free. Please inform your server about any allergies or restrictions."
    },
    {
      question: "Can I make a reservation for a large group?",
      answer: "Absolutely! For groups larger than 8 people, please call us directly to arrange a reservation and discuss any special requirements."
    },
    {
      question: "Is there parking available?",
      answer: "We offer complimentary valet parking for our guests. There's also public parking available within a short walking distance."
    },
    {
      question: "Do you host private events?",
      answer: "Yes, we have a private dining area perfect for celebrations, corporate events, and special occasions. Please contact us for availability and details."
    }
  ]
};