import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "../ui/button";
import { MenuItem } from "../menu/MenuItem";
import { Skeleton } from "../ui/skeleton";
import { ChevronRight } from "lucide-react";
import { MENU_SECTION } from "../../lib/constants";

/**
 * FeaturedMenu component
 * Displays featured menu items on the homepage
 */
export const FeaturedMenu = () => {
  // Fetch featured menu items
  const {
    data: featuredItems = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/menu-items/featured"]
  });
  
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-primary font-medium mb-2">
            {MENU_SECTION.subtitle}
          </h3>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {MENU_SECTION.title}
          </h2>
          
          <p className="text-muted-foreground">
            {MENU_SECTION.description}
          </p>
        </div>
        
        {/* Featured menu items grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
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
            Failed to load featured menu items. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredItems.map((item) => (
              <MenuItem key={item.id} menuItem={item} />
            ))}
          </div>
        )}
        
        {/* View full menu button */}
        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/menu">
              View Full Menu
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};