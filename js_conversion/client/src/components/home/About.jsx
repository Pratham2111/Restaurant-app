import React from "react";
import { ABOUT_SECTION } from "@/lib/constants";

export const About = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Column */}
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src={ABOUT_SECTION.restaurantImage}
                alt="La Mason Restaurant Interior"
                className="rounded-lg shadow-lg w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-lg -z-10"></div>
            </div>
          </div>
          
          {/* Content Column */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              {ABOUT_SECTION.heading}
            </h2>
            
            <div className="prose max-w-none mb-8">
              {ABOUT_SECTION.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Chef Info */}
            <div className="flex items-center mt-8">
              <img 
                src={ABOUT_SECTION.chefImage} 
                alt={ABOUT_SECTION.chefName}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{ABOUT_SECTION.chefName}</h3>
                <p className="text-gray-600">{ABOUT_SECTION.chefTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};