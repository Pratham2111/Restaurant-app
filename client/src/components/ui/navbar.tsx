import { Link } from "wouter";
import { Button } from "./button";
import { ShoppingCart, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

export function Navbar() {
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
              <Link href="/admin/tables">
                <a className="text-lg font-medium">Table Management</a>
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
          <Link href="/admin/tables">
            <a className="text-sm font-medium transition-colors hover:text-primary">
              Table Management
            </a>
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          <Link href="/cart">
            <a className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}