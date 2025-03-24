import { Layout } from "../components/layout/Layout";
import { ContactForm } from "../components/contact/ContactForm";
import { CONTACT_SECTION, RESTAURANT_INFO } from "../lib/constants";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

/**
 * Contact page component
 * Displays contact information and contact form
 */
function Contact() {
  return (
    <Layout>
      {/* Contact page header */}
      <div className="bg-muted/30 py-12">
        <div className="container text-center">
          <h3 className="text-primary font-medium mb-2">
            {CONTACT_SECTION.subtitle}
          </h3>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {CONTACT_SECTION.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {CONTACT_SECTION.description}
          </p>
        </div>
      </div>
      
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact form */}
          <div>
            <ContactForm />
          </div>
          
          {/* Contact information */}
          <div>
            <div className="bg-muted/30 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <address className="text-sm text-muted-foreground not-italic">
                      {RESTAURANT_INFO.address.street}<br />
                      {RESTAURANT_INFO.address.city}, {RESTAURANT_INFO.address.state} {RESTAURANT_INFO.address.zip}
                    </address>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Phone</h4>
                    <p className="text-sm text-muted-foreground">
                      <a 
                        href={`tel:${RESTAURANT_INFO.phone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {RESTAURANT_INFO.phone}
                      </a>
                      <span className="block text-xs mt-1">
                        Available during business hours
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-sm text-muted-foreground">
                      <a 
                        href={`mailto:${RESTAURANT_INFO.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        {RESTAURANT_INFO.email}
                      </a>
                      <span className="block text-xs mt-1">
                        We'll respond as soon as possible
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Hours</h4>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-1">
                        <strong>Monday - Friday:</strong> 11:00 AM - 10:00 PM
                      </p>
                      <p>
                        <strong>Saturday - Sunday:</strong> 10:00 AM - 11:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Google Map */}
              <div className="mt-8 rounded-md overflow-hidden border border-border h-[250px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142047342088!2d2.3354330156693704!3d48.88626970866236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e38f8174699%3A0x8cf2191d961d5e0c!2s75009%20Paris%2C%20France!5e0!3m2!1sen!2sus!4v1624471461420!5m2!1sen!2sus"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Restaurant Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Contact;