import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCart } from "../../hooks/useCart";

/**
 * OrderItem component
 * Displays an individual item in the cart with quantity controls
 * @param {Object} props - Component props
 * @param {Object} props.item - Cart item data
 */
export const OrderItem = ({ item }) => {
  const { removeFromCart, updateQuantity, formatItemPrice } = useCart();

  // Handle removing item from cart
  const handleRemove = () => {
    removeFromCart(item.menuItemId);
  };

  // Handle decreasing quantity
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.menuItemId, item.quantity - 1);
    } else {
      removeFromCart(item.menuItemId);
    }
  };

  // Handle increasing quantity
  const handleIncrease = () => {
    updateQuantity(item.menuItemId, item.quantity + 1);
  };

  return (
    <div className="flex items-start gap-4 border border-border rounded-md p-3">
      {/* Item image */}
      {item.image && (
        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      {/* Item details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h4 className="font-medium truncate">{item.name}</h4>
          <span className="font-medium text-primary ml-2 whitespace-nowrap">
            {formatItemPrice(item.price, item.quantity)}
          </span>
        </div>
        
        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7"
              onClick={handleDecrease}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="w-6 text-center">{item.quantity}</span>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7"
              onClick={handleIncrease}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Remove button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};