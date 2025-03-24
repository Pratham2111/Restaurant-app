import React, { useState, useEffect } from "react";
import { apiRequest } from "../lib/queryClient";
import { ORDER_SECTION } from "../lib/constants";
import { useCart } from "../hooks/useCart";
import { useCurrency } from "../hooks/useCurrency";
import { useToast } from "../hooks/use-toast.jsx";
import { isValidEmail, isValidPhone } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";

/**
 * Order page component
 */
function Order() {
  const { toast } = useToast();
  const { 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    cartCount,
    formattedSubtotal,
    formattedDeliveryFee,
    formattedTax,
    formattedTotal
  } = useCart();
  const { formatAmount } = useCurrency();
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  
  // Categories and menu items
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [menuError, setMenuError] = useState(null);
  
  // Order form
  const [orderType, setOrderType] = useState("delivery");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "card",
    notes: "",
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Order states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderReference, setOrderReference] = useState("");

  // Autofill form with user data when authenticated
  useEffect(() => {
    if (user && !authLoading) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      }));
    }
  }, [user, authLoading]);
  
  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, authLoading, navigate, toast]);

  // Fetch categories and menu items
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // API integration will be implemented later
        // For now use the placeholder data without making API calls
        // Uncomment the below code when API is ready
        /*
        // Fetch categories
        const categoriesData = await apiRequest('/api/categories');
        setCategories(categoriesData || []);
        
        if (categoriesData && categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
          
          // Fetch menu items for the first category
          const menuItemsData = await apiRequest(`/api/menu?categoryId=${categoriesData[0].id}`);
          setMenuItems(menuItemsData || []);
        }
        */
        
        // Use placeholder data
        const placeholderCategories = ORDER_SECTION.categories;
        const placeholderMenuItems = ORDER_SECTION.items;
        
        setCategories(placeholderCategories);
        if (placeholderCategories.length > 0) {
          setActiveCategory(placeholderCategories[0].id);
          setMenuItems(placeholderMenuItems.filter(item => 
            item.categoryId === placeholderCategories[0].id
          ));
        }
        
        setIsLoadingMenu(false);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setMenuError(err.message);
        setIsLoadingMenu(false);
        
        // Use placeholder data if error occurs
        const placeholderCategories = ORDER_SECTION.categories;
        const placeholderMenuItems = ORDER_SECTION.items;
        
        setCategories(placeholderCategories);
        if (placeholderCategories.length > 0) {
          setActiveCategory(placeholderCategories[0].id);
          setMenuItems(placeholderMenuItems.filter(item => 
            item.categoryId === placeholderCategories[0].id
          ));
        }
      }
    };
    
    // Execute the function safely
    fetchMenuData().catch(err => {
      console.error("Unhandled error in fetchMenuData:", err);
      setMenuError("Failed to load menu. Please try again later.");
      
      // Ensure we always have data to display
      const placeholderCategories = ORDER_SECTION.categories;
      const placeholderMenuItems = ORDER_SECTION.items;
      
      setCategories(placeholderCategories);
      if (placeholderCategories.length > 0) {
        setActiveCategory(placeholderCategories[0].id);
        setMenuItems(placeholderMenuItems.filter(item => 
          item.categoryId === placeholderCategories[0].id
        ));
      }
      
      setIsLoadingMenu(false);
    });
  }, []);

  // Handle category change
  const handleCategoryChange = async (categoryId) => {
    setActiveCategory(categoryId);
    setIsLoadingMenu(true);
    
    try {
      // API integration will be implemented later
      // For now use the placeholder data without making API calls
      // Uncomment the below code when API is ready
      /*
      // Fetch menu items for the selected category
      const menuItemsData = await apiRequest(`/api/menu?categoryId=${categoryId}`);
      setMenuItems(menuItemsData || []);
      */
      
      // Use placeholder data
      const placeholderMenuItems = ORDER_SECTION.items;
      setMenuItems(placeholderMenuItems.filter(item => item.categoryId === categoryId));
      setIsLoadingMenu(false);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setMenuError(err.message);
      setIsLoadingMenu(false);
      
      // Use placeholder data if error occurs
      const placeholderMenuItems = ORDER_SECTION.items;
      setMenuItems(placeholderMenuItems.filter(item => item.categoryId === categoryId));
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Toggle order type
  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    
    // Clear address error if switching to pickup
    if (type === "pickup" && errors.address) {
      setErrors((prev) => ({
        ...prev,
        address: undefined,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (orderType === "delivery" && !formData.address.trim()) {
      newErrors.address = "Address is required for delivery";
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }
    
    if (items.length === 0) {
      newErrors.cart = "Your cart is empty";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show toast for cart error
      if (errors.cart) {
        toast({
          title: "Empty Cart",
          description: "Please add items to your cart before placing an order.",
          variant: "destructive",
        });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data for API
      const orderData = {
        ...formData,
        orderType,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: orderType === "delivery" ? 5.99 : 0,
        tax: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08,
        status: "pending"
      };
      
      // API integration will be implemented later
      // For now simulate a successful order
      // Uncomment the below code when API is ready
      /*
      // Call API to create order
      const response = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      
      // Handle success
      setIsSuccess(true);
      setOrderReference(response.id || "OR" + Math.floor(Math.random() * 10000));
      */
      
      // Simulate successful order for now
      setIsSuccess(true);
      setOrderReference("OR" + Math.floor(Math.random() * 10000));
      
      // Clear cart
      clearCart();
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        paymentMethod: "card",
        notes: "",
      });
      
      // Show success toast
      toast({
        title: "Order Placed Successfully!",
        description: `Your order has been received and is being processed.`,
      });
    } catch (err) {
      console.error("Error submitting order:", err);
      
      // Show error toast
      toast({
        title: "Order Failed",
        description: err.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle new order
  const handleNewOrder = () => {
    setIsSuccess(false);
    setOrderReference("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentMethod: "card",
      notes: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Order Online</h1>
      
      {isSuccess ? (
        // Success State
        <div className="max-w-2xl mx-auto bg-secondary p-8 rounded-lg">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-green-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
            <p className="mb-6">
              Thank you for your order. We've sent a confirmation to your email.
            </p>
            <div className="bg-background p-4 rounded-md mb-6">
              <h3 className="font-bold mb-2">Order Reference</h3>
              <p className="text-xl font-mono">{orderReference}</p>
            </div>
            <p className="text-muted-foreground mb-8">
              {orderType === "delivery" 
                ? "Your food will be delivered in approximately 30-45 minutes." 
                : "Your food will be ready for pickup in approximately 20-30 minutes."
              }
            </p>
            <button
              onClick={handleNewOrder}
              className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md font-medium transition-colors"
            >
              Place Another Order
            </button>
          </div>
        </div>
      ) : (
        // Order Form
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Menu Categories and Items */}
          <div className="md:col-span-2">
            <div className="bg-secondary p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Menu</h2>
              
              {/* Categories */}
              <div className="flex overflow-x-auto pb-4 mb-6 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-background/80"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              {/* Menu Items */}
              {isLoadingMenu ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((placeholder) => (
                    <div key={placeholder} className="bg-background rounded-lg p-4 flex">
                      <div className="w-16 h-16 bg-gray-300 rounded mr-4"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : menuError ? (
                <div className="text-red-500 p-4">
                  Error loading menu: {menuError}
                </div>
              ) : menuItems.length > 0 ? (
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-background rounded-lg p-4 flex"
                    >
                      {/* Item Image */}
                      {item.image && (
                        <div className="w-16 h-16 mr-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/64x64?text=Food";
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold">{item.name}</h3>
                          <span className="font-bold text-primary">
                            {formatAmount(item.price)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <button
                          onClick={() => addItem({
                            menuItemId: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                            image: item.image
                          })}
                          className="text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded transition-colors"
                        >
                          Add to Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No items available in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Cart and Checkout */}
          <div>
            <div className="bg-secondary p-6 rounded-lg mb-8 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Your Order</h2>
              
              {/* Order Type Selector */}
              <div className="mb-6">
                <label className="block font-medium mb-2">Order Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOrderTypeChange("delivery")}
                    className={`px-4 py-2 rounded-md font-medium ${
                      orderType === "delivery"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-background/80"
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOrderTypeChange("pickup")}
                    className={`px-4 py-2 rounded-md font-medium ${
                      orderType === "pickup"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-background/80"
                    }`}
                  >
                    Pickup
                  </button>
                </div>
              </div>
              
              {/* Cart Items */}
              {items.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex items-center">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex items-center mt-1">
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-sm"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">
                          {formatAmount(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.menuItemId)}
                          className="block text-xs text-red-500 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Clear Cart
                  </button>
                  
                  {/* Order Summary */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>{formattedSubtotal}</span>
                    </div>
                    {orderType === "delivery" && (
                      <div className="flex justify-between mb-2">
                        <span>Delivery Fee</span>
                        <span>{formattedDeliveryFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <span>Tax</span>
                      <span>{formattedTax}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span>Total</span>
                      <span>{formattedTotal}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-background p-4 rounded-md text-center mb-6">
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm">Add items from the menu to start your order</p>
                </div>
              )}
              
              {/* Checkout Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block font-medium mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.name ? "border-red-500" : "border-input"
                    } bg-background`}
                    placeholder="John Doe"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.email ? "border-red-500" : "border-input"
                    } bg-background`}
                    placeholder="john@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.phone ? "border-red-500" : "border-input"
                    } bg-background`}
                    placeholder="(123) 456-7890"
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                
                {orderType === "delivery" && (
                  <div>
                    <label htmlFor="address" className="block font-medium mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.address ? "border-red-500" : "border-input"
                      } bg-background`}
                      placeholder="123 Main St, City, State, Zip"
                      required={orderType === "delivery"}
                    ></textarea>
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="block font-medium mb-1">
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleChange}
                        className="rounded border-input bg-background"
                      />
                      <span>Credit Card (Pay on Delivery)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={handleChange}
                        className="rounded border-input bg-background"
                      />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="notes" className="block font-medium mb-1">
                    Order Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="Any special instructions for your order?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-md font-medium transition-colors flex justify-center items-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Place Order ${cartCount > 0 ? `(${formattedTotal})` : ""}`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;