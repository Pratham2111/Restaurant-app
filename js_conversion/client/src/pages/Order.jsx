import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { MenuItem } from "../components/menu/MenuItem";
import { Cart } from "../components/order/Cart";
import { Input } from "../components/ui/input";
import { ORDER_SECTION } from "../lib/constants";

const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch all menu items
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["/api/menu-items"],
  });
  
  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{ORDER_SECTION.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {ORDER_SECTION.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu items section */}
        <div className="lg:col-span-2">
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search menu items..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Menu items grid */}
          {isLoading ? (
            <div className="text-center py-8">Loading menu items...</div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No menu items found matching "{searchTerm}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMenuItems.map((item) => (
                <MenuItem key={item.id} menuItem={item} />
              ))}
            </div>
          )}
        </div>
        
        {/* Cart section */}
        <div className="lg:sticky lg:top-20 h-fit">
          <Cart />
        </div>
      </div>
    </div>
  );
};

export default Order;