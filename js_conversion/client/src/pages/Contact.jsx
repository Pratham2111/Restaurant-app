import { Layout } from "../components/layout/Layout";
import { ContactForm } from "../components/contact/ContactForm";
import { CONTACT_SECTION, RESTAURANT_INFO } from "../lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

/**
 * Contact page component
 * Provides contact information and a contact form
 */
function Contact() {
  return (
    <Layout>
      {/* Page header */}
      <div className="bg-muted/50 py-10 lg:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're here to answer any questions you might have about La Mason.
            Feel free to reach out to us through any of the methods below.
          </p>
        </div>
      </div>
      
      {/* Contact information */}
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact info cards */}
          <div>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* Address */}
              <div className="bg-card rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Our Location</h3>
                <p className="text-muted-foreground">
                  {RESTAURANT_INFO.address}
                </p>
              </div>
              
              {/* Phone */}
              <div className="bg-card rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Phone Number</h3>
                <p className="text-muted-foreground">
                  {RESTAURANT_INFO.phone}
                </p>
              </div>
              
              {/* Email */}
              <div className="bg-card rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Address</h3>
                <p className="text-muted-foreground">
                  {RESTAURANT_INFO.email}
                </p>
              </div>
              
              {/* Hours */}
              <div className="bg-card rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                <p className="text-muted-foreground">
                  {CONTACT_SECTION.hours}
                </p>
              </div>
            </div>
            
            {/* Map (placeholder) */}
            <div className="rounded-xl overflow-hidden bg-muted h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Map will be integrated here
              </p>
            </div>
          </div>
          
          {/* Contact form */}
          <div className="bg-card rounded-xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container py-8 mb-12">
        <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {CONTACT_SECTION.faqs.map((faq, index) => (
            <div key={index} className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Contact;