import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
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
}

export default function Menu() {
  const { toast } = useToast();

  const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"]
  });

  const { data: menuItems, isLoading: loadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"]
  });

  if (loadingCategories || loadingItems) {
    return (
      <div className="container py-8">
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
    );
  }

  const handleAddToCart = (item: MenuItem) => {
    const currentCart = getCartItems();
    const existingItem = currentCart.find(cartItem => cartItem.id === item.id);

    let newCart;
    if (existingItem) {
      // If item exists, increase quantity
      newCart = currentCart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      // If item doesn't exist, add it with quantity 1
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

  return (
    <div className="container py-8">
      {categories?.map(category => (
        <div key={category.id} className="mb-12">
          <h2 className="text-3xl font-bold mb-6">{category.name}</h2>
          <p className="text-muted-foreground mb-8">{category.description}</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems
              ?.filter(item => item.categoryId === category.id)
              .map(item => (
                <Card key={item.id}>
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="text-lg">${item.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
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
        </div>
      ))}
    </div>
  );
}