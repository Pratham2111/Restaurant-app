import { Link } from "wouter";
import { Button } from "../ui/button";
import { HERO_SECTION } from "../../lib/constants";

/**
 * Hero component for the home page
 * Displays the main banner with call-to-action buttons
 */
export const Hero = () => {
  return (
    <div className="relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_SECTION.image}
          alt="Restaurant interior"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      {/* Content */}
      <div className="relative container py-24 md:py-32 lg:py-40 flex flex-col items-center text-center">
        <h3 className="text-primary-foreground/90 font-medium mb-3 md:text-lg">
          {HERO_SECTION.subtitle}
        </h3>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white max-w-3xl">
          {HERO_SECTION.title}
        </h1>
        <p className="text-primary-foreground/80 max-w-xl mb-8 md:text-lg">
          {HERO_SECTION.description}
        </p>
        
        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/menu">{HERO_SECTION.button1}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-background/10 text-white hover:bg-background/20 hover:text-white border-white/20">
            <Link href="/booking">{HERO_SECTION.button2}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};