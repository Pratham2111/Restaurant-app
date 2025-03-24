import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MenuItem } from "./MenuItem";
import { Skeleton } from "../ui/skeleton";

/**
 * MenuTabs component for the menu page
 * Displays menu items categorized in tabs
 */
export const MenuTabs = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Fetch menu items
  const {
    data: menuItems,
    isLoading: menuItemsLoading,
    error: menuItemsError
  } = useQuery({
    queryKey: ["/api/menu-items"],
  });

  // Set first category as active when data loads
  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id.toString());
    }
  }, [categories, activeCategory]);

  // Loading state
  if (categoriesLoading || menuItemsLoading) {
    return (
      <div className="container py-10">
        {/* Loading skeleton for tabs */}
        <div className="mb-8 flex justify-center">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Loading skeleton for menu items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      </div>
    );
  }

  // Error state
  if (categoriesError || menuItemsError) {
    return (
      <div className="container py-16 text-center">
        <p className="text-red-500 mb-4">
          Unable to load menu items. Please try again later.
        </p>
        <p className="text-muted-foreground">
          {categoriesError?.message || menuItemsError?.message}
        </p>
      </div>
    );
  }

  // Filter menu items by category
  const getItemsByCategory = (categoryId) => {
    if (!menuItems) return [];
    return menuItems.filter(
      (item) => item.categoryId === parseInt(categoryId)
    );
  };

  return (
    <div className="container py-10">
      <Tabs
        defaultValue={activeCategory}
        value={activeCategory} 
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-flow-col gap-2 overflow-x-auto auto-cols-max p-1">
            {categories?.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id.toString()}
                className="px-6 py-2 rounded-full"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories?.map((category) => (
          <TabsContent key={category.id} value={category.id.toString()} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getItemsByCategory(category.id).map((item) => (
                <MenuItem key={item.id} menuItem={item} />
              ))}
            </div>
            
            {getItemsByCategory(category.id).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No items available in this category at the moment.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};