import { Layout } from "../components/layout/Layout";
import { Hero } from "../components/home/Hero";
import { About } from "../components/home/About";
import { FeaturedMenu } from "../components/home/FeaturedMenu";
import { Testimonials } from "../components/home/Testimonials";

/**
 * Home page component
 * Landing page for the restaurant website
 */
function Home() {
  return (
    <Layout>
      {/* Hero banner */}
      <Hero />
      
      {/* About section */}
      <About />
      
      {/* Featured menu items */}
      <FeaturedMenu />
      
      {/* Testimonials */}
      <Testimonials />
    </Layout>
  );
}

export default Home;