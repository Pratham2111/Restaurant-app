import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";
import { truncateText } from "../../lib/utils";

/**
 * MenuItem component for displaying a menu item
 * @param {Object} props - Component props
 * @param {Object} props.menuItem - Menu item data
 */
export const MenuItem = ({ menuItem }) => {
  const { addToCart } = useCart();
  const { formatConvertedPrice } = useCurrency();
  
  // Handle add to cart button click
  const handleAddToCart = () => {
    addToCart(menuItem);
  };
  
  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      {/* Item image */}
      {menuItem.image && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {menuItem.featured && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
      )}
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{menuItem.name}</h3>
          <div className="text-lg font-bold text-primary">
            {formatConvertedPrice(menuItem.price)}
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4 flex-1">
          {truncateText(menuItem.description, 120)}
        </p>
        
        {/* Item attributes */}
        {(menuItem.vegetarian || menuItem.vegan || menuItem.glutenFree || menuItem.spicy) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {menuItem.vegetarian && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Vegetarian
              </span>
            )}
            {menuItem.vegan && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Vegan
              </span>
            )}
            {menuItem.glutenFree && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Gluten Free
              </span>
            )}
            {menuItem.spicy && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                Spicy
              </span>
            )}
          </div>
        )}
        
        <Button
          onClick={handleAddToCart}
          className="w-full gap-1 mt-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Add to Order
        </Button>
      </CardContent>
    </Card>
  );
};