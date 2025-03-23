import { Link } from "wouter";
import { HERO_SECTION } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div 
        className="relative h-[70vh] md:h-[80vh] bg-cover bg-center" 
        style={{ backgroundImage: `url('${HERO_SECTION.backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-4">{HERO_SECTION.heading}</h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">{HERO_SECTION.subheading}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/order">
              <Button className="bg-secondary hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-md transition shadow-lg">
                Order Now
              </Button>
            </Link>
            <Link href="/booking">
              <Button className="bg-white hover:bg-opacity-90 text-primary font-bold py-3 px-8 rounded-md transition shadow-lg">
                Book a Table
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
