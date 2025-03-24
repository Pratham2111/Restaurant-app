import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  ShoppingBasket, 
  Menu as MenuIcon,
  X
} from "lucide-react";
import { Button } from "../ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { MobileMenu } from "./MobileMenu";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";
import { useMobile } from "../../hooks/use-mobile";
import { RESTAURANT_INFO, CURRENCY_OPTIONS } from "../../lib/constants";

/**
 * Header component with navigation and cart
 * Appears at the top of every page
 */
export const Header = () => {
  const [location] = useLocation();
  const isMobile = useMobile();
  const { currencySettings, currentCurrency, setCurrency } = useCurrency();
  const { getItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Our Menu" },
    { href: "/booking", label: "Book a Table" },
    { href: "/order", label: "Order Online" },
    { href: "/contact", label: "Contact Us" }
  ];
  
  // Handle currency change
  const handleCurrencyChange = (currencyId) => {
    setCurrency(currencyId);
  };
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-sm shadow-sm py-2" 
            : "bg-transparent py-4"
        }`}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2">
              <span className="font-serif text-xl md:text-2xl font-bold">
                {RESTAURANT_INFO.name}
              </span>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* Actions: Cart and Currency Selector */}
          <div className="flex items-center gap-2">
            {/* Currency selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground font-medium"
                >
                  {currentCurrency.symbol} {currentCurrency.code}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {currencySettings.map((currency) => (
                  <DropdownMenuItem
                    key={currency.id}
                    onClick={() => handleCurrencyChange(currency.id)}
                    className={
                      currency.id === currentCurrency.id ? "bg-muted" : ""
                    }
                  >
                    {currency.symbol} {currency.code}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Cart button */}
            <Button asChild variant="outline" size="sm" className="relative">
              <Link href="/order">
                <a className="flex items-center gap-1.5">
                  <ShoppingBasket className="h-4 w-4" />
                  <span>Cart</span>
                  
                  {/* Item count badge */}
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 font-medium">
                      {getItemCount()}
                    </span>
                  )}
                </a>
              </Link>
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
        currentCurrency={currentCurrency.code}
        onCurrencyChange={handleCurrencyChange}
      />
    </>
  );
};