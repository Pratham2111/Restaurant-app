import { X } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Button } from "../ui/button";
import { useCurrency } from "../../hooks/useCurrency";
import { RESTAURANT_INFO } from "../../lib/constants";

/**
 * Mobile menu component
 * Displays responsive navigation for mobile devices
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onClose - Function to close the menu
 * @param {Array} props.navLinks - Navigation links
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
  const [location] = useLocation();
  const { currencySettings } = useCurrency();
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[85vw] sm:max-w-md">
        <SheetHeader className="border-b pb-4 mb-5">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-bold text-xl">
              {RESTAURANT_INFO.name}
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        {/* Navigation links */}
        <nav className="flex flex-col space-y-5 mb-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg transition-colors hover:text-primary ${
                location === link.href ? "text-primary font-medium" : ""
              }`}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Currency selector */}
        <div className="mt-auto">
          <p className="text-sm text-muted-foreground mb-2">Select Currency</p>
          <Select
            value={currentCurrency}
            onValueChange={onCurrencyChange}
          >
            <SelectTrigger className="w-full mb-6">
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
        </div>
        
        {/* Contact info */}
        <div className="border-t pt-6">
          <p className="text-sm text-muted-foreground mb-2">Contact Us</p>
          <p className="font-medium">{RESTAURANT_INFO.phone}</p>
          <p className="text-sm text-muted-foreground">{RESTAURANT_INFO.email}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};