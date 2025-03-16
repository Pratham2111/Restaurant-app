import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative">
      <div 
        className="h-[600px] bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4)`
        }}
      >
        <div className="container h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl mb-6 text-restaurant-yellow">
              Welcome to La Maison
            </h1>
            <p className="text-xl mb-8 font-light">
              Experience exquisite dining in an elegant atmosphere. Our master chefs create unforgettable culinary experiences with the finest ingredients.
            </p>
            <div className="flex gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90 font-medium">
                  View Menu
                </Button>
              </Link>
              <Link href="/booking">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/90 text-restaurant-black border-white transition-all duration-300 hover:bg-white hover:text-restaurant-black hover:border-white hover:scale-105 hover:shadow-lg font-medium"
                >
                  Book a Table
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl text-center mb-12 text-restaurant-black">
            Our Restaurant
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1538333581680-29dd4752ddf2"
                alt="Restaurant interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1538334421852-687c439c92f4"
                alt="Restaurant interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de"
                alt="Restaurant interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}