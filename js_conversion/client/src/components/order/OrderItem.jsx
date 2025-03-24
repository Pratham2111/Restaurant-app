import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency, convertCurrency } from "../../lib/utils";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * Component for displaying a single item in the cart/order
 * Allows quantity adjustment and removal
 */
export const OrderItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { currentCurrency } = useCurrency();
  
  // Convert prices to the selected currency
  const convertedPrice = convertCurrency(item.price, currentCurrency.rate);
  const formattedPrice = formatCurrency(convertedPrice, currentCurrency.symbol);
  
  const itemTotal = convertedPrice * item.quantity;
  const formattedTotal = formatCurrency(itemTotal, currentCurrency.symbol);
  
  // Handle quantity decrease
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.menuItemId, item.quantity - 1);
    } else {
      removeFromCart(item.menuItemId);
    }
  };
  
  // Handle quantity increase
  const handleIncrease = () => {
    updateQuantity(item.menuItemId, item.quantity + 1);
  };
  
  // Handle item removal
  const handleRemove = () => {
    removeFromCart(item.menuItemId);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b">
      {/* Item image */}
      {item.image && (
        <div className="flex-shrink-0 w-full sm:w-24 h-24 rounded overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Item details */}
      <div className="flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium text-base">{item.name}</h3>
          <span className="text-sm font-medium">{formattedPrice} each</span>
        </div>
        
        {/* Quantity controls */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrease}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="w-8 text-center">{item.quantity}</span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrease}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="font-medium">{formattedTotal}</span>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={handleRemove}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};