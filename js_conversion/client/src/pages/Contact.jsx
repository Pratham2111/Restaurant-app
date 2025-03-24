import { Layout } from "../components/layout/Layout";
import { ContactForm } from "../components/contact/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { CONTACT_SECTION, RESTAURANT_INFO } from "../lib/constants";

/**
 * Contact page component
 * Provides contact information and a form for customers to send messages
 */
function Contact() {
  // Contact information cards
  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Our Location",
      description: RESTAURANT_INFO.address,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone Number",
      description: RESTAURANT_INFO.phone,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      description: RESTAURANT_INFO.email,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Opening Hours",
      description: (
        <>
          <div>Monday - Friday: {RESTAURANT_INFO.hoursWeekday}</div>
          <div>Saturday - Sunday: {RESTAURANT_INFO.hoursWeekend}</div>
        </>
      ),
    },
  ];

  return (
    <Layout>
      {/* Page header */}
      <div className="bg-muted/30 py-16">
        <div className="container text-center">
          <h3 className="text-primary font-medium mb-2">
            {CONTACT_SECTION.subtitle}
          </h3>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {CONTACT_SECTION.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {CONTACT_SECTION.description}
          </p>
        </div>
      </div>

      {/* Contact information and form */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Contact information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              We'd love to hear from you! Whether you have a question about our
              menu, want to provide feedback, or are interested in hosting a
              private event, please don't hesitate to reach out.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      {info.icon}
                    </div>
                    <h3 className="font-medium mb-2">{info.title}</h3>
                    <div className="text-muted-foreground text-sm">
                      {info.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mt-12">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDQyJzQ2LjAiTiA3NMKwMDAsMzYuMCJX!5e0!3m2!1sen!2sus!4v1625096899!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Restaurant location"
        ></iframe>
      </div>
    </Layout>
  );
}

export default Contact;