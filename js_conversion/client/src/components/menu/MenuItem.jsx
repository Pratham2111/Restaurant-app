import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { formatCurrency, convertCurrency } from "../../lib/utils";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * Individual menu item card component
 * Displays food item details and allows adding to cart
 */
export const MenuItem = ({ menuItem }) => {
  const { addToCart } = useCart();
  const { currentCurrency } = useCurrency();
  
  // Convert price to the selected currency
  const convertedPrice = convertCurrency(menuItem.price, currentCurrency.rate);
  const formattedPrice = formatCurrency(convertedPrice, currentCurrency.symbol);
  
  // Handle add to cart click
  const handleAddToCart = () => {
    addToCart(menuItem);
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Menu item image */}
      {menuItem.image && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
          />
          {menuItem.featured && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-medium">
              Featured
            </div>
          )}
        </div>
      )}
      
      {/* Menu item details */}
      <CardContent className="flex-grow pt-5 pb-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{menuItem.name}</h3>
          <span className="font-bold text-lg text-primary">{formattedPrice}</span>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {menuItem.description || "No description available."}
        </p>
      </CardContent>
      
      {/* Add to cart button */}
      <CardFooter className="pt-2 pb-4">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          variant="default"
        >
          Add to Order
        </Button>
      </CardFooter>
    </Card>
  );
};