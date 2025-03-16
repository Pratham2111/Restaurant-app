import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
          <Skeleton className="h-12 w-full max-w-sm" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[250px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[200px] w-full mb-4" />
                  <Skeleton className="h-4 w-[200px] mb-2" />
                  <Skeleton className="h-4 w-[150px]" />
                </CardContent>
              </Card>
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
          <Card key={item.id} className="overflow-hidden group">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{item.name}</span>
                <span className="text-lg">${Number(item.price).toFixed(2)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {item.description}
              </p>
              <Button 
                onClick={() => handleAddToCart(item)}
                className="w-full bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90"
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
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