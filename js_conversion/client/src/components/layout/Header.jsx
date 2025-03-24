import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RESTAURANT_INFO, CURRENCY_OPTIONS } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useCurrency } from "@/hooks/useCurrency";
import { useCart } from "@/hooks/useCart";
import { Menu, X, ShoppingCart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Header = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { currentCurrency, setCurrency, currencySettings } = useCurrency();
  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" },
  ];

  const handleCurrencyChange = (value) => {
    const currencyId = parseInt(value);
    setCurrency(currencyId);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center text-2xl font-bold text-primary">
            {RESTAURANT_INFO.name}
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* Currency and Cart Actions (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Currency Selector */}
          <Select
            value={currentCurrency?.id?.toString()}
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={currentCurrency?.code || "USD"} />
            </SelectTrigger>
            <SelectContent>
              {currencySettings.map((currency) => (
                <SelectItem key={currency.id} value={currency.id.toString()}>
                  {currency.code} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Cart Button */}
          <Link href="/order">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navLinks={navLinks}
        currentCurrency={currentCurrency?.code || "USD"}
        onCurrencyChange={handleCurrencyChange}
      />
    </header>
  );
};