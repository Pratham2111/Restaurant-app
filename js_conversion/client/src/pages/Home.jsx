import { useQuery } from "@tanstack/react-query";
import { Hero } from "../components/home/Hero";
import { About } from "../components/home/About";
import { FeaturedMenu } from "../components/home/FeaturedMenu";
import { Testimonials } from "../components/home/Testimonials";

const Home = () => {
  // Fetch featured menu items
  const { data: featuredItems = [] } = useQuery({
    queryKey: ["/api/menu-items/featured"],
  });

  // Fetch testimonials
  const { data: testimonials = [] } = useQuery({
    queryKey: ["/api/testimonials"],
  });

  return (
    <div className="space-y-16 py-6">
      {/* Hero section */}
      <Hero />

      {/* About section */}
      <About />

      {/* Featured menu section */}
      <FeaturedMenu featuredItems={featuredItems} />

      {/* Testimonials section */}
      <Testimonials testimonials={testimonials} />
    </div>
  );
};

export default Home;