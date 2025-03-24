import React from "react";
import { Link } from "wouter";
import { X, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCY_OPTIONS } from "@/lib/constants";

export const MobileMenu = ({
  isOpen,
  onClose,
  navLinks,
  currentCurrency,
  onCurrencyChange,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="px-0">
        <SheetHeader className="px-6 border-b pb-3">
          <SheetTitle className="text-left">Menu</SheetTitle>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        
        <div className="px-6 py-4">
          {/* Currency Selector */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Currency</p>
            <Select
              value={currentCurrency}
              onValueChange={onCurrencyChange}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={currentCurrency} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id.toString()}>
                    {currency.symbol} {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-2 py-5 h-auto font-normal"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};