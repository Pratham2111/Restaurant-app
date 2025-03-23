import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/hooks/useCurrency";
import { useCart } from "@/hooks/useCart";
import { MENU_SECTION } from "@/lib/constants";
import { Plus } from "lucide-react";
import { MenuItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const FeaturedMenu = () => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: featuredItems, isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items/featured"],
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
    toast({
      title: "Added to Order",
      description: `${item.name} has been added to your order.`,
      duration: 2000,
    });
  };

  return (
    <section id="menu" className="py-16 bg-light-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral mb-3">
            {MENU_SECTION.heading.split(" ").map((word, idx) => (
              <span key={idx} className={idx === MENU_SECTION.heading.split(" ").length - 1 ? "text-primary" : ""}>
                {word}{" "}
              </span>
            ))}
          </h2>
          <p className="max-w-2xl mx-auto text-lg">{MENU_SECTION.subheading}</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-56" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full my-2" />
                  <Skeleton className="h-4 w-full my-2" />
                  <Skeleton className="h-4 w-2/3 my-2" />
                  <Skeleton className="h-10 w-32 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load featured menu items. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems?.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-display">{item.name}</h3>
                    <span className="text-lg font-medium text-primary">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button 
                    className="text-secondary font-medium flex items-center hover:text-primary transition-colors"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Order <Plus className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/menu">
            <Button className="bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-md transition shadow-md">
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
