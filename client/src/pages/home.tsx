import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, UtensilsCrossed, Wine, Users, Star, Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    title: "Welcome to La Maison",
    description: "Experience exquisite dining in an elegant atmosphere",
  },
  {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    title: "Culinary Excellence",
    description: "Savor our chef's masterful creations",
  },
  {
    url: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    title: "Perfect Ambiance",
    description: "Create memorable moments in our sophisticated setting",
  },
];

const features = [
  {
    icon: UtensilsCrossed,
    title: "Fine Dining",
    description: "Experience culinary excellence with our master chefs",
  },
  {
    icon: Wine,
    title: "Premium Bar",
    description: "Extensive selection of wines and craft cocktails",
  },
  {
    icon: Users,
    title: "Private Events",
    description: "Perfect venue for special occasions and gatherings",
  },
  {
    icon: Clock,
    title: "Reservations",
    description: "Book your table for a memorable dining experience",
  },
];

const testimonials = [
  {
    text: "An unforgettable dining experience. The food was exceptional and the service impeccable.",
    author: "Emily Thompson",
    role: "Food Critic",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Emily+Thompson&background=random"
  },
  {
    text: "The atmosphere is sophisticated yet welcoming. Perfect for special occasions.",
    author: "Michael Chen",
    role: "Regular Customer",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Michael+Chen&background=random"
  },
  {
    text: "Best fine dining restaurant in the city. The wine selection is outstanding.",
    author: "Sarah Johnson",
    role: "Wine Enthusiast",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random"
  },
];

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <div className="relative">
      {/* Hero Carousel Section */}
      <section className="w-full">
        <Carousel
          className="w-full h-[400px] sm:h-[500px] md:h-[600px]"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
            }),
          ]}
          setApi={setApi}
        >
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div
                  className="h-[400px] sm:h-[500px] md:h-[600px] bg-cover bg-center relative"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${image.url})`,
                  }}
                >
                  <div className="max-w-[1440px] mx-auto h-full flex items-center px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="max-w-2xl text-white"
                    >
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-restaurant-yellow">
                        {image.title}
                      </h1>
                      <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 font-light">
                        {image.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/menu">
                          <Button
                            size="lg"
                            className="w-full sm:w-auto bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90"
                          >
                            View Menu
                          </Button>
                        </Link>
                        <Link href="/booking">
                          <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10"
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
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 sm:py-16 md:py-20 bg-background">
        <div className="max-w-[1440px] mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
            Why Choose La Maison
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-restaurant-yellow" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 sm:py-16 md:py-20 bg-muted">
        <div className="max-w-[1440px] mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
            What Our Guests Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-background hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {Array(testimonial.rating).fill(0).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-restaurant-yellow text-restaurant-yellow" />
                      ))}
                    </div>
                    <p className="text-base sm:text-lg mb-4 italic text-muted-foreground flex-grow">
                      "{testimonial.text}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-restaurant-black text-white">
        <div className="max-w-[1440px] mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Restaurant Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-restaurant-yellow">La Maison</h3>
              <p className="text-gray-300 mb-4">
                Experience exquisite dining in an elegant atmosphere. Our passion for culinary excellence drives every dish we serve.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white hover:text-restaurant-yellow transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-restaurant-yellow transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-restaurant-yellow transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-restaurant-yellow">Opening Hours</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>11:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 11:30 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 10:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-restaurant-yellow">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li>123 Gourmet Street</li>
                <li>Culinary District</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@lamaison.com</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-restaurant-yellow">Newsletter</h3>
              <p className="text-gray-300 mb-4">
                Subscribe to our newsletter for special offers and updates.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button className="bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} La Maison. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}