import React from "react";
import { Link } from "wouter";
import { RESTAURANT_INFO } from "@/lib/constants";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">{RESTAURANT_INFO.name}</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>{RESTAURANT_INFO.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span>{RESTAURANT_INFO.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:text-primary">
                  {RESTAURANT_INFO.email}
                </a>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              <a 
                href={RESTAURANT_INFO.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href={RESTAURANT_INFO.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href={RESTAURANT_INFO.socialMedia.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Monday - Thursday</p>
                  <p>{RESTAURANT_INFO.openingHours.monday}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-primary opacity-0" />
                <div>
                  <p className="font-medium">Friday - Saturday</p>
                  <p>{RESTAURANT_INFO.openingHours.friday}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-primary opacity-0" />
                <div>
                  <p className="font-medium">Sunday</p>
                  <p>{RESTAURANT_INFO.openingHours.sunday}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="hover:text-primary">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/menu">
                  <a className="hover:text-primary">Our Menu</a>
                </Link>
              </li>
              <li>
                <Link href="/booking">
                  <a className="hover:text-primary">Book a Table</a>
                </Link>
              </li>
              <li>
                <Link href="/order">
                  <a className="hover:text-primary">Order Online</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-primary">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p>&copy; {currentYear} {RESTAURANT_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};