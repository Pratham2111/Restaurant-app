import React from "react";

/**
 * Hero component for the home page
 * @param {Object} props - Component props
 * @param {string} props.title - Hero section title
 * @param {string} props.subtitle - Hero section subtitle
 * @param {string} props.imageUrl - Background image URL
 * @param {React.ReactNode} props.children - Child components (buttons/CTAs)
 */
function Hero({ title, subtitle, imageUrl, children }) {
  return (
    <div className="relative bg-background py-24 sm:py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            filter: "brightness(0.3)"
          }}
        ></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            {subtitle}
          </p>
          
          {children}
        </div>
      </div>
    </div>
  );
}

export default Hero;