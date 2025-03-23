import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { TESTIMONIALS_SECTION } from "@/lib/constants";
import { Star, StarHalf } from "lucide-react";

export const Testimonials = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-secondary text-secondary" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-secondary text-secondary" />);
    }
    
    return (
      <div className="flex text-secondary">
        {stars}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral mb-3">
            {TESTIMONIALS_SECTION.heading.split(" ").map((word, idx) => (
              <span key={idx} className={word === "Guests" ? "text-primary" : ""}>
                {word}{" "}
              </span>
            ))}
          </h2>
          <p className="max-w-2xl mx-auto text-lg">{TESTIMONIALS_SECTION.subheading}</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-light-cream rounded-lg shadow-md p-6 relative">
                <div className="pt-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <div className="flex items-center">
                    <Skeleton className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load testimonials. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials?.map((testimonial) => (
              <div key={testimonial.id} className="bg-light-cream rounded-lg shadow-md p-6 relative">
                <div className="text-secondary text-4xl absolute -top-4 -left-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-8 h-8"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M4.804 21.644A1.5 1.5 0 006 21.75h2.25a1.5 1.5 0 001.5-1.5v-2.25a1.5 1.5 0 00-1.5-1.5H6a1.5 1.5 0 00-1.5 1.5v2.25c0 .414.168.788.439 1.06l4.91-4.91a1.5 1.5 0 01-1.045-1.435v-2.25a1.5 1.5 0 011.5-1.5H12a1.5 1.5 0 011.5 1.5v2.25a1.5 1.5 0 01-1.5 1.5H9.75l-4.946 4.933zM19.5 10.5a3 3 0 11-6 0 3 3 0 016 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <div className="pt-4">
                  <p className="text-gray-800 mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
