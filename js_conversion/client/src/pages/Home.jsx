import { Layout } from "../components/layout/Layout";
import { Hero } from "../components/home/Hero";
import { About } from "../components/home/About";
import { FeaturedMenu } from "../components/home/FeaturedMenu";
import { Testimonials } from "../components/home/Testimonials";

/**
 * Home page component
 * The main landing page of the restaurant website
 */
function Home() {
  return (
    <Layout>
      {/* Hero section */}
      <Hero />
      
      {/* About section */}
      <About />
      
      {/* Featured menu section */}
      <section className="py-16 bg-muted/30">
        <FeaturedMenu />
      </section>
      
      {/* Testimonials section */}
      <section className="py-16">
        <Testimonials />
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience La Mason?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join us for an unforgettable dining experience or order our delicious dishes to enjoy at home.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="/booking" 
              className="bg-white text-primary hover:bg-primary-foreground py-3 px-6 rounded-md font-medium transition-colors"
            >
              Book a Table
            </a>
            <a 
              href="/order" 
              className="bg-primary-foreground text-primary border border-white hover:bg-white py-3 px-6 rounded-md font-medium transition-colors"
            >
              Order Online
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Home;