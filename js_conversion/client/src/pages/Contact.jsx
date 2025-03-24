import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "../components/contact/ContactForm";
import { CONTACT_SECTION, RESTAURANT_INFO } from "../lib/constants";

const Contact = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{CONTACT_SECTION.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {CONTACT_SECTION.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Contact info section */}
        <div>
          {/* Contact image */}
          <div className="relative rounded-lg overflow-hidden aspect-video mb-8">
            <img
              src={CONTACT_SECTION.image}
              alt="Restaurant exterior"
              className="object-cover w-full h-full"
            />
          </div>
          
          {/* Contact details */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-lg mb-1">Location</h3>
                <p className="text-muted-foreground">{RESTAURANT_INFO.address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-lg mb-1">Phone</h3>
                <p className="text-muted-foreground">{RESTAURANT_INFO.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-lg mb-1">Email</h3>
                <p className="text-muted-foreground">{RESTAURANT_INFO.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-lg mb-1">Opening Hours</h3>
                <ul className="text-muted-foreground space-y-1">
                  {Object.entries(RESTAURANT_INFO.openingHours).map(([day, hours]) => (
                    <li key={day} className="flex justify-between gap-4">
                      <span className="capitalize">{day}:</span>
                      <span>{hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact form section */}
        <div className="bg-card rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;