import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItemCard } from "@/components/ui/menu-item-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import type { Category, MenuItem } from "@shared/schema";

// Helper function to get cart items from localStorage
function getCartItems(): Array<{id: number, name: string, price: number, quantity: number}> {
  if (typeof window === "undefined") return [];
  const items = localStorage.getItem("cart");
  return items ? JSON.parse(items) : [];
}

// Helper function to save cart items to localStorage
function saveCartItems(items: Array<{id: number, name: string, price: number, quantity: number}>) {
  localStorage.setItem("cart", JSON.stringify(items));
  // Dispatch a custom event to notify navbar of cart updates
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"]
  });

  const { data: menuItems, isLoading: loadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"]
  });

  const handleAddToCart = (item: MenuItem) => {
    const currentCart = getCartItems();
    const existingItem = currentCart.find(cartItem => cartItem.id === item.id);

    let newCart;
    if (existingItem) {
      newCart = currentCart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      newCart = [...currentCart, {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1
      }];
    }

    saveCartItems(newCart);

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`
    });
  };

  if (loadingCategories || loadingItems) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 animate-pulse bg-muted h-10 rounded-md" />
            <div className="w-[180px] animate-pulse bg-muted h-10 rounded-md" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg" />
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredItems = menuItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.categoryId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">Our Menu</h1>
        <p className="text-muted-foreground text-center mb-8">
          Discover our delicious selection of dishes
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map(category => (
                <SelectItem
                  key={category.id}
                  value={category.id.toString()}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems?.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {filteredItems?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No menu items found matching your search.</p>
        </div>
      )}
    </div>
  );
}