import React from "react";
import { Link } from "wouter";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import FeaturedMenu from "../components/home/FeaturedMenu";
import Testimonials from "../components/home/Testimonials";
import { HERO_SECTION, RESTAURANT_INFO } from "../lib/constants";

/**
 * Home page component
 */
function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Hero
        title={HERO_SECTION.title}
        subtitle={HERO_SECTION.subtitle}
        imageUrl={HERO_SECTION.imageUrl}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/menu">
            <span className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors inline-block cursor-pointer">
              View Our Menu
            </span>
          </Link>
          <Link href="/booking">
            <span className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-md font-medium transition-colors inline-block cursor-pointer">
              Book a Table
            </span>
          </Link>
        </div>
      </Hero>

      {/* About Section */}
      <About />

      {/* Featured Menu Section */}
      <FeaturedMenu />

      {/* Reservation Banner */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Reserve Your Table Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the exquisite cuisine of {RESTAURANT_INFO.name}. Book your
            table now to avoid disappointment.
          </p>
          <Link href="/booking">
            <span className="bg-background text-foreground hover:bg-background/90 px-8 py-4 rounded-md font-bold text-lg transition-colors inline-block cursor-pointer">
              Make a Reservation
            </span>
          </Link>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Order Online Banner */}
      <div className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Order Online</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Can't make it to our restaurant? Order our delicious dishes online for 
            delivery or pickup.
          </p>
          <Link href="/order">
            <span className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-md font-bold text-lg transition-colors inline-block cursor-pointer">
              Order Now
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;