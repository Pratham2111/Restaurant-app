import { useState } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { useCart } from "@/hooks/useCart";
import { MenuItem as MenuItemType } from "@shared/schema";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MenuItemProps {
  menuItem: MenuItemType;
}

export const MenuItem = ({ menuItem }: MenuItemProps) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    addToCart(menuItem, 1);
    toast({
      title: "Added to Order",
      description: `${menuItem.name} has been added to your order.`,
      duration: 2000,
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 flex transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={menuItem.image} 
        alt={menuItem.name} 
        className="w-24 h-24 rounded-md object-cover mr-4"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold font-display">{menuItem.name}</h3>
          <span className="text-primary font-medium">{formatPrice(menuItem.price)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{menuItem.description}</p>
        <Button 
          variant="secondary"
          size="sm"
          className="text-sm text-white"
          onClick={handleAddToCart}
        >
          <Plus className="h-4 w-4 mr-1" /> Add to Order
        </Button>
      </div>
    </div>
  );
};
