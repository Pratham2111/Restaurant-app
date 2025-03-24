import { Link } from "wouter";
import { Button } from "../ui/button";
import { HERO_SECTION, RESTAURANT_INFO } from "../../lib/constants";

/**
 * Hero component for the homepage
 * The main banner section at the top of the home page
 */
export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero background with overlay */}
      <div className="absolute inset-0 bg-zinc-900 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 to-zinc-900/90 z-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            opacity: 0.7
          }}
        />
      </div>
      
      {/* Hero content */}
      <div className="container relative z-20 py-20 md:py-32 lg:py-40 text-white">
        <div className="max-w-3xl mx-auto text-center">
          {/* Restaurant name and title */}
          <h1 className="font-serif text-2xl mb-2">{RESTAURANT_INFO.name}</h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            {HERO_SECTION.title}
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-200 mb-8 max-w-2xl mx-auto">
            {HERO_SECTION.subtitle}
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button 
              asChild
              size="lg" 
              className="text-base font-medium"
            >
              <Link href={HERO_SECTION.cta.primary.link}>
                {HERO_SECTION.cta.primary.text}
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="text-base font-medium bg-transparent text-white border-white hover:bg-white hover:text-zinc-900"
            >
              <Link href={HERO_SECTION.cta.secondary.link}>
                {HERO_SECTION.cta.secondary.text}
              </Link>
            </Button>
          </div>
          
          {/* Features list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base text-zinc-100">
            {HERO_SECTION.features.map((feature, index) => (
              <div key={index} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-md">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};