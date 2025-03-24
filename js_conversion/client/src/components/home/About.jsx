import { Check } from "lucide-react";
import { ABOUT_SECTION } from "../../lib/constants";

/**
 * About component for the homepage
 * Displays restaurant story, image and key features
 */
export const About = () => {
  return (
    <section className="py-16 max-w-screen-xl mx-auto px-4" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image column */}
        <div className="order-2 lg:order-1">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={ABOUT_SECTION.image}
              alt="Chef preparing food"
              className="w-full h-auto object-cover"
            />
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-xl -z-10" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-xl -z-10" />
          </div>
        </div>
        
        {/* Content column */}
        <div className="order-1 lg:order-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-primary text-lg font-medium mb-2">{ABOUT_SECTION.subtitle}</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">{ABOUT_SECTION.title}</h3>
              <p className="text-muted-foreground">{ABOUT_SECTION.description}</p>
            </div>
            
            {/* Features list */}
            <div className="pt-6 space-y-4">
              {ABOUT_SECTION.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};