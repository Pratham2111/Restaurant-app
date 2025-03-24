import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { MENU_SECTION } from "@/lib/constants";
import { useCart } from "@/hooks/useCart";
import { useCurrency } from "@/hooks/useCurrency";
import { formatCurrency, convertCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ChevronRight } from "lucide-react";

export const FeaturedMenu = () => {
  const { addToCart } = useCart();
  const { currentCurrency } = useCurrency();
  
  const { data: featuredItems = [], isLoading } = useQuery({
    queryKey: ["/api/menu-items/featured"],
  });
  
  const handleAddToCart = (item) => {
    addToCart(item);
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            {MENU_SECTION.heading}
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            {MENU_SECTION.description}
          </p>
        </div>
        
        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Featured menu items
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">
                      {formatCurrency(
                        convertCurrency(item.price, currentCurrency?.rate || 1),
                        currentCurrency?.symbol || "$"
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* View Full Menu Button */}
        <div className="mt-12 text-center">
          <Link href="/menu">
            <Button variant="outline" size="lg" className="font-medium">
              View Full Menu
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};