import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { TESTIMONIALS_SECTION } from "../../lib/constants";

/**
 * Testimonials component for the home page
 * Displays customer reviews in a carousel
 */
export const Testimonials = () => {
  // Fetch testimonials from API
  const { 
    data: testimonials = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["/api/testimonials"]
  });
  
  // Get user initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <div className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-12">
          <h3 className="text-primary font-medium mb-2">
            {TESTIMONIALS_SECTION.subtitle}
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {TESTIMONIALS_SECTION.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {TESTIMONIALS_SECTION.description}
          </p>
        </div>
        
        {/* Testimonials carousel */}
        {isLoading ? (
          <div className="flex gap-6 justify-center">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full max-w-md mx-auto">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load testimonials
          </div>
        ) : (
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          {testimonial.image ? (
                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          ) : null}
                          <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{testimonial.name}</h4>
                          {testimonial.location && (
                            <p className="text-sm text-muted-foreground">
                              {testimonial.location}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 md:-left-12" />
            <CarouselNext className="right-0 md:-right-12" />
          </Carousel>
        )}
      </div>
    </div>
  );
};