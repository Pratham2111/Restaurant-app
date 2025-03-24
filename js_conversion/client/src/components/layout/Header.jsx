import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { RESTAURANT_INFO, CURRENCY_OPTIONS } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";
import { useMobile } from "../../hooks/use-mobile";
import { MobileMenu } from "./MobileMenu";

/**
 * Header component for the website
 * Contains navigation, currency selector, and cart button
 */
export const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { currentCurrency, setCurrency, currencySettings } = useCurrency();
  const isMobile = useMobile();
  
  const itemCount = getItemCount();
  
  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" }
  ];
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Handle currency change
  const handleCurrencyChange = (currencyId) => {
    setCurrency(currencyId);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="font-bold text-2xl tracking-tight">
            {RESTAURANT_INFO.name}
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        
        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Currency selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                {currentCurrency.symbol} {currentCurrency.code}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {currencySettings.map((currency) => (
                <DropdownMenuItem
                  key={currency.id}
                  className={`cursor-pointer ${
                    currency.id === currentCurrency.id
                      ? "bg-muted font-medium"
                      : ""
                  }`}
                  onClick={() => handleCurrencyChange(currency.id)}
                >
                  {currency.symbol} {currency.code}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Cart button */}
          <Link href="/order">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
          
          {/* Mobile menu toggle */}
          {isMobile && (
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navLinks={navLinks}
          currentCurrency={currentCurrency.code}
          onCurrencyChange={(currencyId) => handleCurrencyChange(parseInt(currencyId))}
        />
      )}
    </header>
  );
};