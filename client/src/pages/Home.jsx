import React from "react";
import { Link } from "wouter";
import { HERO_SECTION } from "../lib/constants";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import FeaturedMenu from "../components/home/FeaturedMenu";
import Testimonials from "../components/home/Testimonials";

/**
 * Home page component
 */
function Home() {
  return (
    <div>
      <Hero 
        title={HERO_SECTION.title}
        subtitle={HERO_SECTION.subtitle}
        imageUrl={HERO_SECTION.imageUrl}
      >
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/order">
            <span className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors inline-block cursor-pointer">
              Order Now
            </span>
          </Link>
          <Link href="/booking">
            <span className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium transition-colors inline-block cursor-pointer">
              Book a Table
            </span>
          </Link>
        </div>
      </Hero>
      
      <About />
      
      <FeaturedMenu />
      
      <Testimonials />
    </div>
  );
}

export default Home;