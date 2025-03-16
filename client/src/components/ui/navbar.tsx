import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "./button";
import { ShoppingCart, Menu, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Badge } from "./badge";

const getCartItemCount = (): number => {
  if (typeof window === "undefined") return 0;
  const items = localStorage.getItem("cart");
  if (!items) return 0;
  const cartItems = JSON.parse(items);
  return cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
};

export const Navbar: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Initial cart count
    setCartCount(getCartItemCount());

    // Listen for storage changes
    const handleStorageChange = () => {
      setCartCount(getCartItemCount());
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen for our custom event for same-tab updates
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Link href="/">
                <a className="text-lg font-medium">Home</a>
              </Link>
              <Link href="/menu">
                <a className="text-lg font-medium">Menu</a>
              </Link>
              <Link href="/booking">
                <a className="text-lg font-medium">Book a Table</a>
              </Link>
              <Link href="/admin/dashboard">
                <a className="text-lg font-medium">Restaurant Dashboard</a>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="mr-4 hidden md:flex">
          <Link href="/">
            <a className="text-xl font-bold">La Maison</a>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 mx-6">
          <Link href="/menu">
            <a className="text-sm font-medium transition-colors hover:text-primary">
              Menu
            </a>
          </Link>
          <Link href="/booking">
            <a className="text-sm font-medium transition-colors hover:text-primary">
              Book a Table
            </a>
          </Link>
          <Link href="/admin/dashboard">
            <a className="text-sm font-medium transition-colors hover:text-primary">
              Restaurant Dashboard
            </a>
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center gap-2">
          <Link href="/cart">
            <a className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {cartCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-restaurant-yellow text-restaurant-black"
                >
                  {cartCount}
                </Badge>
              )}
            </a>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <a className="w-full cursor-pointer">Login</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">
                  <a className="w-full cursor-pointer">Register</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};