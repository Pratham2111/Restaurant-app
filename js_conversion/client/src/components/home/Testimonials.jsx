import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TESTIMONIALS_SECTION } from "../../lib/constants";

/**
 * Testimonials component for the homepage
 * Displays customer reviews in a carousel
 */
export const Testimonials = () => {
  // Fetch testimonials
  const { 
    data: testimonials, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["/api/testimonials"]
  });
  
  // Generate initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container">
      {/* Section header */}
      <div className="text-center mb-10 md:mb-16">
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
      {isLoading && (
        <div className="flex justify-center">
          <Skeleton className="h-80 w-full max-w-3xl" />
        </div>
      )}
      
      {error && (
        <div className="text-center py-10">
          <p className="text-red-500 mb-2">
            Failed to load testimonials
          </p>
          <p className="text-muted-foreground">
            Please try again later or contact support.
          </p>
        </div>
      )}
      
      {testimonials && testimonials.length > 0 && (
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-4/5 lg:basis-3/4">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-8">
                    {/* Quote icon */}
                    <div className="mb-6 text-primary/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="opacity-80"
                      >
                        <path d="M11.0362 5C7.61055 5 5.82556 7.75 5.82556 10.4167C5.82556 12.3333 6.72228 13 7.79769 13C8.87311 13 9.5915 12.0833 9.5915 11.25C9.5915 10.4167 9.05981 9.58333 7.97439 9.58333C7.97439 7.75 8.69276 6.66667 10.5064 6.66667V5ZM17.3276 5C13.9019 5 12.1169 7.75 12.1169 10.4167C12.1169 12.3333 13.0136 13 14.089 13C15.1644 13 15.8828 12.0833 15.8828 11.25C15.8828 10.4167 15.3511 9.58333 14.2657 9.58333C14.2657 7.75 14.984 6.66667 16.7977 6.66667V5Z" />
                        <path d="M11.0362 13.9167C7.61055 13.9167 5.82556 16.6667 5.82556 19.3333C5.82556 21.25 6.72228 21.9167 7.79769 21.9167C8.87311 21.9167 9.5915 21 9.5915 20.1667C9.5915 19.3333 9.05981 18.5 7.97439 18.5C7.97439 16.6667 8.69276 15.5833 10.5064 15.5833V13.9167ZM17.3276 13.9167C13.9019 13.9167 12.1169 16.6667 12.1169 19.3333C12.1169 21.25 13.0136 21.9167 14.089 21.9167C15.1644 21.9167 15.8828 21 15.8828 20.1667C15.8828 19.3333 15.3511 18.5 14.2657 18.5C14.2657 16.6667 14.984 15.5833 16.7977 15.5833V13.9167Z" />
                      </svg>
                    </div>
                    
                    {/* Testimonial text */}
                    <p className="text-lg mb-8">
                      {testimonial.content}
                    </p>
                    
                    {/* Customer info */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(testimonial.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{testimonial.name}</h4>
                        {testimonial.title && (
                          <p className="text-sm text-muted-foreground">
                            {testimonial.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      )}
    </div>
  );
};