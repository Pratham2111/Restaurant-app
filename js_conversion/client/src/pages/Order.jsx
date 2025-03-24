import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "../components/layout/Layout";
import { MenuTabs } from "../components/menu/MenuTabs";
import { MenuItem } from "../components/menu/MenuItem";
import { Cart } from "../components/order/Cart";
import { Skeleton } from "../components/ui/skeleton";
import { ORDER_SECTION } from "../lib/constants";

/**
 * Order page component
 * Allows users to view menu items and add them to cart
 */
function Order() {
  const [activeCategory, setActiveCategory] = useState(1);
  
  // Fetch all menu categories
  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ["/api/categories"]
  });
  
  // Fetch menu items for the active category
  const {
    data: menuItems,
    isLoading: loadingMenuItems,
    error: menuItemsError
  } = useQuery({
    queryKey: ["/api/categories", activeCategory, "menu-items"],
    enabled: !!activeCategory
  });
  
  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };
  
  return (
    <Layout>
      {/* Order page header */}
      <div className="bg-muted/30 py-12">
        <div className="container text-center">
          <h3 className="text-primary font-medium mb-2">
            {ORDER_SECTION.subtitle}
          </h3>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {ORDER_SECTION.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {ORDER_SECTION.description}
          </p>
        </div>
      </div>
      
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Menu selection */}
          <div className="lg:col-span-2">
            {/* Menu category tabs */}
            <div className="mb-10">
              {loadingCategories ? (
                <div className="flex justify-center">
                  <Skeleton className="h-10 w-full max-w-2xl" />
                </div>
              ) : categoriesError ? (
                <div className="text-center text-red-500">
                  Failed to load menu categories
                </div>
              ) : (
                <MenuTabs 
                  categories={categories || []} 
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />
              )}
            </div>
            
            {/* Menu items */}
            {loadingMenuItems ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-24 w-24 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : menuItemsError ? (
              <div className="text-center text-red-500 py-10">
                Failed to load menu items
              </div>
            ) : menuItems && menuItems.length > 0 ? (
              <div className="space-y-6">
                {menuItems.map((item) => (
                  <MenuItem key={item.id} menuItem={item} />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                No menu items found in this category.
              </div>
            )}
          </div>
          
          {/* Cart */}
          <div className="lg:sticky lg:top-6 self-start">
            <Cart />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Order;