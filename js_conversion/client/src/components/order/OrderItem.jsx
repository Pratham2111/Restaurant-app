import { Minus, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { useCart } from "../../hooks/useCart";

/**
 * OrderItem component for cart
 * Displays a single menu item in the cart with quantity controls
 * @param {Object} props - Component props
 * @param {Object} props.item - Cart item data
 * @param {Function} props.onRemove - Remove item handler
 * @param {Function} props.onUpdateQuantity - Update quantity handler
 */
export const OrderItem = ({ item, onRemove, onUpdateQuantity }) => {
  const { formatItemPrice, formatItemPriceWithQuantity } = useCart();
  
  // Handle quantity increase
  const handleIncrease = () => {
    onUpdateQuantity(item.quantity + 1);
  };
  
  // Handle quantity decrease
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    } else {
      onRemove();
    }
  };
  
  return (
    <div className="flex items-start gap-2">
      {/* Item image */}
      {item.image && (
        <div className="h-14 w-14 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      {/* Item details */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-medium text-sm">{item.name}</h4>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 -mr-2 -mt-1 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          {/* Quantity controls */}
          <div className="flex items-center border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 p-0 rounded-none" 
              onClick={handleDecrease}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-7 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 p-0 rounded-none" 
              onClick={handleIncrease}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Item price */}
          <div className="text-sm">
            <span className="font-medium">
              {formatItemPriceWithQuantity(item.price, item.quantity)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              ({formatItemPrice(item.price)} each)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};