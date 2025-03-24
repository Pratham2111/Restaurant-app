import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { MenuItem } from "./MenuItem";

/**
 * MenuTabs component
 * Displays categories and menu items in tabs
 * @param {Object} props - Component props
 * @param {Array} props.categories - Array of categories
 * @param {number|null} props.activeCategory - Currently active category ID
 * @param {Function} props.setActiveCategory - Function to set active category
 */
export const MenuTabs = ({ categories, activeCategory, setActiveCategory }) => {
  // Fetch menu items for active category
  const {
    data: menuItems = [],
    isLoading: loadingItems,
    error: menuItemsError
  } = useQuery({
    queryKey: ["/api/menu-items/category", activeCategory],
    enabled: !!activeCategory
  });
  
  // Convert activeCategory to string for Tabs component
  const activeTab = activeCategory ? activeCategory.toString() : "";
  
  // Handle tab change
  const handleTabChange = (value) => {
    setActiveCategory(parseInt(value, 10));
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      {/* Category tabs */}
      <TabsList className="mb-8 flex flex-wrap h-auto justify-start bg-transparent p-0 space-x-2">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id.toString()}
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Tab contents */}
      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id.toString()}>
          {loadingItems ? (
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
          ) : menuItemsError ? (
            <div className="text-center text-red-500 py-12">
              Failed to load menu items. Please try again later.
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No items available in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <MenuItem key={item.id} menuItem={item} />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};