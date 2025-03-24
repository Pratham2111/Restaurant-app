import { useQuery } from "@tanstack/react-query";
import { Layout } from "../components/layout/Layout";
import { Hero } from "../components/home/Hero";
import { About } from "../components/home/About";
import { FeaturedMenu } from "../components/home/FeaturedMenu";
import { Testimonials } from "../components/home/Testimonials";
import { Skeleton } from "../components/ui/skeleton";

/**
 * Home page component 
 * Displays the restaurant's landing page with hero, about, featured menu and testimonials
 */
function Home() {
  // Fetch featured menu items
  const {
    data: featuredItems,
    isLoading: isLoadingFeatured,
    error: featuredError
  } = useQuery({
    queryKey: ["/api/menu-items/featured"],
  });
  
  // Fetch testimonials
  const {
    data: testimonials,
    isLoading: isLoadingTestimonials,
    error: testimonialsError
  } = useQuery({
    queryKey: ["/api/testimonials"],
  });
  
  // Loading states for sections
  const renderFeaturedMenuSection = () => {
    if (isLoadingFeatured) {
      return (
        <div className="py-16 bg-muted/30">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-64 mx-auto mb-4" />
              <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-2" />
              <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (featuredError) {
      return (
        <div className="py-16 bg-muted/30 text-center">
          <p className="text-red-500">
            Unable to load featured menu items. Please try again later.
          </p>
        </div>
      );
    }
    
    return <FeaturedMenu featuredItems={featuredItems || []} />;
  };
  
  const renderTestimonialsSection = () => {
    if (isLoadingTestimonials) {
      return (
        <div className="py-16 bg-primary/5">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-64 mx-auto mb-4" />
              <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
            </div>
            <div className="bg-card rounded-xl p-8 shadow-sm max-w-4xl mx-auto">
              <div className="text-center">
                <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" />
                <Skeleton className="h-4 w-full max-w-md mx-auto mb-2" />
                <Skeleton className="h-4 w-full max-w-md mx-auto mb-2" />
                <Skeleton className="h-4 w-2/3 mx-auto mb-6" />
                <Skeleton className="h-5 w-32 mx-auto mb-1" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (testimonialsError) {
      return (
        <div className="py-16 bg-primary/5 text-center">
          <p className="text-red-500">
            Unable to load testimonials. Please try again later.
          </p>
        </div>
      );
    }
    
    return <Testimonials testimonials={testimonials || []} />;
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <Hero />
      
      {/* About Section */}
      <About />
      
      {/* Featured Menu Section */}
      {renderFeaturedMenuSection()}
      
      {/* Testimonials Section */}
      {renderTestimonialsSection()}
    </Layout>
  );
}

export default Home;