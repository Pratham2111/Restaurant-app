import React, { useEffect } from "react";
import { Link } from "wouter";
import { CURRENCY_OPTIONS } from "@/lib/constants";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export const MobileMenu = ({
  isOpen,
  onClose,
  navLinks,
  currentCurrency,
  onCurrencyChange
}) => {
  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();
  
  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on the background when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu content */}
      <div className="relative ml-auto flex h-full w-4/5 max-w-xs flex-col overflow-y-auto bg-background px-6 py-6 shadow-lg">
        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={onClose}
            >
              <a className="text-base font-medium">
                {link.label}
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="mt-6 border-t pt-4">
          {/* Cart Link */}
          <Link href="/order" onClick={onClose}>
            <a className="flex items-center justify-between mb-4">
              <span className="font-medium">Your Cart</span>
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-1" />
                {cartItemCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </a>
          </Link>
          
          {/* Currency Selector */}
          <div>
            <label 
              htmlFor="mobile-currency" 
              className="block text-sm font-medium mb-1"
            >
              Select Currency
            </label>
            <select
              id="mobile-currency"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={currentCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
            >
              {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};