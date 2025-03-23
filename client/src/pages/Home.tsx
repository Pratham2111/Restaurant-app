import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FeaturedMenu } from "@/components/home/FeaturedMenu";
import { Testimonials } from "@/components/home/Testimonials";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CONTACT_SECTION, BOOKING_SECTION } from "@/lib/constants";

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <FeaturedMenu />
      
      {/* Booking CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral mb-4">
              {BOOKING_SECTION.heading.split(" ").map((word, idx) => (
                <span key={idx} className={idx === BOOKING_SECTION.heading.split(" ").length - 1 ? "text-primary" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            <p className="max-w-2xl mx-auto text-lg">{BOOKING_SECTION.description}</p>
          </div>
          <div className="flex justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-primary hover:bg-opacity-90 text-white">
                Book a Table Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Testimonials />
      
      {/* Contact CTA Section */}
      <section className="py-16 bg-light-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral mb-4">
              {CONTACT_SECTION.heading.split(" ").map((word, idx) => (
                <span key={idx} className={idx === CONTACT_SECTION.heading.split(" ").length - 1 ? "text-primary" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            <p className="max-w-2xl mx-auto text-lg">{CONTACT_SECTION.description}</p>
          </div>
          <div className="flex justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-opacity-90 text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
