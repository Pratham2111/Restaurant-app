import React from "react";
import { Link } from "wouter";
import { PhoneIcon, MapPinIcon, MailIcon, Clock } from "lucide-react";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter 
} from "react-icons/fa";
import { RESTAURANT_INFO } from "@/lib/constants";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Navigation Sections
  const sections = [
    {
      title: "Navigation",
      links: [
        { href: "/", label: "Home" },
        { href: "/menu", label: "Our Menu" },
        { href: "/booking", label: "Book a Table" },
        { href: "/order", label: "Order Online" },
        { href: "/contact", label: "Contact Us" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "#", label: "Privacy Policy" },
        { href: "#", label: "Terms & Conditions" },
        { href: "#", label: "Cookie Policy" },
      ],
    },
  ];
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{RESTAURANT_INFO.name}</h3>
            <p className="text-gray-400 max-w-xs">
              {RESTAURANT_INFO.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a
                href={RESTAURANT_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href={RESTAURANT_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href={RESTAURANT_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              <li className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span>{RESTAURANT_INFO.phone}</span>
              </li>
              <li className="flex items-start">
                <MailIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span>{RESTAURANT_INFO.email}</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p>Mon-Fri: {RESTAURANT_INFO.hours.weekdays}</p>
                  <p>Sat-Sun: {RESTAURANT_INFO.hours.weekends}</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Navigation Columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xl font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <a className="text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} {RESTAURANT_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};