import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { formatCurrency } from "@/lib/utils";

export const OrderItem = ({ item, onRemove, onUpdateQuantity }) => {
  const { currentCurrency } = useCurrency();
  
  // Format currency with the current currency symbol
  const formatWithCurrency = (amount) => {
    return formatCurrency(amount, currentCurrency?.symbol || "$");
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    } else {
      onRemove();
    }
  };
  
  const handleIncrease = () => {
    onUpdateQuantity(item.quantity + 1);
  };
  
  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-3 flex items-start">
        {/* Item Image (if available) */}
        {item.image && (
          <div className="flex-shrink-0 mr-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded object-cover"
            />
          </div>
        )}
        
        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium truncate">{item.name}</h4>
              <div className="text-sm text-muted-foreground mt-1">
                {formatWithCurrency(item.price)} x {item.quantity}
              </div>
            </div>
            <div className="text-sm font-medium">
              {formatWithCurrency(item.price * item.quantity)}
            </div>
          </div>
          
          {/* Quantity Controls */}
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
              
              <span className="w-8 text-center">{item.quantity}</span>
              
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleIncrease}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};