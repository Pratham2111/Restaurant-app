import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, UtensilsCrossed, Wine, Users } from "lucide-react";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    title: "Welcome to La Maison",
    description: "Experience exquisite dining in an elegant atmosphere"
  },
  {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    title: "Culinary Excellence",
    description: "Savor our chef's masterful creations"
  },
  {
    url: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    title: "Perfect Ambiance",
    description: "Create memorable moments in our sophisticated setting"
  }
];

const features = [
  {
    icon: UtensilsCrossed,
    title: "Fine Dining",
    description: "Experience culinary excellence with our master chefs"
  },
  {
    icon: Wine,
    title: "Premium Bar",
    description: "Extensive selection of wines and craft cocktails"
  },
  {
    icon: Users,
    title: "Private Events",
    description: "Perfect venue for special occasions and gatherings"
  },
  {
    icon: Clock,
    title: "Reservations",
    description: "Book your table for a memorable dining experience"
  }
];

const testimonials = [
  {
    text: "An unforgettable dining experience. The food was exceptional and the service impeccable.",
    author: "Emily Thompson"
  },
  {
    text: "The atmosphere is sophisticated yet welcoming. Perfect for special occasions.",
    author: "Michael Chen"
  },
  {
    text: "Best fine dining restaurant in the city. The wine selection is outstanding.",
    author: "Sarah Johnson"
  }
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Carousel Section */}
      <Carousel className="w-full h-[600px]">
        <CarouselContent>
          {heroImages.map((image, index) => (
            <CarouselItem key={index}>
              <div 
                className="h-[600px] bg-cover bg-center relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${image.url})`
                }}
              >
                <div className="container h-full flex items-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl text-white"
                  >
                    <h1 className="text-5xl font-bold mb-6 text-restaurant-yellow">
                      {image.title}
                    </h1>
                    <p className="text-xl mb-8 font-light">
                      {image.description}
                    </p>
                    <div className="flex gap-4">
                      <Link href="/menu">
                        <Button size="lg" className="bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90">
                          View Menu
                        </Button>
                      </Link>
                      <Link href="/booking">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="bg-transparent text-white border-white hover:bg-white/10"
                        >
                          Book a Table
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-restaurant-black">
            Why Choose La Maison
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="w-10 h-10 mx-auto mb-4 text-restaurant-yellow" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-restaurant-black">
            What Our Guests Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <p className="text-lg mb-4 italic text-muted-foreground">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold text-restaurant-black">
                    - {testimonial.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Information */}
      <section className="py-20 bg-restaurant-black text-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-restaurant-yellow">Visit Us</h2>
              <p className="text-lg mb-4">
                123 Gourmet Street<br />
                Culinary District<br />
                Opening Hours: Mon-Sun 11:00 AM - 11:00 PM
              </p>
              <Button 
                size="lg"
                className="bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90"
              >
                Get Directions
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17"
                alt="Restaurant interior"
                className="rounded-lg object-cover w-full h-48 hover:opacity-90 transition-opacity"
              />
              <img 
                src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b"
                alt="Restaurant dish"
                className="rounded-lg object-cover w-full h-48 hover:opacity-90 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}