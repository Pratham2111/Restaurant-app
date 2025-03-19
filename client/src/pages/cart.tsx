import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page-section";
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
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

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
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartItems);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { translate, formatCurrency } = useSiteSettings();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const form = useForm({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      items: cartItems,
      total: total,
      status: "pending"
    }
  });

  const orderMutation = useMutation({
    mutationFn: async (data: any) => {
      const orderData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity
        })),
        total: total,
        status: "pending"
      };

      console.log('Submitting order:', orderData);

      const res = await apiRequest("POST", "/api/orders", orderData);

      if (!res.ok) {
        const error = await res.json();
        console.error('Order submission failed:', error);
        throw new Error(error.message || translate('Failed to place order'));
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: translate("Order Placed Successfully"),
        description: translate("Your order #") + data.id + translate(" has been confirmed!")
      });
      // Clear cart
      setCartItems([]);
      saveCartItems([]);
      // Redirect to home
      navigate("/");
    },
    onError: (error: Error) => {
      console.error('Order mutation error:', error);
      toast({
        title: translate("Failed to Place Order"),
        description: error.message || translate("There was an error processing your order. Please try again."),
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

  function onSubmit(data: any) {
    if (cartItems.length === 0) {
      toast({
        title: translate("Cart is Empty"),
        description: translate("Please add items to your cart before checking out"),
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Form data:', data);
      orderMutation.mutate(data);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: translate("Error"),
        description: translate("An error occurred while processing your order. Please try again."),
        variant: "destructive"
      });
    }
  }

  if (cartItems.length === 0) {
    return (
      <PageSection>
        <div className="max-w-[1440px] mx-auto">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">{translate("Your Cart is Empty")}</h2>
                <p className="text-muted-foreground mb-6">
                  {translate("Add some delicious items to your cart to get started")}
                </p>
                <Button onClick={() => navigate("/menu")}>
                  {translate("View Menu")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">{translate("Your Cart")}</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{translate("Order Items")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} × {item.quantity}
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
                <span className="font-medium">{translate("Total")}</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{translate("Checkout")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translate("Your Name")}</FormLabel>
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
                          <FormLabel>{translate("Your Email")}</FormLabel>
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
                          <FormLabel>{translate("Your Phone")}</FormLabel>
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
                      {orderMutation.isPending ? translate("Processing...") : translate("Place Order")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageSection>
  );
}