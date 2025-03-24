import { ABOUT_SECTION } from "../../lib/constants";

/**
 * About section component for the homepage
 * Displays information about the restaurant
 */
export const About = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* About text content */}
          <div className="order-2 lg:order-1">
            <h3 className="text-primary font-medium mb-2">
              {ABOUT_SECTION.subtitle}
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {ABOUT_SECTION.title}
            </h2>
            
            <div className="space-y-4 text-muted-foreground">
              {ABOUT_SECTION.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {ABOUT_SECTION.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* About image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={ABOUT_SECTION.image.main}
                  alt="Our restaurant interior"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              
              {/* Accent image - only shown on larger screens */}
              <div className="hidden md:block absolute -bottom-8 -left-8 w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden border-8 border-background shadow-xl">
                <img
                  src={ABOUT_SECTION.image.accent}
                  alt="Chef preparing food"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Experience badge */}
              <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg">
                <span className="text-3xl font-bold">
                  {ABOUT_SECTION.experience.years}+
                </span>
                <span className="text-xs">
                  {ABOUT_SECTION.experience.text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};