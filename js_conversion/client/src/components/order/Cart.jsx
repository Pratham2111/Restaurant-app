import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "wouter";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { OrderItem } from "./OrderItem";
import { Separator } from "../ui/separator";
import { useToast } from "../../hooks/use-toast";
import { useCart } from "../../hooks/useCart";
import { apiRequest } from "../../lib/queryClient";

/**
 * Cart component for the order page
 * Shows cart items and checkout form
 */
export const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    items,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    getItemCount,
    formatSubtotal,
    formatDeliveryFee,
    formatTax,
    formatTotal
  } = useCart();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    instructions: "",
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Mutation for placing order
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      return await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed. You will receive a confirmation shortly.",
      });
      
      clearCart();
      navigate("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: error.message || "There was a problem with your order. Please try again.",
      });
    },
  });
  
  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
      });
      return;
    }
    
    const order = {
      ...formData,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: getSubtotal(),
      tax: getTax(),
      deliveryFee: getDeliveryFee(),
      total: getTotal(),
    };
    
    mutate(order);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Order</h2>
      
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => navigate("/menu")}>Browse Menu</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Cart items */}
          <div className="mb-8 space-y-4">
            {items.map((item) => (
              <OrderItem key={item.menuItemId} item={item} />
            ))}
          </div>
          
          {/* Order summary */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({getItemCount()} items)</span>
                <span>{formatSubtotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatDeliveryFee()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatTax()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatTotal()}</span>
              </div>
            </div>
          </div>
          
          {/* Delivery information */}
          <div className="space-y-6 mb-6">
            <h3 className="font-semibold">Delivery Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="block mb-2">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="block mb-2">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone" className="block mb-2">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="address" className="block mb-2">Delivery Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street Address, City, State, Zip Code"
                rows={2}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="instructions" className="block mb-2">
                Delivery Instructions <span className="text-muted-foreground text-sm">(Optional)</span>
              </Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Add any special instructions for delivery"
                rows={2}
              />
            </div>
          </div>
          
          {/* Place order button */}
          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? "Processing..." : "Place Order"}
          </Button>
        </form>
      )}
    </div>
  );
};