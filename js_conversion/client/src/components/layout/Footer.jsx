import { Link } from "wouter";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail,
  Phone,
  MapPin,
  Clock
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { RESTAURANT_INFO } from "../../lib/constants";

/**
 * Footer component
 * Displays restaurant information, navigation, and social links
 */
export const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Footer navigation links
  const footerLinks = [
    { section: "Navigation", links: [
      { href: "/", label: "Home" },
      { href: "/menu", label: "Our Menu" },
      { href: "/booking", label: "Book a Table" },
      { href: "/order", label: "Order Online" },
      { href: "/contact", label: "Contact Us" }
    ]},
    { section: "Legal", links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/accessibility", label: "Accessibility" }
    ]},
    { section: "Company", links: [
      { href: "/about", label: "About Us" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" }
    ]}
  ];
  
  return (
    <footer className="bg-muted/40 border-t pt-12 pb-6">
      <div className="container">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Restaurant info */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold">
              {RESTAURANT_INFO.name}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              {RESTAURANT_INFO.description}
            </p>
            
            {/* Social media icons */}
            <div className="flex space-x-4 text-muted-foreground">
              <a 
                href={RESTAURANT_INFO.social.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              
              <a 
                href={RESTAURANT_INFO.social.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              
              <a 
                href={RESTAURANT_INFO.social.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="font-medium text-base mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <span>{RESTAURANT_INFO.phone}</span>
              </li>
              
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>{RESTAURANT_INFO.email}</span>
              </li>
              
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p>Mon-Fri: {RESTAURANT_INFO.hours.weekday}</p>
                  <p>Sat-Sun: {RESTAURANT_INFO.hours.weekend}</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Navigation links */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {footerLinks.map((section) => (
              <div key={section.section}>
                <h3 className="font-medium text-base mb-4">{section.section}</h3>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>
                        <a className="text-muted-foreground hover:text-primary transition-colors">
                          {link.label}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Newsletter signup - could be implemented later */}
        <div className="mt-10 mb-6 py-6 border-t border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-medium text-base">Subscribe to our newsletter</h3>
              <p className="text-sm text-muted-foreground">
                Get updates on special events, new menus, and promotions.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button disabled>Coming Soon</Button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            © {currentYear} {RESTAURANT_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};