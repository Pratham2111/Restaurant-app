import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { MENU_SECTION } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";
import { apiRequest } from "../../lib/queryClient";
import { generatePlaceholderImage } from "../../lib/utils";

/**
 * FeaturedMenu section component for the home page
 */
function FeaturedMenu() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const { formatAmount } = useCurrency();
  
  // Fetch featured menu items
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        // API integration will be implemented later
        // For now use the placeholder data without making API calls
        // Uncomment the next line when API is ready
        // const data = await apiRequest('/api/menu/featured');
        // setFeaturedItems(data || []);
        
        // Use placeholder data
        setFeaturedItems(MENU_SECTION.featuredItems);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching featured menu items:", err);
        setError(err.message);
        setIsLoading(false);
        
        // Fallback to placeholder data
        setFeaturedItems(MENU_SECTION.featuredItems);
      }
    };
    
    // Execute the function safely
    fetchFeaturedItems().catch(err => {
      console.error("Unhandled error in fetchFeaturedItems:", err);
      setError("Failed to load menu items. Please try again later.");
      setFeaturedItems(MENU_SECTION.featuredItems);
      setIsLoading(false);
    });
  }, []);

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
  if (isLoading) {
    return (
      <div className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Loading Menu Items...</h2>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((placeholder) => (
                <div key={placeholder} className="bg-background rounded-lg shadow-md p-6">
                  <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Menu</h2>
          <div className="text-red-500 mb-4">
            Error loading menu items: {error}
          </div>
          <Link href="/menu">
            <span className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors inline-block cursor-pointer">
              View Full Menu
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{MENU_SECTION.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {MENU_SECTION.description}
          </p>
        </div>
        
        {/* Featured Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Item Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = generatePlaceholderImage(item.name || "Food Item", 400, 300);
                  }}
                />
              </div>
              
              {/* Item Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <span className="font-bold text-primary">
                    {formatAmount(item.price)}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  {item.description}
                </p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium transition-colors"
                >
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* View Full Menu Button */}
        <div className="text-center mt-12">
          <Link href="/menu">
            <span className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors inline-block cursor-pointer">
              View Full Menu
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedMenu;