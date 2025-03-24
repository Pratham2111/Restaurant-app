import { Link } from "wouter";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { MENU_SECTION } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";
import { useCurrency } from "../../hooks/useCurrency";
import { PlusCircle } from "lucide-react";

/**
 * FeaturedMenu component for the homepage
 * Displays a grid of featured menu items
 * @param {Object} props - Component props
 * @param {Array} props.featuredItems - Array of featured menu items
 */
export const FeaturedMenu = ({ featuredItems = [] }) => {
  const { addToCart } = useCart();
  const { formatConvertedPrice } = useCurrency();
  
  // Handle add to cart button click
  const handleAddToCart = (item) => {
    addToCart(item);
  };
  
  return (
    <section className="py-16 bg-muted/30" id="menu">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{MENU_SECTION.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {MENU_SECTION.description}
          </p>
        </div>
        
        {/* Featured items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              {/* Item image */}
              {item.image && (
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {item.featured && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <div className="text-lg font-bold text-primary">
                    {formatConvertedPrice(item.price)}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{item.description}</p>
                
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="w-full gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add to Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* View full menu link */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href={MENU_SECTION.ctaLink}>{MENU_SECTION.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};