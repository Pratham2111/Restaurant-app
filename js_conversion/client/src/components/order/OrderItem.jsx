import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCart } from "../../hooks/useCart";

/**
 * OrderItem component for displaying an item in the cart
 * @param {Object} props - Component props
 * @param {Object} props.item - Cart item data
 */
export const OrderItem = ({ item }) => {
  const { updateQuantity, removeFromCart, formatItemPrice } = useCart();
  
  // Handle quantity update
  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.menuItemId);
    } else {
      updateQuantity(item.menuItemId, newQuantity);
    }
  };
  
  // Handle remove item
  const handleRemoveItem = () => {
    removeFromCart(item.menuItemId);
  };
  
  return (
    <div className="flex items-start gap-4 bg-card/50 p-4 rounded-lg">
      {/* Item image */}
      {item.image && (
        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Item details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-base truncate">{item.name}</h4>
            <p className="text-sm text-muted-foreground">
              {formatItemPrice(item.price)}
            </p>
          </div>
          
          {/* Remove button (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive md:hidden"
            onClick={handleRemoveItem}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2 w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Item total price */}
          <div className="font-medium">
            {formatItemPrice(item.price * item.quantity)}
          </div>
          
          {/* Remove button (desktop) */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hidden md:flex"
            onClick={handleRemoveItem}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};