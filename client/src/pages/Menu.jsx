import React, { useState, useEffect } from "react";
import { apiRequest } from "../lib/queryClient";
import { MENU_SECTION } from "../lib/constants";
import { useCart } from "../hooks/useCart";
import { useCurrency } from "../hooks/useCurrency";

/**
 * Menu page component
 */
function Menu() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const { formatAmount } = useCurrency();

  // Fetch categories and menu items
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Fetch categories
        const categoriesData = await apiRequest('/api/categories');
        setCategories(categoriesData || []);
        
        if (categoriesData && categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
          
          // Fetch menu items for the first category
          const menuItemsData = await apiRequest(`/api/menu?categoryId=${categoriesData[0].id}`);
          setMenuItems(menuItemsData || []);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError(err.message);
        setIsLoading(false);
        
        // Fallback to placeholder data
        const placeholderCategories = MENU_SECTION.categories;
        const placeholderMenuItems = MENU_SECTION.items;
        
        setCategories(placeholderCategories);
        if (placeholderCategories.length > 0) {
          setActiveCategory(placeholderCategories[0].id);
          setMenuItems(placeholderMenuItems.filter(item => 
            item.categoryId === placeholderCategories[0].id
          ));
        }
      }
    };
    
    // For now, we'll use placeholder data since API is not yet implemented
    // fetchMenuData();
    const placeholderCategories = MENU_SECTION.categories;
    const placeholderMenuItems = MENU_SECTION.items;
    
    setCategories(placeholderCategories);
    if (placeholderCategories.length > 0) {
      setActiveCategory(placeholderCategories[0].id);
      setMenuItems(placeholderMenuItems.filter(item => 
        item.categoryId === placeholderCategories[0].id
      ));
    }
    setIsLoading(false);
  }, []);

  // Handle category change
  const handleCategoryChange = async (categoryId) => {
    setActiveCategory(categoryId);
    setIsLoading(true);
    
    try {
      // Fetch menu items for the selected category
      const menuItemsData = await apiRequest(`/api/menu?categoryId=${categoryId}`);
      setMenuItems(menuItemsData || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError(err.message);
      setIsLoading(false);
      
      // Fallback to placeholder data
      const placeholderMenuItems = MENU_SECTION.items;
      setMenuItems(placeholderMenuItems.filter(item => item.categoryId === categoryId));
    }
    
    // For now, we'll use placeholder data since API is not yet implemented
    const placeholderMenuItems = MENU_SECTION.items;
    setMenuItems(placeholderMenuItems.filter(item => item.categoryId === categoryId));
    setIsLoading(false);
  };

  // Handle add to cart
  const handleAddToCart = (item) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    });
  };

  // Loading state
  if (isLoading && categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Our Menu</h1>
        <div className="animate-pulse">
          <div className="h-10 bg-secondary rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((placeholder) => (
              <div key={placeholder} className="bg-secondary rounded-lg p-6">
                <div className="h-6 bg-background rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-background rounded w-full mb-4"></div>
                <div className="h-10 bg-background rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Our Menu</h1>
        <div className="text-red-500 mb-4">
          Error loading menu: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Menu</h1>
      
      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Menu Items - Grid for larger screens, List for mobile */}
      {isLoading ? (
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((placeholder) => (
              <div key={placeholder} className="bg-secondary rounded-lg p-6">
                <div className="h-6 bg-background rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-background rounded w-full mb-4"></div>
                <div className="h-10 bg-background rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      ) : menuItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-secondary rounded-lg overflow-hidden flex flex-col md:flex-row"
            >
              {/* Item Image - Only show on larger screens */}
              {item.image && (
                <div className="md:w-1/3 w-full h-48 md:h-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x300?text=Food+Item";
                    }}
                  />
                </div>
              )}
              
              {/* Item Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <span className="font-bold text-primary">
                      {formatAmount(item.price)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  {item.dietary && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.dietary.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-background rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium transition-colors"
                >
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No items available in this category.</p>
        </div>
      )}
    </div>
  );
}

export default Menu;