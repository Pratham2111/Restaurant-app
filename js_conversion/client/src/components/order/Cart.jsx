import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { OrderItem } from "./OrderItem";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number."
  }),
  address: z.string().min(5, {
    message: "Please enter your full address."
  }),
  notes: z.string().optional(),
});

/**
 * Cart component for the order page
 * Displays cart items, totals, and checkout form
 */
export const Cart = () => {
  const { toast } = useToast();
  const [isCheckout, setIsCheckout] = useState(false);
  
  const { 
    items, 
    removeFromCart, 
    clearCart, 
    updateQuantity, 
    getItemCount,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    formatSubtotal,
    formatDeliveryFee,
    formatTax,
    formatTotal,
  } = useCart();
  
  // Initialize form with default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });
  
  // Handle form submission with mutation
  const mutation = useMutation({
    mutationFn: (data) => {
      return apiRequest("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          items: items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity
          })),
          subtotal: getSubtotal(),
          tax: getTax(),
          deliveryFee: getDeliveryFee(),
          total: getTotal(),
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Confirmed",
        description: "Your order has been placed successfully. You'll receive a confirmation via email.",
      });
      clearCart();
      setIsCheckout(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Order error:", error);
      toast({
        title: "Something went wrong",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  
  // Toggle checkout form visibility
  const toggleCheckout = () => {
    setIsCheckout(!isCheckout);
  };
  
  // Show empty cart message if cart is empty
  if (items.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border text-center">
        <div className="py-8">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">
            Add some delicious items to your cart and they will appear here.
          </p>
          <Button 
            variant="outline" 
            className="w-full text-primary hover:text-primary-foreground hover:bg-primary"
          >
            Start Ordering
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Your Order</h3>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={clearCart}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      
      {/* Cart items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <OrderItem 
            key={item.menuItemId} 
            item={item} 
            onRemove={() => removeFromCart(item.menuItemId)}
            onUpdateQuantity={(quantity) => updateQuantity(item.menuItemId, quantity)}
          />
        ))}
      </div>
      
      {/* Cart totals */}
      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatSubtotal()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span>{formatDeliveryFee()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatTax()}</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
          <span>Total</span>
          <span className="text-primary">{formatTotal()}</span>
        </div>
      </div>
      
      {/* Checkout button or form */}
      {!isCheckout ? (
        <Button 
          className="w-full mt-6" 
          onClick={toggleCheckout}
        >
          Proceed to Checkout
        </Button>
      ) : (
        <div className="mt-6 border-t border-border pt-6">
          <h4 className="font-medium mb-4">Delivery Information</h4>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Phone field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Address field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Notes field */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requests or delivery instructions"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit and cancel buttons */}
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Processing..." : "Place Order"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={toggleCheckout}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};