import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_SECTION, RESTAURANT_INFO } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-light-cream min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral mb-4">
            Contact Us
          </h1>
          <p className="max-w-2xl mx-auto text-lg">{CONTACT_SECTION.description}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral mb-6">
              Get in <span className="text-primary">Touch</span>
            </h2>
            <p className="text-lg mb-8">{CONTACT_SECTION.description}</p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-primary text-xl mt-1 mr-4">
                  <MapPin />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Location</h3>
                  <p>{RESTAURANT_INFO.address}</p>
                  <p>{RESTAURANT_INFO.city}, {RESTAURANT_INFO.state} {RESTAURANT_INFO.zip}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary text-xl mt-1 mr-4">
                  <Phone />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Phone</h3>
                  <p>{RESTAURANT_INFO.phone}</p>
                  <p>{RESTAURANT_INFO.alternatePhone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary text-xl mt-1 mr-4">
                  <Mail />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p>{RESTAURANT_INFO.email}</p>
                  <p>{RESTAURANT_INFO.reservationEmail}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary text-xl mt-1 mr-4">
                  <Clock />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Hours</h3>
                  <p>Monday - Friday: {RESTAURANT_INFO.hours.weekdays}</p>
                  <p>Saturday - Sunday: {RESTAURANT_INFO.hours.weekends}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-bold text-lg mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href={RESTAURANT_INFO.social.facebook} 
                  className="text-neutral hover:text-primary text-xl transition"
                  aria-label="Facebook"
                >
                  <Facebook />
                </a>
                <a 
                  href={RESTAURANT_INFO.social.instagram} 
                  className="text-neutral hover:text-primary text-xl transition"
                  aria-label="Instagram"
                >
                  <Instagram />
                </a>
                <a 
                  href={RESTAURANT_INFO.social.twitter} 
                  className="text-neutral hover:text-primary text-xl transition"
                  aria-label="Twitter"
                >
                  <Twitter />
                </a>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <ContactForm />
          </div>
        </div>
        
        {/* Map placeholder */}
        <div className="mt-16 h-96 bg-neutral rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-500 mb-4 mx-auto" />
              <p className="text-xl font-medium text-gray-500">Interactive Map Will Be Displayed Here</p>
              <p className="text-gray-500">
                {RESTAURANT_INFO.address}, {RESTAURANT_INFO.city}, {RESTAURANT_INFO.state} {RESTAURANT_INFO.zip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
