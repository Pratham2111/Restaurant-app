import { Layout } from "../components/layout/Layout";
import { BookingForm } from "../components/booking/BookingForm";
import { BOOKING_SECTION } from "../lib/constants";

/**
 * Booking page component
 * Allows customers to make table reservations
 */
function Booking() {
  return (
    <Layout>
      {/* Page header */}
      <div className="relative">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={BOOKING_SECTION.image}
            alt="Restaurant tables"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        {/* Content */}
        <div className="relative container py-24 md:py-32">
          <div className="max-w-lg">
            <h3 className="text-primary-foreground/90 font-medium mb-3 md:text-lg">
              {BOOKING_SECTION.subtitle}
            </h3>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {BOOKING_SECTION.title}
            </h1>
            <p className="text-primary-foreground/80 md:text-lg mb-8">
              {BOOKING_SECTION.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Booking form */}
      <div className="container py-16 md:py-24">
        <div className="max-w-xl mx-auto">
          <BookingForm />
        </div>
      </div>
    </Layout>
  );
}

export default Booking;