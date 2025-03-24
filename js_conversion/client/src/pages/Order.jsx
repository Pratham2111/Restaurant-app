import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "../components/layout/Layout";
import { MenuTabs } from "../components/menu/MenuTabs";
import { Cart } from "../components/order/Cart";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ShoppingCart, UtensilsCrossed } from "lucide-react";
import { ORDER_SECTION } from "../lib/constants";

/**
 * Order page component
 * Allows customers to order food online
 */
function Order() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("menu");
  
  // Fetch all categories
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ["/api/categories"]
  });
  
  // Set initial active category when categories are loaded
  if (categories.length > 0 && !activeCategory) {
    setActiveCategory(categories[0].id);
  }
  
  return (
    <Layout>
      {/* Page header */}
      <div className="bg-muted/30 py-16">
        <div className="container text-center">
          <h3 className="text-primary font-medium mb-2">
            {ORDER_SECTION.subtitle}
          </h3>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {ORDER_SECTION.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {ORDER_SECTION.description}
          </p>
        </div>
      </div>
      
      {/* Order content */}
      <div className="container py-12 md:py-16">
        {/* Tabs to switch between menu and cart */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8 md:hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Order content with menu and cart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Menu section */}
          <div className={`col-span-2 ${activeTab !== "menu" ? "hidden md:block" : ""}`}>
            {loadingCategories ? (
              <div className="flex flex-col gap-6">
                <Skeleton className="h-16 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
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
              </div>
            ) : categoriesError ? (
              <div className="text-center text-red-500 py-12">
                Failed to load menu categories. Please try again later.
              </div>
            ) : (
              <MenuTabs 
                categories={categories} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
              />
            )}
          </div>
          
          {/* Cart section */}
          <div className={`md:col-span-1 ${activeTab !== "cart" ? "hidden md:block" : ""}`}>
            <Cart />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Order;