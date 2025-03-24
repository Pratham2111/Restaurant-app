import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useCurrency } from "@/hooks/useCurrency";
import { formatCurrency, convertCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const MenuItem = ({ menuItem }) => {
  const { addToCart } = useCart();
  const { currentCurrency } = useCurrency();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(menuItem);
    
    toast({
      title: "Added to cart",
      description: `${menuItem.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Image Section */}
      <div className="relative h-48">
        <img
          src={menuItem.image}
          alt={menuItem.name}
          className="w-full h-full object-cover"
        />
        {menuItem.featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">Featured</Badge>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2">{menuItem.name}</h3>
        <p className="text-gray-600 mb-4 flex-1">{menuItem.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">
            {formatCurrency(
              convertCurrency(menuItem.price, currentCurrency?.rate || 1),
              currentCurrency?.symbol || "$"
            )}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};