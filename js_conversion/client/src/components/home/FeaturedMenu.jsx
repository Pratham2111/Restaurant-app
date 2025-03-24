import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { MENU_SECTION } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * FeaturedMenu component for the home page
 * Displays featured menu items
 */
export const FeaturedMenu = () => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  
  // Fetch featured menu items
  const { 
    data: featuredItems = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["/api/menu-items/featured"]
  });
  
  // Handle adding item to cart
  const handleAddToCart = (item) => {
    addToCart(item);
  };
  
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-12">
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
        
        {/* Featured menu items */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mb-10">
            Failed to load featured menu items
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredItems.map((item) => (
              <div key={item.id} className="rounded-lg overflow-hidden border border-border bg-card">
                {/* Item image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover"
                  />
                )}
                
                {/* Item details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="font-medium text-primary">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {item.description}
                  </p>
                  
                  {/* Add to cart button */}
                  <Button 
                    variant="outline"
                    className="w-full text-primary hover:text-primary-foreground hover:bg-primary"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* View all button */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/menu">{MENU_SECTION.button}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};