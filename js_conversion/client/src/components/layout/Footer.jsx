import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { RESTAURANT_INFO } from "../../lib/constants";

/**
 * Footer component
 * Displays restaurant information, contact details, and social links
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/40 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Restaurant information */}
          <div>
            <h3 className="font-bold text-lg mb-4">{RESTAURANT_INFO.name}</h3>
            <p className="text-muted-foreground mb-4">{RESTAURANT_INFO.tagline}</p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                <a
                  href={RESTAURANT_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                <a
                  href={RESTAURANT_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                <a
                  href={RESTAURANT_INFO.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Contact information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-muted-foreground">
                  {RESTAURANT_INFO.address.street}<br />
                  {RESTAURANT_INFO.address.city}, {RESTAURANT_INFO.address.state}<br />
                  {RESTAURANT_INFO.address.zip}, {RESTAURANT_INFO.address.country}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a 
                  href={`tel:${RESTAURANT_INFO.phone}`} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {RESTAURANT_INFO.phone}
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a 
                  href={`mailto:${RESTAURANT_INFO.email}`} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {RESTAURANT_INFO.email}
                </a>
              </div>
            </div>
          </div>
          
          {/* Opening hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">Opening Hours</h3>
            <div className="space-y-2">
              {Object.entries(RESTAURANT_INFO.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-muted-foreground hover:text-primary transition-colors">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-muted-foreground hover:text-primary transition-colors">
                  Order Online
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {currentYear} {RESTAURANT_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};