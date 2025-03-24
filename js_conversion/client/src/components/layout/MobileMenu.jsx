import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "../ui/button";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * Mobile menu component displayed when menu button is clicked on small screens
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Flag indicating if the menu is open
 * @param {Function} props.onClose - Function to call when closing the menu
 * @param {Array} props.navLinks - Array of navigation links objects
 * @param {string} props.currentCurrency - Current currency ID
 * @param {Function} props.onCurrencyChange - Function to call when currency changes
 */
export const MobileMenu = ({
  isOpen,
  onClose,
  navLinks,
  currentCurrency,
  onCurrencyChange,
}) => {
  const [location] = useLocation();
  const { currencySettings } = useCurrency();
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  
  // Close menu when location changes
  useEffect(() => {
    onClose();
  }, [location, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="px-4 py-8 space-y-6">
        {/* Navigation links */}
        <nav className="flex flex-col space-y-4">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              <a
                className={`text-lg font-medium py-2 transition-colors hover:text-primary ${
                  location === href ? "text-primary" : "text-foreground"
                }`}
                onClick={onClose}
              >
                {label}
              </a>
            </Link>
          ))}
        </nav>
        
        {/* Currency selector */}
        <div className="py-2">
          <label htmlFor="mobile-currency" className="block text-sm font-medium mb-2">
            Select Currency
          </label>
          <select
            id="mobile-currency"
            className="w-full bg-background border border-input rounded-md text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            value={currentCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
          >
            {currencySettings.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.symbol} {currency.code}
              </option>
            ))}
          </select>
        </div>
        
        {/* Primary actions */}
        <div className="flex flex-col space-y-3 pt-4">
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/booking">Book a Table</Link>
          </Button>
          <Button asChild size="lg" className="w-full">
            <Link href="/order">Order Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};