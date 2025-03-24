import { Card, CardContent } from "../ui/card";
import { ABOUT_SECTION } from "../../lib/constants";
import { 
  UtensilsCrossed, 
  Award, 
  Timer 
} from "lucide-react";

/**
 * About component
 * Displays restaurant story and key features on the homepage
 */
export const About = () => {
  // Icons for the feature cards
  const featureIcons = [
    <UtensilsCrossed className="h-6 w-6" />,
    <Award className="h-6 w-6" />,
    <Timer className="h-6 w-6" />
  ];
  
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* About text */}
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
            
            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ABOUT_SECTION.features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                      {featureIcons[index]}
                    </div>
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* About image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden">
              <img
                src={ABOUT_SECTION.image}
                alt="About our restaurant"
                className="w-full object-cover h-[500px]"
              />
            </div>
            
            {/* Experience badge */}
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg md:flex items-center justify-center hidden">
              <div className="text-center">
                <span className="text-4xl font-bold block">15+</span>
                <span className="text-sm">Years of Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};