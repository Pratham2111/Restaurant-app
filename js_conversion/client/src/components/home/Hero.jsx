import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HERO_SECTION } from "@/lib/constants";

export const Hero = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_SECTION.imageUrl}
          alt="La Mason Restaurant"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto flex h-full items-center px-4 sm:px-8">
        <div className="max-w-2xl text-white">
          <h1 className="mb-2 text-5xl font-bold leading-tight md:text-6xl">
            {HERO_SECTION.heading}
          </h1>
          <p className="mb-6 text-xl font-medium text-gray-100">
            {HERO_SECTION.subheading}
          </p>
          <p className="mb-8 text-gray-200">
            {HERO_SECTION.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/menu">
              <Button size="lg" className="font-semibold">
                {HERO_SECTION.ctaText}
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-semibold">
                Book a Table
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};