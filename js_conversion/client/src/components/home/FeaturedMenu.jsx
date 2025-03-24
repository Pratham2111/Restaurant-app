import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { MENU_SECTION } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * FeaturedMenu component for the homepage
 * Displays featured menu items from the restaurant
 */
export const FeaturedMenu = () => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  
  // Fetch featured menu items 
  const { 
    data: featuredItems,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/menu-items/featured"]
  });
  
  // Handle adding an item to the cart
  const handleAddToCart = (item) => {
    addToCart(item);
  };
  
  return (
    <div className="container">
      {/* Section header */}
      <div className="text-center mb-10 md:mb-16">
        <h3 className="text-primary font-medium mb-2">
          {MENU_SECTION.subtitle}
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {MENU_SECTION.title}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {MENU_SECTION.description}
        </p>
      </div>
      
      {/* Menu items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
        {isLoading && (
          // Loading skeletons
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))
        )}
        
        {error && (
          <div className="col-span-full text-center py-10">
            <p className="text-red-500 mb-2">Failed to load menu items</p>
            <p className="text-muted-foreground">
              Please try again later or contact support.
            </p>
          </div>
        )}
        
        {featuredItems && featuredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.image && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
            )}
            
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-1">{item.name}</h3>
              <p className="text-primary font-medium mb-3">
                {formatPrice(item.price)}
              </p>
              <p className="text-muted-foreground text-sm line-clamp-3">
                {item.description}
              </p>
            </CardContent>
            
            <CardFooter className="p-6 pt-0 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
              >
                <Link href={`/menu/${item.id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* View full menu button */}
      <div className="text-center">
        <Button asChild>
          <Link href="/menu">
            View Full Menu
          </Link>
        </Button>
      </div>
    </div>
  );
};