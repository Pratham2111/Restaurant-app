import { Link } from "wouter";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { HERO_SECTION } from "../../lib/constants";

/**
 * Hero component
 * Main banner section displayed at the top of the homepage
 */
export const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 md:py-32 bg-gradient-to-br from-background to-muted overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Hero content */}
          <div className="relative z-10">
            {/* Subtitle */}
            <div className="inline-block bg-primary/10 rounded-full px-4 py-1 text-primary font-medium text-sm mb-6">
              {HERO_SECTION.subtitle}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {HERO_SECTION.title.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 0 ? "text-primary" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            
            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 md:pr-10">
              {HERO_SECTION.description}
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/order">
                  Order Online
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link href="/booking">
                  Book a Table
                </Link>
              </Button>
            </div>
            
            {/* Metrics */}
            <div className="flex flex-wrap gap-8 mt-12">
              {HERO_SECTION.metrics.map((metric, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-primary">{metric.value}</div>
                  <div className="text-muted-foreground text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hero image */}
          <div className="relative">
            <div className="aspect-square rounded-full bg-primary/10 absolute -right-20 -top-20 w-72 h-72" />
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={HERO_SECTION.image}
                alt="Delicious restaurant food"
                className="w-full h-auto"
              />
            </div>
            <div className="aspect-square rounded-full bg-primary/10 absolute -left-10 -bottom-10 w-48 h-48" />
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
};