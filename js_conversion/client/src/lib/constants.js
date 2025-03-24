/**
 * Restaurant information used throughout the site
 */
export const RESTAURANT_INFO = {
  name: "La Mason",
  address: "123 Gourmet Street, Foodville, CA 90210",
  phone: "+1 (555) 123-4567",
  email: "info@lamason.com",
  openingHours: {
    monday: "11:00 AM - 10:00 PM",
    tuesday: "11:00 AM - 10:00 PM",
    wednesday: "11:00 AM - 10:00 PM",
    thursday: "11:00 AM - 10:00 PM",
    friday: "11:00 AM - 11:00 PM",
    saturday: "10:00 AM - 11:00 PM",
    sunday: "10:00 AM - 10:00 PM"
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
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "€ EUR" },
  { value: "GBP", label: "£ GBP" }
];

/**
 * Content for the hero section
 */
export const HERO_SECTION = {
  title: "Experience Culinary Excellence",
  subtitle: "Fine Dining & Exceptional Ambiance",
  description: "Indulge in our artfully crafted dishes made with the finest seasonal ingredients, served in an elegant atmosphere.",
  cta: "Reserve a Table",
  ctaLink: "/booking",
  secondaryCta: "View Menu",
  secondaryCtaLink: "/menu",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
};

/**
 * Content for the about section
 */
export const ABOUT_SECTION = {
  title: "Our Culinary Journey",
  subtitle: "About La Mason",
  description: "Founded in 2005, La Mason has been a culinary landmark offering the finest dining experience. Our team of award-winning chefs brings passion and creativity to every dish, combining traditional techniques with innovative approaches.",
  image: "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?q=80&w=1964&auto=format&fit=crop",
  features: [
    {
      title: "Locally Sourced Ingredients",
      description: "We partner with local farmers to ensure the freshest seasonal produce."
    },
    {
      title: "Award-Winning Chefs",
      description: "Our culinary team has received numerous accolades for their exceptional skills."
    },
    {
      title: "Elegant Atmosphere",
      description: "Enjoy your meal in our beautifully designed space with impeccable service."
    }
  ]
};

/**
 * Content for the menu section
 */
export const MENU_SECTION = {
  title: "Our Gourmet Menu",
  description: "Discover our selection of exquisite dishes crafted with passion and the finest ingredients.",
  cta: "View Full Menu",
  ctaLink: "/menu"
};

/**
 * Content for the booking section
 */
export const BOOKING_SECTION = {
  title: "Reserve Your Table",
  description: "Secure your spot for an unforgettable dining experience at La Mason.",
  image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop"
};

/**
 * Content for the order section
 */
export const ORDER_SECTION = {
  title: "Order For Delivery or Pickup",
  description: "Enjoy our delicious meals in the comfort of your home.",
  deliveryFee: 4.99,
  minimumOrderFreeDelivery: 50,
  estimatedDeliveryTime: "30-45 minutes"
};

/**
 * Content for the testimonials section
 */
export const TESTIMONIALS_SECTION = {
  title: "What Our Guests Say",
  subtitle: "Testimonials",
  description: "Read about the experiences of our valued patrons who have dined with us."
};

/**
 * Content for the contact section
 */
export const CONTACT_SECTION = {
  title: "Get in Touch",
  description: "Have questions or feedback? We'd love to hear from you.",
  locationTitle: "Our Location",
  hoursTitle: "Opening Hours",
  contactTitle: "Contact Information"
};