import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart } from "lucide-react";
import { RESTAURANT_INFO } from "../../lib/constants";
import CurrencySelector from "../common/CurrencySelector";
import { useCart } from "../../hooks/useCart";
import { generatePlaceholderImage } from "../../lib/utils";

/**
 * Header component that appears at the top of every page
 */
function Header({ toggleMobileMenu }) {
  const [location] = useLocation();
  const { totalQuantity } = useCart();
  
  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" }
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <img 
                src="/logo.png" 
                alt={RESTAURANT_INFO.name} 
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = generatePlaceholderImage("Logo", 40, 40);
                }}
              />
              <span className="font-bold text-xl">{RESTAURANT_INFO.name}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`font-medium transition-colors hover:text-primary cursor-pointer ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Currency and Cart */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>
            
            <Link href="/order">
              <div className="relative cursor-pointer">
                <ShoppingCart className="h-6 w-6" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </div>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="block md:hidden text-foreground"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;