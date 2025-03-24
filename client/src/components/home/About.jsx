import React from "react";
import { ABOUT_SECTION } from "../../lib/constants";

/**
 * About section component for the home page
 */
function About() {
  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={ABOUT_SECTION.imageUrl}
              alt="About Our Restaurant"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              style={{ maxHeight: "500px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/600x400?text=Restaurant+Interior";
              }}
            />
          </div>
          
          {/* Content */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">{ABOUT_SECTION.title}</h2>
            
            <div className="space-y-4">
              {ABOUT_SECTION.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {ABOUT_SECTION.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-primary text-xl">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;