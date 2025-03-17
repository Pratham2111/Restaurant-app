import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, ChefHat, Flame, Wheat, Scale } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { motion } from "framer-motion";

interface DishDetailsDialogProps {
  dish: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DishDetailsDialog({ dish, open, onOpenChange }: DishDetailsDialogProps) {
  if (!dish) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{dish.name}</DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            {dish.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={dish.imageUrl} 
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-restaurant-yellow" />
                <span className="text-sm">{dish.preparationTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-restaurant-yellow" />
                <span className="text-sm">{dish.spicyLevel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-restaurant-yellow" />
                <span className="text-sm">{dish.servingSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wheat className="w-4 h-4 text-restaurant-yellow" />
                <span className="text-sm">Contains allergens</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-restaurant-yellow" />
                Chef's Story
              </h3>
              <p className="text-muted-foreground">{dish.chefsStory}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <ul className="grid grid-cols-2 gap-2">
                {dish.ingredients?.map((ingredient, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Nutrition Information</h3>
              <ul className="space-y-1">
                {dish.nutritionInfo?.map((info, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {info}
                  </li>
                ))}
              </ul>
            </div>

            {dish.allergens && dish.allergens.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Allergens</h3>
                <div className="flex flex-wrap gap-2">
                  {dish.allergens.map((allergen, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            size="lg"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
