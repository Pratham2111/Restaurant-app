import { Link } from "wouter";
import { Button } from "../ui/button";
import { HERO_SECTION } from "../../lib/constants";

/**
 * Hero component
 * Main hero section of the homepage with call-to-action buttons
 */
export const Hero = () => {
  return (
    <section className="relative">
      {/* Hero background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
      <div 
        className="h-[600px] md:h-[700px] bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_SECTION.backgroundImage})` }}
      />
      
      {/* Hero content */}
      <div className="absolute inset-0 flex items-center z-20">
        <div className="container">
          <div className="max-w-xl">
            <h3 className="text-primary font-medium mb-4">{HERO_SECTION.subtitle}</h3>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {HERO_SECTION.title}
            </h1>
            
            <p className="text-gray-300 mb-8 text-lg">
              {HERO_SECTION.description}
            </p>
            
            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base font-medium">
                <Link href="/order">Order Online</Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-base text-white border-white hover:text-primary-foreground hover:bg-primary hover:border-primary">
                <Link href="/booking">Book a Table</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};