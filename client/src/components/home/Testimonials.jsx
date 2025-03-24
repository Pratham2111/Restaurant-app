import React, { useState, useEffect } from "react";
import { TESTIMONIALS_SECTION } from "../../lib/constants";
import { apiRequest } from "../../lib/queryClient";

/**
 * Testimonials section component for the home page
 */
function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await apiRequest('/api/testimonials');
        setTestimonials(data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError(err.message);
        setIsLoading(false);
        
        // Fallback to placeholder data
        setTestimonials(TESTIMONIALS_SECTION.testimonials);
      }
    };
    
    // For now, we'll use placeholder data since API is not yet implemented
    // fetchTestimonials();
    setTestimonials(TESTIMONIALS_SECTION.testimonials);
    setIsLoading(false);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Loading Testimonials...</h2>
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-24 bg-secondary rounded w-full"></div>
            <div className="h-24 bg-secondary rounded w-full"></div>
            <div className="h-24 bg-secondary rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{TESTIMONIALS_SECTION.title}</h2>
          <div className="text-red-500">
            Error loading testimonials: {error}
          </div>
        </div>
      </div>
    );
  }

  // No testimonials state
  if (testimonials.length === 0) {
    return (
      <div className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{TESTIMONIALS_SECTION.title}</h2>
          <p className="text-muted-foreground">No testimonials available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{TESTIMONIALS_SECTION.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {TESTIMONIALS_SECTION.description}
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id || index} 
              className="bg-secondary p-6 rounded-lg shadow-md"
            >
              {/* Rating Stars */}
              <div className="flex text-primary mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? "fill-current" : "stroke-current fill-none"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>
              
              {/* Comment */}
              <p className="italic mb-4">"{testimonial.comment}"</p>
              
              {/* Customer Info */}
              <div className="flex items-center mt-4">
                {testimonial.avatar && (
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        testimonial.name
                      )}&background=random`;
                    }}
                  />
                )}
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;