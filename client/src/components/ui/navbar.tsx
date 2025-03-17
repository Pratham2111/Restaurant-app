import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
import type { User as UserType } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const getCartItemCount = (): number => {
  if (typeof window === "undefined") return 0;
  const items = localStorage.getItem("cart");
  if (!items) return 0;
  const cartItems = JSON.parse(items);
  return cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
};

export const Navbar: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { translate } = useSiteSettings();

  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 0,
    enabled: true,
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      toast({
        title: translate("Success"),
        description: translate("You have been logged out successfully.")
      });
      await queryClient.resetQueries();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: translate("Error"),
        description: translate("Failed to logout. Please try again."),
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    setCartCount(getCartItemCount());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        setCartCount(getCartItemCount());
      }
    };

    const handleCartUpdate = () => {
      setCartCount(getCartItemCount());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-[1440px] mx-auto flex h-14 sm:h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] sm:w-[300px]">
            <SheetHeader>
              <SheetTitle>{translate("Menu")}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Link href="/">
                <a className="text-base sm:text-lg font-medium">{translate("Home")}</a>
              </Link>
              <Link href="/menu">
                <a className="text-base sm:text-lg font-medium">{translate("Menu")}</a>
              </Link>
              <Link href="/booking">
                <a className="text-base sm:text-lg font-medium">{translate("Book a Table")}</a>
              </Link>
              <Link href="/events">
                <a className="text-base sm:text-lg font-medium">{translate("Events")}</a>
              </Link>
              <Link href="/admin/dashboard">
                <a className="text-base sm:text-lg font-medium">{translate("Restaurant Dashboard")}</a>
              </Link>
              <Link href="/admin/users">
                <a className="text-base sm:text-lg font-medium">{translate("User Management")}</a>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="mr-4 hidden md:flex">
          <Link href="/">
            <a className="text-lg sm:text-xl font-bold">La Maison</a>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-4 lg:mx-6">
          <Link href="/menu">
            <a className="text-sm font-medium transition-colors hover:text-primary">
              {translate("Menu")}
            </a>
          </Link>
          <Link href="/booking">
            <a className="text-sm font-medium transition-colors hover:text-primary">
              {translate("Book a Table")}
            </a>
          </Link>
          <Link href="/events">
            <a className="text-sm font-medium transition-colors hover:text-primary">
              {translate("Events")}
            </a>
          </Link>
          <Link href="/admin/dashboard">
            <a className="text-sm font-medium transition-colors hover:text-primary">
              {translate("Restaurant Dashboard")}
            </a>
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2">
          <Link href="/cart">
            <a className="relative">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              {cartCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center bg-restaurant-yellow text-restaurant-black text-xs sm:text-sm"
                >
                  {cartCount}
                </Badge>
              )}
            </a>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {!isLoading && user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <a className="w-full cursor-pointer">{translate("My Account")}</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    {translate("Logout")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <a className="w-full cursor-pointer">{translate("Login")}</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">
                      <a className="w-full cursor-pointer">{translate("Register")}</a>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};