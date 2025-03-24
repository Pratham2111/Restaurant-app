import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { Quote } from "lucide-react";
import { TESTIMONIALS_SECTION } from "../../lib/constants";
import { useMobile } from "../../hooks/use-mobile";

/**
 * Testimonials component
 * Displays customer testimonials in a carousel
 */
export const Testimonials = () => {
  // Use responsive hook to determine how many testimonials to show per slide
  const isMobile = useMobile();
  
  // Fetch testimonials from API
  const {
    data: testimonials = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/testimonials"]
  });
  
  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-primary font-medium mb-2">
            {TESTIMONIALS_SECTION.subtitle}
          </h3>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {TESTIMONIALS_SECTION.title}
          </h2>
          
          <p className="text-muted-foreground">
            {TESTIMONIALS_SECTION.description}
          </p>
        </div>
        
        {/* Testimonials carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="ml-4">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load testimonials. Please try again later.
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem 
                  key={testimonial.id} 
                  className="md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                          />
                          <AvatarFallback>
                            {getInitials(testimonial.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <h4 className="font-medium">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.location}
                          </p>
                        </div>
                        <Quote className="ml-auto h-5 w-5 text-primary opacity-70" />
                      </div>
                      <p className="text-muted-foreground">
                        "{testimonial.comment}"
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="static mx-2 translate-x-0 translate-y-0" />
              <CarouselNext className="static mx-2 translate-x-0 translate-y-0" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
};