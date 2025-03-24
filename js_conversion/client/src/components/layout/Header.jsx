import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu as MenuIcon, 
  ShoppingCart, 
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { useCart } from "@/hooks/useCart";
import { useCurrency } from "@/hooks/useCurrency";
import { RESTAURANT_INFO, CURRENCY_OPTIONS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Header = () => {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { getItemCount } = useCart();
  const { currentCurrency, setCurrency } = useCurrency();

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" },
  ];

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle currency change
  const handleCurrencyChange = (value) => {
    setCurrency(parseInt(value));
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <a className="text-2xl font-bold text-primary">
                {RESTAURANT_INFO.name}
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`hover:text-primary transition-colors ${
                      location === link.href
                        ? "text-primary font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Currency Selector */}
              <div className="hidden sm:block">
                <Select
                  value={currentCurrency?.id?.toString()}
                  onValueChange={handleCurrencyChange}
                >
                  <SelectTrigger className="w-20">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      <SelectValue placeholder={currentCurrency?.code || "USD"} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id.toString()}>
                        {currency.symbol} {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cart Button with Counter */}
              <Link href="/order">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <MenuIcon />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
        currentCurrency={currentCurrency?.code || "USD"}
        onCurrencyChange={handleCurrencyChange}
      />
    </>
  );
};