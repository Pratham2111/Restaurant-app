import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from "lucide-react";
import { RESTAURANT_INFO } from "../../lib/constants";

/**
 * Footer component for the website
 * Contains contact info, navigation, and social media links
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Navigation links for footer
  const footerLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" }
  ];
  
  // Additional legal links
  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/accessibility", label: "Accessibility" }
  ];
  
  // Social media links with icons
  const socialLinks = [
    {
      href: RESTAURANT_INFO.socialMedia.facebook,
      label: "Facebook",
      icon: Facebook
    },
    {
      href: RESTAURANT_INFO.socialMedia.instagram,
      label: "Instagram",
      icon: Instagram
    },
    {
      href: RESTAURANT_INFO.socialMedia.twitter,
      label: "Twitter",
      icon: Twitter
    }
  ];
  
  return (
    <footer className="bg-muted/40">
      {/* Main footer content */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Restaurant info */}
          <div>
            <h3 className="font-bold text-xl mb-4">{RESTAURANT_INFO.name}</h3>
            <p className="text-muted-foreground mb-6">
              Experience culinary excellence and exceptional ambiance in the heart of Foodville.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground p-2 rounded-full transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Column 2: Contact info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {RESTAURANT_INFO.address}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {RESTAURANT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <a
                  href={`mailto:${RESTAURANT_INFO.email}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {RESTAURANT_INFO.email}
                </a>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-muted-foreground">
                  <div>Mon-Thu: {RESTAURANT_INFO.openingHours.monday}</div>
                  <div>Fri-Sat: {RESTAURANT_INFO.openingHours.friday}</div>
                  <div>Sun: {RESTAURANT_INFO.openingHours.sunday}</div>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Navigation */}
          <div>
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <nav>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Column 4: Legal & Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <nav className="mb-6">
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <h3 className="font-bold text-lg mb-2">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Subscribe to receive updates, promotions, and event announcements.
            </p>
            <form className="flex mt-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="bg-background rounded-l-md px-4 py-2 text-sm border border-input focus:outline-none focus:ring-1 focus:ring-primary flex-1"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-r-md hover:bg-primary/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {RESTAURANT_INFO.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Designed with ❤️ for our valued customers
          </p>
        </div>
      </div>
    </footer>
  );
};