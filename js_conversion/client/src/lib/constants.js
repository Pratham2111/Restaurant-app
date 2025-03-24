/**
 * Restaurant information used throughout the site
 */
export const RESTAURANT_INFO = {
  name: "La Mason",
  tagline: "Fine Dining & Culinary Excellence",
  address: "123 Gourmet Avenue, New York, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "info@lamason.com",
  socialMedia: {
    facebook: "https://facebook.com/lamason",
    instagram: "https://instagram.com/lamason",
    twitter: "https://twitter.com/lamason",
  },
  openingHours: {
    monday: "Closed",
    tuesday: "11:00 AM - 10:00 PM",
    wednesday: "11:00 AM - 10:00 PM",
    thursday: "11:00 AM - 10:00 PM",
    friday: "11:00 AM - 11:00 PM",
    saturday: "11:00 AM - 11:00 PM",
    sunday: "11:00 AM - 9:00 PM",
  },
  deliveryFee: 5.99,
  taxRate: 0.0825, // 8.25%
};

/**
 * Currency options for the currency selector
 */
export const CURRENCY_OPTIONS = [
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "€ EUR" },
  { value: "GBP", label: "£ GBP" },
];

/**
 * Content for the hero section
 */
export const HERO_SECTION = {
  title: "Welcome to La Mason",
  subtitle: "Experience the Art of Fine Dining",
  description:
    "Indulge in an unforgettable culinary journey with our award-winning menu crafted by world-class chefs using the finest ingredients.",
  callToAction: "Order Now",
  secondaryAction: "Book a Table",
  image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&h=750",
};

/**
 * Content for the about section
 */
export const ABOUT_SECTION = {
  title: "Our Story",
  subtitle: "Passion for Culinary Excellence",
  description:
    "Founded in 2010, La Mason has been dedicated to providing an exceptional dining experience through our commitment to quality ingredients, innovative recipes, and impeccable service. Our team of experienced chefs bring creativity and precision to every dish, ensuring a memorable experience for all our guests.",
  image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=500&h=350",
  features: [
    {
      title: "Locally Sourced",
      description: "We partner with local farmers to bring you the freshest ingredients",
    },
    {
      title: "Award Winning",
      description: "Recognized for culinary excellence with multiple industry awards",
    },
    {
      title: "Expert Chefs",
      description: "Our dishes are crafted by internationally trained master chefs",
    },
  ],
};

/**
 * Content for the menu section
 */
export const MENU_SECTION = {
  title: "Our Menu",
  subtitle: "Discover Culinary Excellence",
  description:
    "Explore our diverse menu featuring exquisite dishes crafted with passion and the finest ingredients. From appetizers to desserts, each plate is a masterpiece of flavor and presentation.",
};

/**
 * Content for the booking section
 */
export const BOOKING_SECTION = {
  title: "Book a Table",
  subtitle: "Reserve Your Experience",
  description:
    "Make your dining experience special by reserving a table at La Mason. Whether it's a romantic dinner, family gathering, or business meeting, we're ready to serve you with excellence.",
  image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=500&h=350",
};

/**
 * Content for the order section
 */
export const ORDER_SECTION = {
  title: "Order Online",
  subtitle: "Enjoy Our Menu at Home",
  description:
    "Can't make it to our restaurant? Order your favorite dishes online and enjoy the La Mason experience in the comfort of your home.",
  image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=500&h=350",
};

/**
 * Content for the testimonials section
 */
export const TESTIMONIALS_SECTION = {
  title: "Customer Reviews",
  subtitle: "What Our Guests Say",
  description:
    "Read what our valued guests have to say about their dining experiences at La Mason. We pride ourselves on providing exceptional food and service.",
};

/**
 * Content for the contact section
 */
export const CONTACT_SECTION = {
  title: "Contact Us",
  subtitle: "Get in Touch",
  description:
    "Have questions, feedback, or special requests? We'd love to hear from you. Reach out to our team using the form below or contact us directly.",
  image: "https://images.unsplash.com/photo-1560254918-502e024acba8?auto=format&fit=crop&w=500&h=350",
};