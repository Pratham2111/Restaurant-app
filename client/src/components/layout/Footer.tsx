import { Link } from "wouter";
import { RESTAURANT_INFO } from "@/lib/constants";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="bg-neutral text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="text-2xl font-bold font-display mb-4">{RESTAURANT_INFO.name}</h3>
            <p className="mb-4">
              Experience the art of fine dining with our exquisite menu, elegant ambiance, and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href={RESTAURANT_INFO.social.facebook} className="text-white hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href={RESTAURANT_INFO.social.instagram} className="text-white hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href={RESTAURANT_INFO.social.twitter} className="text-white hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="hover:text-secondary transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/menu">
                  <a className="hover:text-secondary transition-colors">Our Menu</a>
                </Link>
              </li>
              <li>
                <Link href="/booking">
                  <a className="hover:text-secondary transition-colors">Book a Table</a>
                </Link>
              </li>
              <li>
                <Link href="/order">
                  <a className="hover:text-secondary transition-colors">Order Online</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-secondary transition-colors">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 shrink-0" />
                <span>
                  {RESTAURANT_INFO.address}, {RESTAURANT_INFO.city}, {RESTAURANT_INFO.state} {RESTAURANT_INFO.zip}
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-3 mt-1 shrink-0" />
                <span>{RESTAURANT_INFO.phone}</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-3 mt-1 shrink-0" />
                <span>{RESTAURANT_INFO.email}</span>
              </li>
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>{RESTAURANT_INFO.hours.weekdays}</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday - Sunday:</span>
                <span>{RESTAURANT_INFO.hours.weekends}</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/booking">
                <Button className="bg-secondary hover:bg-opacity-90 text-white">
                  Reserve a Table
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <Separator className="bg-gray-700" />
        
        <div className="pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {RESTAURANT_INFO.name} Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
