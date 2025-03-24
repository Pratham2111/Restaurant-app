import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { RESTAURANT_INFO } from "../../lib/constants";
import { useMediaQuery } from "../../hooks/use-mobile";
import { MobileMenu } from "./MobileMenu";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * Header component with navigation and mobile responsiveness
 */
export const Header = () => {
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentCurrency, setCurrency, currencySettings } = useCurrency();

  // Navigation links for both desktop and mobile
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" },
  ];

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle currency change
  const handleCurrencyChange = (currencyId) => {
    setCurrency(parseInt(currencyId, 10));
  };

  return (
    <header 
      className={`sticky top-0 w-full z-50 bg-background transition-all duration-300 ${
        isScrolled ? "shadow-md py-2" : "py-4"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold text-primary">
              {RESTAURANT_INFO.name}
            </span>
          </a>
        </Link>

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <a
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {label}
                </a>
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop actions */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-4">
            {/* Currency selector */}
            <select
              className="bg-background border border-input rounded-md text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20"
              value={currentCurrency?.id || ""}
              onChange={(e) => handleCurrencyChange(e.target.value)}
            >
              {currencySettings.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.symbol} {currency.code}
                </option>
              ))}
            </select>

            {/* Primary actions */}
            <Button asChild size="sm" variant="outline">
              <Link href="/booking">Book a Table</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/order">Order Now</Link>
            </Button>
          </div>
        )}

        {/* Mobile menu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navLinks={navLinks}
          currentCurrency={currentCurrency?.id || ""}
          onCurrencyChange={handleCurrencyChange}
        />
      )}
    </header>
  );
};