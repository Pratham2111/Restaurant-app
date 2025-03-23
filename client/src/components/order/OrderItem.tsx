import { useCurrency } from "@/hooks/useCurrency";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@shared/schema";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItemProps {
  item: CartItem;
}

export const OrderItem = ({ item }: OrderItemProps) => {
  const { formatPrice } = useCurrency();
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.menuItemId, item.quantity - 1);
    } else {
      removeFromCart(item.menuItemId);
    }
  };
  
  const handleIncrease = () => {
    updateQuantity(item.menuItemId, item.quantity + 1);
  };
  
  const handleRemove = () => {
    removeFromCart(item.menuItemId);
  };
  
  return (
    <div className="flex justify-between items-start py-4 border-b border-gray-200">
      <div className="flex items-start">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md mr-3"
          />
        )}
        <div>
          <h4 className="font-medium">{item.name}</h4>
          <div className="flex items-center mt-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={handleDecrease}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={handleIncrease}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
        <button
          className="text-xs text-red-500 hover:text-red-700 mt-2 flex items-center"
          onClick={handleRemove}
        >
          <Trash2 className="h-3 w-3 mr-1" /> Remove
        </button>
      </div>
    </div>
  );
};
