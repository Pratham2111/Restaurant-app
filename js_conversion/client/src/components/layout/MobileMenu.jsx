import { Link } from "wouter";
import { X } from "lucide-react";
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
 * Displays navigation links and options on small screens
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onClose - Function to close the menu
 * @param {Array} props.navLinks - Navigation links to display
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
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader className="border-b pb-4 mb-5">
          <SheetTitle className="flex items-center justify-between">
            <span className="font-serif">{RESTAURANT_INFO.name}</span>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        
        {/* Navigation links */}
        <nav className="flex flex-col space-y-1 mb-8">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link href={link.href}>
                <a className="py-2 px-4 rounded-md text-foreground hover:bg-muted">
                  {link.label}
                </a>
              </Link>
            </SheetClose>
          ))}
        </nav>
        
        {/* Currency selector */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Select Currency
          </h3>
          <Select 
            value={currentCurrency} 
            onValueChange={(value) => {
              const currencyId = parseInt(value);
              onCurrencyChange(currencyId);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencySettings.map((currency) => (
                <SelectItem 
                  key={currency.id} 
                  value={currency.id.toString()}
                >
                  {currency.symbol} {currency.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Bottom actions */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Button asChild variant="default" className="w-full">
            <Link href="/booking">
              <a>Book a Table</a>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/order">
              <a>Order Online</a>
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};