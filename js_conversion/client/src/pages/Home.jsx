import React from "react";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FeaturedMenu } from "@/components/home/FeaturedMenu";
import { Testimonials } from "@/components/home/Testimonials";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BOOKING_SECTION, ORDER_SECTION } from "@/lib/constants";

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <Hero />
      
      {/* About Section */}
      <About />
      
      {/* Featured Menu Section */}
      <FeaturedMenu />
      
      {/* Book a Table Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                {BOOKING_SECTION.heading}
              </h2>
              <p className="text-gray-700 mb-6">
                {BOOKING_SECTION.description}
              </p>
              <Link href="/booking">
                <Button size="lg" className="font-semibold">
                  Book a Table Now
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                src={BOOKING_SECTION.imageUrl}
                alt="Reserve a table"
                className="rounded-lg shadow-lg w-full object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Order Online Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                {ORDER_SECTION.heading}
              </h2>
              <p className="text-gray-700 mb-6">
                {ORDER_SECTION.description}
              </p>
              <Link href="/order">
                <Button size="lg" variant="outline" className="font-semibold">
                  Order Online Now
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                src={ORDER_SECTION.imageUrl}
                alt="Order online"
                className="rounded-lg shadow-lg w-full object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default Home;