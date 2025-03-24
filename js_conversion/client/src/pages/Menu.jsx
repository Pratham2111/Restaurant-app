import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "../components/layout/Layout";
import { MenuTabs } from "../components/menu/MenuTabs";
import { Skeleton } from "../components/ui/skeleton";
import { MENU_SECTION } from "../lib/constants";

/**
 * Menu page component
 * Displays restaurant menu categories and items
 */
function Menu() {
  const [activeCategory, setActiveCategory] = useState(null);
  
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
            {MENU_SECTION.subtitle}
          </h3>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {MENU_SECTION.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {MENU_SECTION.description}
          </p>
        </div>
      </div>
      
      {/* Menu content */}
      <div className="container py-12 md:py-16">
        {loadingCategories ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-16 w-full" />
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
    </Layout>
  );
}

export default Menu;