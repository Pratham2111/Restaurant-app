import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MenuItem } from "./MenuItem";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

/**
 * MenuTabs component
 * Displays menu categories and items in tabs
 * @param {Object} props - Component props
 * @param {Array} props.categories - List of menu categories
 * @param {number} props.activeCategory - Currently active category ID
 * @param {Function} props.setActiveCategory - Function to set active category
 */
export const MenuTabs = ({ categories, activeCategory, setActiveCategory }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Fetch menu items for the active category
  const {
    data: menuItems = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/categories", activeCategory, "menu-items"],
    queryFn: () => {
      if (!activeCategory) return [];
      return fetch(`/api/categories/${activeCategory}/menu-items`).then(res => res.json());
    },
    enabled: !!activeCategory
  });
  
  // Filter menu items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(menuItems);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = menuItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
    
    setFilteredItems(filtered);
  }, [searchQuery, menuItems]);
  
  // Handle tab change
  const handleTabChange = (value) => {
    setActiveCategory(Number(value));
    setSearchQuery("");
  };
  
  return (
    <div>
      {/* Search input */}
      <div className="relative mb-8 max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search menu items..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Category tabs */}
      <Tabs 
        value={activeCategory?.toString()} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-flow-col auto-cols-max gap-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id.toString()}
                className="px-4 py-2"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* Tab content */}
        {categories.map((category) => (
          <TabsContent 
            key={category.id} 
            value={category.id.toString()} 
            className="mt-0"
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
              <div className="text-center text-red-500 py-12">
                Failed to load menu items. Please try again later.
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery ? "No items match your search." : "No items in this category."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <MenuItem key={item.id} menuItem={item} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};