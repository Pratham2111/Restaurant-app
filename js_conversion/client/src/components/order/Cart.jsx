import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useCurrency } from "@/hooks/useCurrency";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { OrderItem } from "@/components/order/OrderItem";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  paymentMethod: z.enum(["cash", "card"], {
    required_error: "Please select a payment method",
  }),
  notes: z.string().optional(),
});

export const Cart = () => {
  const [isCheckout, setIsCheckout] = useState(false);
  const { toast } = useToast();
  const {
    items,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    getItemCount,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { currentCurrency } = useCurrency();

  // Form definition
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentMethod: "cash",
      notes: "",
    },
  });

  // Mutation for form submission
  const mutation = useMutation({
    mutationFn: (data) => {
      // Create order object
      const order = {
        ...data,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: getTotal(),
      };

      return apiRequest("/api/orders", {
        method: "POST",
        body: order,
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been received and is being processed.",
        duration: 5000,
      });
      clearCart();
      setIsCheckout(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Form submission handler
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleProceedToCheckout = () => {
    setIsCheckout(true);
  };

  const handleBackToCart = () => {
    setIsCheckout(false);
  };

  // Format currency with the current currency symbol
  const formatWithCurrency = (amount) => {
    return formatCurrency(amount, currentCurrency?.symbol || "$");
  };

  return (
    <Card className="border-2 h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Your Order
          {!isCheckout && items.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({getItemCount()} items)
            </span>
          )}
        </CardTitle>
      </CardHeader>

      {items.length === 0 ? (
        <CardContent className="text-center py-8">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add items from the menu to start your order
          </p>
        </CardContent>
      ) : isCheckout ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Delivery Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash on Delivery</SelectItem>
                        <SelectItem value="card">Card on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special instructions for your order or delivery"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator className="my-4" />
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatWithCurrency(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>{formatWithCurrency(getDeliveryFee())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatWithCurrency(getTax())}</span>
                </div>
                <div className="flex justify-between font-medium pt-2">
                  <span>Total</span>
                  <span>{formatWithCurrency(getTotal())}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full" 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Processing..." : "Place Order"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleBackToCart}
              >
                Back to Cart
              </Button>
            </CardFooter>
          </form>
        </Form>
      ) : (
        <>
          <CardContent className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <OrderItem
                  key={item.menuItemId}
                  item={item}
                  onRemove={() => removeFromCart(item.menuItemId)}
                  onUpdateQuantity={(quantity) => updateQuantity(item.menuItemId, quantity)}
                />
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatWithCurrency(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>{formatWithCurrency(getDeliveryFee())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatWithCurrency(getTax())}</span>
              </div>
              <div className="flex justify-between font-medium pt-2">
                <span>Total</span>
                <span>{formatWithCurrency(getTotal())}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <Button
              className="w-full"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};