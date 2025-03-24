import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { OrderItem } from "./OrderItem";
import { formatCurrency } from "../../lib/utils";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * Shopping cart component that displays all items and order summary
 */
export const Cart = () => {
  const { items, getSubtotal, getDeliveryFee, getTax, getTotal, clearCart } = useCart();
  const { currentCurrency } = useCurrency();
  
  // Format monetary values with the current currency
  const formattedSubtotal = formatCurrency(getSubtotal(), currentCurrency.symbol);
  const formattedDeliveryFee = formatCurrency(getDeliveryFee(), currentCurrency.symbol);
  const formattedTax = formatCurrency(getTax(), currentCurrency.symbol);
  const formattedTotal = formatCurrency(getTotal(), currentCurrency.symbol);
  
  // Handle clear cart button click
  const handleClearCart = () => {
    clearCart();
  };
  
  // Empty cart state
  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Your Cart</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
          <p className="text-sm text-muted-foreground">
            Add some delicious items from our menu to get started!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Your Cart</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            className="text-destructive"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Cart items */}
        <div className="space-y-1">
          {items.map((item) => (
            <OrderItem key={item.menuItemId} item={item} />
          ))}
        </div>
        
        {/* Order summary */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formattedSubtotal}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>{formattedDeliveryFee}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>{formattedTax}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-primary">{formattedTotal}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" size="lg">
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};