import { Link } from "wouter";
import { Button } from "../ui/button";
import { HERO_SECTION } from "../../lib/constants";

/**
 * Hero component for the homepage
 * Displays a full-width banner with headline, description, and call-to-action buttons
 */
export const Hero = () => {
  return (
    <section className="relative">
      {/* Hero background image */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-[600px] md:h-[700px] w-full overflow-hidden">
          <img
            src={HERO_SECTION.image}
            alt="Restaurant interior"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        </div>
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 flex flex-col justify-center items-center text-center h-[600px] md:h-[700px] text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight max-w-3xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {HERO_SECTION.title}
        </h1>
        
        <p className="text-xl md:text-2xl font-medium mb-4 max-w-2xl">
          {HERO_SECTION.subtitle}
        </p>
        
        <p className="text-base md:text-lg mb-8 max-w-2xl text-white/90">
          {HERO_SECTION.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="text-base px-8">
            <Link href={HERO_SECTION.ctaLink}>{HERO_SECTION.cta}</Link>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="text-base px-8 border-white text-white hover:bg-white/10">
            <Link href={HERO_SECTION.secondaryCtaLink}>{HERO_SECTION.secondaryCta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};