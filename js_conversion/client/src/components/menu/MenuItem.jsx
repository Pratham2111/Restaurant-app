import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * MenuItem component
 * Displays an individual menu item with details and add to cart button
 * @param {Object} props - Component props
 * @param {Object} props.menuItem - Menu item data
 */
export const MenuItem = ({ menuItem }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  
  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(menuItem);
  };
  
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card h-full flex flex-col">
      {/* Menu item image */}
      {menuItem.image && (
        <div className="relative h-48">
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className="h-full w-full object-cover"
          />
          
          {/* Featured badge */}
          {menuItem.featured && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
      )}
      
      {/* Menu item details */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{menuItem.name}</h3>
          <span className="font-medium text-primary">
            {formatPrice(menuItem.price)}
          </span>
        </div>
        
        {/* Tags */}
        {menuItem.tags && menuItem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {menuItem.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <p className="text-muted-foreground text-sm mb-4 flex-1">
          {menuItem.description}
        </p>
        
        {/* Add to cart button */}
        <Button 
          onClick={handleAddToCart}
          variant="outline"
          className="w-full mt-auto text-primary hover:text-primary-foreground hover:bg-primary"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};