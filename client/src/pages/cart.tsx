import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PageSection } from "@/components/ui/page-section";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash2 } from "lucide-react";

// This would typically come from a cart store
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  const items = localStorage.getItem("cart");
  return items ? JSON.parse(items) : [];
}

function saveCartItems(items: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(items));
  // Dispatch both storage and custom event
  window.dispatchEvent(new Event("cartUpdated"));
  // Create a new storage event for cross-tab sync
  if (typeof window !== "undefined") {
    const event = new StorageEvent('storage', {
      key: 'cart',
      newValue: JSON.stringify(items),
      storageArea: localStorage
    });
    window.dispatchEvent(event);
  }
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartItems);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      items: [],
      total: "0",
      status: "pending",
      createdAt: new Date()
    }
  });

  const orderMutation = useMutation({
    mutationFn: async (data: any) => {
      // Format the order data properly before sending
      const formattedData = {
        ...data,
        items: data.items.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price.toString()
        }))
      };

      const res = await apiRequest("POST", "/api/orders", formattedData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to place order');
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${data.id} has been confirmed!`
      });
      // Clear cart
      setCartItems([]);
      saveCartItems([]);
      // Redirect to home
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Place Order",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateQuantity = (itemId: number, change: number) => {
    const newItems = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCartItems(newItems);
    saveCartItems(newItems);
  };

  const removeItem = (itemId: number) => {
    const newItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(newItems);
    saveCartItems(newItems);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function onSubmit(data: any) {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive"
      });
      return;
    }

    // Format order data
    const orderData = {
      ...data,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        quantity: item.quantity
      })),
      total: total.toFixed(2)
    };

    orderMutation.mutate(orderData);
  }

  if (cartItems.length === 0) {
    return (
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-muted-foreground mb-6">
                  Add some delicious items to your cart to get started
                </p>
                <Button onClick={() => navigate("/menu")}>
                  View Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    );
  }

  return (
    <div className="w-full">
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">Your Cart</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Checkout</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={orderMutation.isPending}
                      >
                        {orderMutation.isPending ? "Processing..." : "Place Order"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}