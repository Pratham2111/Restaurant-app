import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { OrderItem } from "./OrderItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";

export const Cart = () => {
  const { 
    items, 
    getFormattedSubtotal, 
    getFormattedDeliveryFee, 
    getFormattedTax, 
    getFormattedTotal,
    getSubtotal,
    getTotal,
    clearCart
  } = useCart();
  
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    try {
      const orderData = {
        name: checkoutForm.name,
        email: checkoutForm.email,
        phone: checkoutForm.phone,
        address: checkoutForm.address,
        total: getTotal(),
        paymentMethod: "Credit Card",
        items: items
      };
      
      await apiRequest("POST", "/api/orders", orderData);
      
      toast({
        title: "Order Submitted Successfully",
        description: "Your order has been placed. Expect delivery within 30-45 minutes.",
      });
      
      clearCart();
      setShowCheckout(false);
      setCheckoutForm({
        name: "",
        email: "",
        phone: "",
        address: ""
      });
      
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: "There was a problem submitting your order. Please try again.",
        variant: "destructive",
      });
      console.error("Order error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isFormValid = () => {
    return (
      checkoutForm.name.trim() !== "" &&
      checkoutForm.email.trim() !== "" &&
      checkoutForm.phone.trim() !== "" &&
      checkoutForm.address.trim() !== ""
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <h3 className="text-xl font-bold mb-4 font-display">Your Order</h3>
      
      {items.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-gray-500">Your cart is empty</p>
          <p className="text-sm text-gray-400 mt-2">Add items from the menu to get started</p>
        </div>
      ) : (
        <>
          <div className="border-t border-b border-gray-200 max-h-[400px] overflow-y-auto">
            {items.map((item) => (
              <OrderItem key={item.menuItemId} item={item} />
            ))}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{getFormattedSubtotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium">{getFormattedDeliveryFee()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-medium">{getFormattedTax()}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{getFormattedTotal()}</span>
            </div>
          </div>
          
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-primary hover:bg-opacity-90 text-white font-bold mt-6"
                disabled={items.length === 0 || getSubtotal() === 0}
              >
                Proceed to Checkout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Complete Your Order</DialogTitle>
                <DialogDescription>
                  Fill in your details to complete your order.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={checkoutForm.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={checkoutForm.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={checkoutForm.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={checkoutForm.address}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCheckout} 
                  disabled={!isFormValid() || isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Complete Order"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <div className="text-center text-sm text-gray-600 mt-4">
            <p>Estimated delivery time: 30-45 minutes</p>
          </div>
        </>
      )}
    </div>
  );
};
