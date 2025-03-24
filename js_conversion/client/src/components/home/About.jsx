import { CheckCircle } from "lucide-react";
import { ABOUT_SECTION } from "../../lib/constants";

/**
 * About component for the home page
 * Displays information about the restaurant
 */
export const About = () => {
  return (
    <div className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src={ABOUT_SECTION.image}
              alt="Restaurant chef"
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Content */}
          <div>
            <h3 className="text-primary font-medium mb-2">
              {ABOUT_SECTION.subtitle}
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {ABOUT_SECTION.title}
            </h2>
            <p className="text-muted-foreground mb-8">
              {ABOUT_SECTION.description}
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ABOUT_SECTION.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};