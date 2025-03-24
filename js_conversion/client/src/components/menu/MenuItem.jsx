import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * MenuItem component for displaying a single menu item
 * @param {Object} props - Component props
 * @param {Object} props.menuItem - Menu item data
 */
export const MenuItem = ({ menuItem }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  
  // Handle adding item to cart
  const handleAddToCart = () => {
    addToCart(menuItem);
  };
  
  return (
    <div className="flex gap-4">
      {/* Menu item image */}
      {menuItem.image && (
        <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden">
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      {/* Menu item content */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg">{menuItem.name}</h3>
          <span className="font-medium text-primary">
            {formatPrice(menuItem.price)}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-3">
          {menuItem.description}
        </p>
        
        {/* Add to cart button */}
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary-foreground hover:bg-primary"
            onClick={handleAddToCart}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};