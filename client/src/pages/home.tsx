import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Parallax, ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, UtensilsCrossed, Wine, Users, Star, Facebook, Instagram, Twitter, Mail, Phone, ChefHat, Award } from "lucide-react";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { MenuItem } from "@shared/schema";

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

const mapStyles = {
  height: "400px",
  width: "100%"
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};


const stats = [
  { number: "15+", label: "Years of Excellence" },
  { number: "50+", label: "Award-Winning Dishes" },
  { number: "200+", label: "Wine Selections" },
  { number: "1000+", label: "Happy Customers Monthly" }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1544025162-d76694265947",
  "https://images.unsplash.com/photo-1533422902779-aff35862e462",
  "https://images.unsplash.com/photo-1476124369491-e7addf5db371"
];

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();

  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"]
  });

  const specialDishes = menuItems?.filter(item => item.isSpecial) || [];

  return (
    <div className="relative">
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
                <ParallaxBanner className="h-[400px] sm:h-[500px] md:h-[600px]">
                  <ParallaxBannerLayer
                    image={image.url}
                    speed={-20}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${image.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <ParallaxBannerLayer speed={-10}>
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
                  </ParallaxBannerLayer>
                </ParallaxBanner>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="w-full py-12 sm:py-16 md:py-20 bg-background relative overflow-hidden">
        <Parallax speed={5} className="absolute inset-0">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-64 h-64 bg-restaurant-yellow rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-restaurant-yellow rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
        </Parallax>

        <div className="max-w-[1440px] mx-auto px-4 relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
            Why Choose La Maison
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Parallax
                key={index}
                speed={5}
                translateY={[0, 15]}
                className="h-full"
              >
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardContent className="pt-6">
                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-restaurant-yellow" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-background relative overflow-hidden">
        <Parallax speed={5} className="absolute inset-0">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-restaurant-yellow rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          </div>
        </Parallax>

        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-4"
            >
              Our Special Dishes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground"
            >
              Exquisite creations from our master chefs
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialDishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{dish.name}</h3>
                      <span className="text-restaurant-yellow font-semibold">${Number(dish.price).toFixed(2)}</span>
                    </div>
                    <p className="text-muted-foreground">{dish.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-background/50 relative overflow-hidden">
        <Parallax speed={10} className="absolute inset-0">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-restaurant-yellow rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>
        </Parallax>

        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <ChefHat className="w-8 h-8 text-restaurant-yellow mr-3" />
            <h2 className="text-3xl font-bold">Chef's Recommendations</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {menuItems?.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden h-full group">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className="text-restaurant-yellow font-semibold">${Number(item.price).toFixed(2)}</span>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-background/10 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="mb-2 inline-flex justify-center items-center w-12 h-12 rounded-full bg-restaurant-yellow/20">
                  <Award className="w-6 h-6 text-restaurant-yellow" />
                </div>
                <h3 className="text-3xl font-bold text-restaurant-yellow mb-2">{stat.number}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-background relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-4"
            >
              Our Gallery
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground"
            >
              A visual journey through our culinary excellence
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-restaurant-yellow/10 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-4"
            >
              Make a Reservation
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground mb-8"
            >
              Book your table now for an unforgettable dining experience
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/booking">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90"
                >
                  Book a Table
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => window.location.href = 'tel:+15551234567'}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Us
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 sm:py-16 md:py-20 bg-background/50 relative overflow-hidden">
        <Parallax speed={10} className="absolute inset-0">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-restaurant-yellow rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-restaurant-yellow rounded-full blur-3xl" />
          </div>
        </Parallax>

        <div className="max-w-[1440px] mx-auto px-4 relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
            What Our Guests Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Parallax
                key={index}
                speed={index % 2 === 0 ? 5 : -5}
                translateY={[0, 20]}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-background hover:shadow-lg transition-all duration-300 h-full backdrop-blur-lg bg-opacity-90">
                    <CardContent className="pt-6 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full ring-2 ring-restaurant-yellow"
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
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-background relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-foreground">
            Find Us Here
          </h2>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <LoadScript googleMapsApiKey={import.meta.env.GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={defaultCenter}
              >
                <Marker position={defaultCenter} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </section>


      <footer className="w-full bg-background border-t">
        <div className="max-w-[1440px] mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-restaurant-yellow">La Maison</h3>
              <p className="text-muted-foreground mb-4">
                Experience exquisite dining in an elegant atmosphere. Our passion for culinary excellence drives every dish we serve.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-restaurant-yellow transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-restaurant-yellow transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-restaurant-yellow transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-restaurant-yellow">Opening Hours</h3>
              <ul className="space-y-2 text-muted-foreground">
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

            <div>
              <h3 className="text-xl font-bold mb-4 text-restaurant-yellow">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>123 Gourmet Street</li>
                <li>Culinary District</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@lamaison.com</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-restaurant-yellow">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for special offers and updates.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background border-input"
                />
                <Button className="bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} La Maison. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}