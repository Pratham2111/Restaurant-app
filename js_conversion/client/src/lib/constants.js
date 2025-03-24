/**
 * Restaurant information used throughout the site
 */
export const RESTAURANT_INFO = {
  name: "La Mason",
  tagline: "Fine Dining & Exceptional Cuisine",
  address: "123 Gourmet Avenue, Culinary District, New York, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "info@lamason.com",
  openingHours: {
    monday: "11:30 AM - 10:00 PM",
    tuesday: "11:30 AM - 10:00 PM",
    wednesday: "11:30 AM - 10:00 PM",
    thursday: "11:30 AM - 10:00 PM",
    friday: "11:30 AM - 11:00 PM",
    saturday: "11:30 AM - 11:00 PM",
    sunday: "11:30 AM - 9:00 PM",
  },
};

/**
 * Currency options for the currency selector
 */
export const CURRENCY_OPTIONS = [
  { id: "usd", name: "USD - US Dollar", symbol: "$" },
  { id: "eur", name: "EUR - Euro", symbol: "€" },
  { id: "gbp", name: "GBP - British Pound", symbol: "£" },
];

/**
 * Content for the hero section
 */
export const HERO_SECTION = {
  title: "Experience Culinary Excellence",
  subtitle: "Indulge in a journey of flavors crafted with passion and precision",
  description:
    "La Mason offers a refined dining experience with a menu that celebrates seasonal ingredients and culinary artistry. Join us for an unforgettable gastronomic adventure.",
  cta: "Reserve a Table",
  ctaLink: "/booking",
  secondaryCta: "Explore Our Menu",
  secondaryCtaLink: "/menu",
  image: "https://images.unsplash.com/photo-1592861956120-e524fc739696?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
};

/**
 * Content for the about section
 */
export const ABOUT_SECTION = {
  title: "Our Story",
  subtitle: "A Tradition of Excellence Since 2005",
  description:
    "Founded by award-winning chef Pierre Dubois, La Mason began as a small bistro with a vision to redefine fine dining. Today, we continue that legacy with a commitment to sourcing the finest ingredients, supporting local producers, and creating memorable experiences for our guests. Our culinary team blends traditional techniques with innovative approaches to deliver dishes that surprise and delight.",
  image: "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
  features: [
    {
      title: "Quality Ingredients",
      description: "We source the finest sustainable ingredients from local farms and trusted suppliers.",
    },
    {
      title: "Expert Chefs",
      description: "Our team of internationally trained chefs brings passion and creativity to every dish.",
    },
    {
      title: "Elegant Ambiance",
      description: "Enjoy your meal in our thoughtfully designed space with warm, attentive service.",
    },
  ],
};

/**
 * Content for the menu section
 */
export const MENU_SECTION = {
  title: "Our Menu",
  description:
    "Explore our carefully crafted selections featuring seasonal ingredients and inspired flavors. Each dish reflects our commitment to culinary excellence and innovation.",
  cta: "View Full Menu",
  ctaLink: "/menu",
};

/**
 * Content for the booking section
 */
export const BOOKING_SECTION = {
  title: "Reserve Your Table",
  description:
    "Secure your dining experience at La Mason. Whether it's a romantic dinner, family gathering, or special celebration, we'll ensure your time with us is memorable.",
  image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
};

/**
 * Content for the order section
 */
export const ORDER_SECTION = {
  title: "Order Online",
  description:
    "Enjoy La Mason's exceptional cuisine in the comfort of your home. Browse our menu, customize your order, and experience fine dining delivered to your doorstep.",
};

/**
 * Content for the testimonials section
 */
export const TESTIMONIALS_SECTION = {
  title: "Guest Experiences",
  subtitle: "What Our Patrons Say",
  description: "Hear from our valued guests about their dining experiences at La Mason.",
};

/**
 * Content for the contact section
 */
export const CONTACT_SECTION = {
  title: "Contact Us",
  description:
    "Have questions or special requests? We're here to help. Reach out to our team through the form below or contact us directly.",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
};