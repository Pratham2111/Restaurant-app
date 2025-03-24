import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TESTIMONIALS_SECTION } from "../../lib/constants";

/**
 * Testimonials component for the homepage
 * Displays a carousel of customer testimonials
 * @param {Object} props - Component props
 * @param {Array} props.testimonials - Array of testimonial objects
 */
export const Testimonials = ({ testimonials = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Stop autoplay on user interaction and restart after 10 seconds
  const pauseAutoplay = () => {
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };
  
  // Handle next testimonial button click
  const nextTestimonial = () => {
    pauseAutoplay();
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  // Handle previous testimonial button click
  const prevTestimonial = () => {
    pauseAutoplay();
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);
  
  // If no testimonials, don't render the section
  if (!testimonials.length) return null;
  
  return (
    <section className="py-16 bg-primary/5" id="testimonials">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{TESTIMONIALS_SECTION.title}</h2>
          <p className="text-lg text-primary font-medium mb-2">{TESTIMONIALS_SECTION.subtitle}</p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {TESTIMONIALS_SECTION.description}
          </p>
        </div>
        
        {/* Testimonials carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation arrows */}
          {testimonials.length > 1 && (
            <div className="absolute -left-4 md:-left-12 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background shadow-sm hover:bg-background hover:text-primary"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
          )}
          
          {testimonials.length > 1 && (
            <div className="absolute -right-4 md:-right-12 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background shadow-sm hover:bg-background hover:text-primary"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
          
          {/* Current testimonial */}
          <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm relative">
            {/* Quote icon */}
            <div className="absolute top-6 left-6 text-primary/10">
              <Quote className="h-20 w-20" />
            </div>
            
            <div className="text-center relative z-10">
              <div className="mb-6">
                <Avatar className="h-20 w-20 mx-auto border-4 border-primary/10">
                  <AvatarImage src={testimonials[activeIndex].image} alt={testimonials[activeIndex].name} />
                  <AvatarFallback>{testimonials[activeIndex].name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              
              <blockquote className="text-lg md:text-xl font-medium mb-6 max-w-2xl mx-auto">
                "{testimonials[activeIndex].comment}"
              </blockquote>
              
              <div>
                <div className="font-bold">{testimonials[activeIndex].name}</div>
                {testimonials[activeIndex].title && (
                  <div className="text-muted-foreground text-sm">{testimonials[activeIndex].title}</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Testimonial indicators */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full mx-1 transition-colors ${
                    index === activeIndex ? "bg-primary" : "bg-primary/20"
                  }`}
                  onClick={() => {
                    pauseAutoplay();
                    setActiveIndex(index);
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};