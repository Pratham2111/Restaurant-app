import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { CURRENCY_OPTIONS } from "../../lib/constants";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * Mobile menu component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onClose - Function to close the menu
 * @param {Array} props.navLinks - Navigation links array
 * @param {string} props.currentCurrency - Current currency code
 * @param {Function} props.onCurrencyChange - Function to change currency
 */
export const MobileMenu = ({
  isOpen,
  onClose,
  navLinks,
  currentCurrency,
  onCurrencyChange
}) => {
  const { currencySettings } = useCurrency();
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  
  // Handle link click - close menu
  const handleLinkClick = () => {
    onClose();
  };
  
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="absolute inset-0 bg-background shadow-xl">
        <div className="flex flex-col h-full">
          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto pt-8 pb-4 px-4">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className="flex items-center justify-between py-3 px-4 hover:bg-muted rounded-lg text-lg font-medium"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Currency selector */}
          <div className="border-t p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Select Currency
            </div>
            <div className="grid grid-cols-3 gap-2">
              {currencySettings.map((currency) => (
                <button
                  key={currency.id}
                  className={cn(
                    "py-2 px-3 text-sm rounded-lg font-medium",
                    currency.code === currentCurrency
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                  onClick={() => onCurrencyChange(currency.id)}
                >
                  {currency.symbol} {currency.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};