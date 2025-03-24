import { Layout } from "../components/layout/Layout";
import { Hero } from "../components/home/Hero";
import { About } from "../components/home/About";
import { FeaturedMenu } from "../components/home/FeaturedMenu";
import { Testimonials } from "../components/home/Testimonials";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { 
  BOOKING_SECTION, 
  ORDER_SECTION 
} from "../lib/constants";

/**
 * Home page component
 * Main landing page of the restaurant website
 */
function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <Hero />
      
      {/* About Section */}
      <About />
      
      {/* Featured Menu Section */}
      <FeaturedMenu />
      
      {/* Booking Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-primary font-medium mb-2">
              {BOOKING_SECTION.subtitle}
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {BOOKING_SECTION.title}
            </h2>
            <p className="text-muted-foreground">
              {BOOKING_SECTION.description}
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/booking">Reserve Your Table</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Order Online Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-medium mb-2 text-primary-foreground/90">
                {ORDER_SECTION.subtitle}
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {ORDER_SECTION.title}
              </h2>
              <p className="mb-8 text-primary-foreground/90">
                {ORDER_SECTION.description}
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link href="/order">Order Now</Link>
              </Button>
            </div>
            
            <div className="rounded-lg overflow-hidden h-[300px] md:h-[400px] shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Food delivery" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Home;