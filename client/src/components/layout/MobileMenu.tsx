import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { CURRENCY_OPTIONS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
  currentCurrency: string;
  onCurrencyChange: (value: string) => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  navLinks,
  currentCurrency,
  onCurrencyChange
}: MobileMenuProps) => {
  const [location] = useLocation();
  
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="p-0 max-w-[90vw]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-display font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-4 py-6 space-y-6">
          <nav>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a
                      className={`block text-lg font-medium py-2 ${
                        location === link.href ? "text-primary" : "text-neutral hover:text-primary"
                      } transition-colors`}
                      onClick={handleLinkClick}
                    >
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">Select Currency</p>
            <Select
              value={currentCurrency}
              onValueChange={onCurrencyChange}
            >
              <SelectTrigger className="w-full bg-light-cream">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
