import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { RESTAURANT_INFO } from "../../lib/constants";

/**
 * Footer component with restaurant information and navigation links
 */
export const Footer = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card mt-12 pt-12 pb-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Restaurant info */}
          <div>
            <h3 className="font-bold text-xl text-primary mb-4">{RESTAURANT_INFO.name}</h3>
            <p className="text-muted-foreground mb-4">{RESTAURANT_INFO.tagline}</p>
            <address className="text-muted-foreground not-italic">
              {RESTAURANT_INFO.address}<br />
              Phone: <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-primary transition-colors">
                {RESTAURANT_INFO.phone}
              </a><br />
              Email: <a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:text-primary transition-colors">
                {RESTAURANT_INFO.email}
              </a>
            </address>
          </div>
          
          {/* Opening hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              {Object.entries(RESTAURANT_INFO.openingHours).map(([day, hours]) => (
                <li key={day} className="flex justify-between text-muted-foreground">
                  <span className="capitalize">{day}:</span> 
                  <span>{hours}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/menu">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Our Menu</a>
                </Link>
              </li>
              <li>
                <Link href="/booking">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Book a Table</a>
                </Link>
              </li>
              <li>
                <Link href="/order">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Order Online</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with copyright and social */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} {RESTAURANT_INFO.name}. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};