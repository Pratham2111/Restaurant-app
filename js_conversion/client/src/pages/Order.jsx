import { useQuery } from "@tanstack/react-query";
import { Layout } from "../components/layout/Layout";
import { Cart } from "../components/order/Cart";
import { MenuItem } from "../components/menu/MenuItem";
import { ORDER_SECTION } from "../lib/constants";
import { Skeleton } from "../components/ui/skeleton";

/**
 * Order page component
 * Displays online ordering interface with menu recommendations and cart
 */
function Order() {
  // Fetch featured menu items for recommendations
  const {
    data: featuredItems,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/menu-items/featured"],
  });
  
  return (
    <Layout>
      {/* Page header */}
      <div className="bg-muted/50 py-10 lg:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Online</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enjoy our delicious meals from the comfort of your home. 
            Place your order for delivery or pickup and experience 
            La Mason's culinary delights without leaving your door.
          </p>
        </div>
      </div>
      
      {/* Order section */}
      <div className="container py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Featured items and recommendations */}
          <div className="lg:col-span-6 xl:col-span-7">
            <h2 className="text-2xl font-semibold mb-6">Popular Choices</h2>
            
            {/* Loading state */}
            {isLoading && (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-10 w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                <p>Error loading recommendations: {error.message}</p>
              </div>
            )}
            
            {/* Featured items */}
            {featuredItems && featuredItems.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {featuredItems.map((item) => (
                  <MenuItem key={item.id} menuItem={item} />
                ))}
              </div>
            )}
            
            {/* No items state */}
            {featuredItems && featuredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No featured items available at the moment.
                </p>
              </div>
            )}
            
            {/* Order info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {ORDER_SECTION.features.map((feature, index) => (
                <div key={index} className="bg-muted/30 p-6 rounded-xl text-center">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Cart */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="bg-card rounded-xl p-6 lg:p-8 shadow-sm sticky top-20">
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Order;