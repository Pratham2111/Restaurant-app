import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FoodPreview3D } from './food-preview-3d';
import { Plus, Eye } from 'lucide-react';
import type { MenuItem } from '@shared/schema';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-square">
            <img
              src={item.imageUrl || 'https://placehold.co/400x400/jpeg'}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View 3D preview</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">${Number(item.price).toFixed(2)}</span>
            {onAddToCart && (
              <Button variant="outline" size="sm" onClick={() => onAddToCart(item)}>
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <FoodPreview3D />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
