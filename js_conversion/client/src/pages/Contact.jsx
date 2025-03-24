import React from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_SECTION, RESTAURANT_INFO } from "@/lib/constants";
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from "lucide-react";

const Contact = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Contact Header */}
      <section className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4 sm:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{CONTACT_SECTION.heading}</h1>
          <p className="max-w-2xl mx-auto">{CONTACT_SECTION.description}</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-700">{RESTAURANT_INFO.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <PhoneIcon className="h-5 w-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-700">{RESTAURANT_INFO.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MailIcon className="h-5 w-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-700">{RESTAURANT_INFO.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Opening Hours</h3>
                    <div className="text-gray-700">
                      <p>Monday - Friday: {RESTAURANT_INFO.hours.weekdays}</p>
                      <p>Saturday - Sunday: {RESTAURANT_INFO.hours.weekends}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-8">
                <h3 className="font-medium mb-3">Our Location</h3>
                <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Map would be displayed here</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;