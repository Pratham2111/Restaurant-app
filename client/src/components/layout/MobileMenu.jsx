import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { X } from "lucide-react";
import CurrencySelector from "../common/CurrencySelector";

/**
 * Mobile menu component that appears when the menu button is clicked
 */
function MobileMenu({ isOpen, onClose }) {
  const [location] = useLocation();
  
  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" }
  ];
  
  // Close menu on location change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location, isOpen, onClose]);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background bg-opacity-95 md:hidden">
      <div className="container mx-auto px-4 py-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <CurrencySelector />
          </div>
          
          <button 
            onClick={onClose}
            className="text-foreground"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <span
                    className={`block py-2 px-4 text-lg font-medium rounded-md transition-colors hover:bg-secondary cursor-pointer ${
                      location === link.href
                        ? "text-primary bg-secondary"
                        : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default MobileMenu;