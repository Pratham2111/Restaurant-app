import React from "react";
import { Link } from "wouter";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter 
} from "lucide-react";
import { RESTAURANT_INFO } from "../../lib/constants";

/**
 * Footer component that appears at the bottom of every page
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{RESTAURANT_INFO.name}</h3>
            <p className="text-muted-foreground mb-4">
              {RESTAURANT_INFO.slogan}
            </p>
            <div className="flex space-x-4">
              <a 
                href={RESTAURANT_INFO.social.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href={RESTAURANT_INFO.social.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href={RESTAURANT_INFO.social.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a 
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {RESTAURANT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a 
                  href={`mailto:${RESTAURANT_INFO.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {RESTAURANT_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              {RESTAURANT_INFO.hours.map((hours, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{hours.days}: </span>
                    <span>{hours.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="hover:text-primary transition-colors cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/menu">
                  <span className="hover:text-primary transition-colors cursor-pointer">Menu</span>
                </Link>
              </li>
              <li>
                <Link href="/booking">
                  <span className="hover:text-primary transition-colors cursor-pointer">Reservations</span>
                </Link>
              </li>
              <li>
                <Link href="/order">
                  <span className="hover:text-primary transition-colors cursor-pointer">Order Online</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="hover:text-primary transition-colors cursor-pointer">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {RESTAURANT_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;