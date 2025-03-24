import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, ShoppingCart } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Button } from "../ui/button";
import { MobileMenu } from "./MobileMenu";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";
import { RESTAURANT_INFO } from "../../lib/constants";

/**
 * Header component with navigation
 * Includes responsive mobile menu and currency selector
 */
export const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { getItemCount } = useCart();
  
  // Currency settings
  const { currentCurrency, setCurrency, currencySettings } = useCurrency();
  
  // Handle scroll event to make header sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle currency change
  const handleCurrencyChange = (value) => {
    const selectedCurrency = currencySettings.find(c => c.code === value);
    if (selectedCurrency) {
      setCurrency(selectedCurrency.id);
    }
  };
  
  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" }
  ];
  
  return (
    <header
      className={`w-full py-4 transition-all duration-300 z-50 ${
        isSticky
          ? "fixed top-0 left-0 bg-background shadow-md"
          : "relative bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl md:text-2xl">
          {RESTAURANT_INFO.name}
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${
                location === link.href ? "text-primary font-medium" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Currency selector */}
          <Select
            value={currentCurrency?.code}
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger className="w-[70px] mr-2 hidden md:flex">
              <SelectValue placeholder="USD" />
            </SelectTrigger>
            <SelectContent>
              {currencySettings.map((currency) => (
                <SelectItem key={currency.id} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Cart button with count */}
          <Link href="/order">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getItemCount()}
                </span>
              )}
            </Button>
          </Link>
          
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Mobile menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navLinks={navLinks}
          currentCurrency={currentCurrency?.code}
          onCurrencyChange={handleCurrencyChange}
        />
      </div>
    </header>
  );
};