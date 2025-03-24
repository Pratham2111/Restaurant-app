import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  ShoppingBag, 
  CreditCard, 
  Loader2, 
  ArrowRight, 
  CheckCircle 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { OrderItem } from "./OrderItem";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

/**
 * Form schema for checkout validation
 */
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  paymentMethod: z.string({ message: "Please select a payment method" }),
  notes: z.string().optional(),
});

/**
 * Cart component
 * Shows the shopping cart with order items and checkout form
 */
export const Cart = () => {
  const { toast } = useToast();
  const { 
    items, 
    clearCart, 
    getFormattedSubtotal, 
    getFormattedDeliveryFee, 
    getFormattedTax, 
    getFormattedTotal 
  } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentMethod: "",
      notes: "",
    },
  });
  
  // Mutation for creating order
  const createOrder = useMutation({
    mutationFn: async (data) => {
      return apiRequest("/api/orders", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been received and is being processed.",
      });
      
      // Reset form and clear cart
      form.reset();
      clearCart();
      setOrderSuccess(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });
  
  // Form submission handler
  const onSubmit = (data) => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert form data to API format
    const order = {
      ...data,
      items: items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
    };
    
    createOrder.mutate(order);
  };
  
  if (orderSuccess) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-2 text-primary">
            <CheckCircle className="h-12 w-12" />
          </div>
          <CardTitle className="text-center">Order Confirmed!</CardTitle>
          <CardDescription className="text-center">
            Thank you for your order. We'll start preparing your food right away.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            We've sent a confirmation email with your order details.
          </p>
          <Button onClick={() => setOrderSuccess(false)}>Place New Order</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Your Order
        </CardTitle>
        <CardDescription>
          {items.length === 0 
            ? "Your cart is empty. Add items to place an order." 
            : `You have ${items.length} item(s) in your cart.`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cart items */}
        {items.length > 0 && (
          <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 pr-2">
            {items.map((item) => (
              <OrderItem key={item.menuItemId} item={item} />
            ))}
          </div>
        )}
        
        {/* Order summary */}
        {items.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{getFormattedSubtotal()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>{getFormattedDeliveryFee()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{getFormattedTax()}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{getFormattedTotal()}</span>
            </div>
          </div>
        )}
        
        {/* Checkout form - only show if there are items in cart */}
        {items.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="font-medium text-lg mb-4">Checkout Information</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your delivery address" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Payment method */}
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
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special instructions for your order" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {items.length > 0 ? (
          <Button 
            className="w-full" 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Place Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            <CreditCard className="mr-2 h-4 w-4" />
            Checkout
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};