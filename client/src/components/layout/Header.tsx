import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/hooks/useCurrency";
import { RESTAURANT_INFO, CURRENCY_OPTIONS } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { currentCurrency, currencySettings, setCurrency } = useCurrency();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCurrencyChange = (value: string) => {
    const currency = currencySettings.find(c => c.code === value);
    if (currency) {
      setCurrency(currency.id);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(prev => !prev);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" }
  ];

  return (
    <>
      <header className={`bg-white fixed w-full z-50 transition-shadow duration-300 ${isScrolled ? "shadow-lg" : "shadow-md"}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <span className="text-3xl font-bold font-display text-primary">{RESTAURANT_INFO.name}</span>
              </a>
            </Link>
          </div>

          {/* Currency Selector */}
          <div className={`${isMobile ? "hidden" : "flex"} items-center mr-4`}>
            <Select
              defaultValue={currentCurrency.code}
              value={currentCurrency.code}
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger className="w-[100px] h-9 bg-light-cream">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav>
              <ul className="flex space-x-8">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a className={`text-neutral font-medium hover:text-primary transition ${location === link.href ? "text-primary" : ""}`}>
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Mobile Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={showMobileMenu} 
        onClose={() => setShowMobileMenu(false)} 
        navLinks={navLinks}
        currentCurrency={currentCurrency.code}
        onCurrencyChange={handleCurrencyChange}
      />
      
      {/* Page content padding - to avoid content being hidden behind the fixed header */}
      <div className="h-20"></div>
    </>
  );
};
