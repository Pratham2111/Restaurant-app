import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItem } from "@/components/menu/MenuItem";
import { Skeleton } from "@/components/ui/skeleton";

export const MenuTabs = () => {
  const [activeCategory, setActiveCategory] = useState("");

  // Fetch all categories
  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Fetch all menu items
  const {
    data: menuItems = [],
    isLoading: menuItemsLoading
  } = useQuery({
    queryKey: ["/api/menu-items"],
  });

  // Set first category as active once loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id.toString());
    }
  }, [categories, activeCategory]);

  // Group menu items by category
  const getMenuItemsByCategory = (categoryId) => {
    return menuItems.filter(item => item.categoryId === parseInt(categoryId));
  };

  // Loading skeleton
  if (categoriesLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center">
          <div className="space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[300px] rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Tabs
      value={activeCategory}
      onValueChange={setActiveCategory}
      className="w-full"
    >
      <div className="flex justify-center mb-8">
        <TabsList className="bg-muted/50">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id.toString()}
              className="px-6"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id.toString()}>
          {menuItemsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[300px] rounded-md" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getMenuItemsByCategory(category.id.toString()).map((menuItem) => (
                <MenuItem key={menuItem.id} menuItem={menuItem} />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};