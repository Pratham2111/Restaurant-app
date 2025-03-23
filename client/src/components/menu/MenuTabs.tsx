import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItem, Category } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuItem as MenuItemComponent } from "./MenuItem";

export const MenuTabs = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Set default active tab once categories are loaded
  if (categories && categories.length > 0 && !activeTab) {
    setActiveTab(categories[0].id.toString());
  }
  
  const { data: menuItems, isLoading: isLoadingMenuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/categories", activeTab, "menu-items"],
    queryFn: async () => {
      if (!activeTab) return [];
      const res = await fetch(`/api/categories/${activeTab}/menu-items`);
      if (!res.ok) throw new Error("Failed to fetch menu items");
      return res.json();
    },
    enabled: !!activeTab,
  });
  
  return (
    <div className="container mx-auto px-4 py-10">
      {isLoadingCategories ? (
        <div className="flex justify-center mb-8">
          <Skeleton className="h-12 w-3/4 md:w-2/3 lg:w-1/2" />
        </div>
      ) : (
        <Tabs 
          defaultValue={activeTab || "1"} 
          value={activeTab || "1"}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              {categories?.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id.toString()}
                  className="text-sm md:text-base"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {categories?.map((category) => (
            <TabsContent key={category.id} value={category.id.toString()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoadingMenuItems ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="flex bg-white rounded-lg shadow-md p-4">
                      <Skeleton className="w-24 h-24 rounded-md mr-4" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-32 mb-1" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-8 w-28" />
                      </div>
                    </div>
                  ))
                ) : (
                  menuItems?.map((item) => (
                    <MenuItemComponent key={item.id} menuItem={item} />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
