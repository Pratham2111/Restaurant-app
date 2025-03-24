import { Layout } from "../components/layout/Layout";
import { BookingForm } from "../components/booking/BookingForm";
import { BOOKING_SECTION } from "../lib/constants";

/**
 * Booking page component
 * Allows users to make restaurant reservations
 */
function Booking() {
  return (
    <Layout>
      {/* Booking page header */}
      <div className="bg-muted/30 py-12">
        <div className="container text-center">
          <h3 className="text-primary font-medium mb-2">
            {BOOKING_SECTION.subtitle}
          </h3>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {BOOKING_SECTION.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {BOOKING_SECTION.description}
          </p>
        </div>
      </div>
      
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Booking form */}
          <div>
            <BookingForm />
          </div>
          
          {/* Booking information */}
          <div>
            <div className="bg-muted/30 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Reservation Information</h3>
              
              {/* Reservation details */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Opening Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Monday - Friday:</strong> 11:00 AM - 10:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Saturday - Sunday:</strong> 10:00 AM - 11:00 PM
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Reservation Policy</h4>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>Reservations are recommended, especially for weekends and holidays.</li>
                    <li>Please arrive within 15 minutes of your reservation time.</li>
                    <li>For parties of 6 or more, please call the restaurant directly.</li>
                    <li>A credit card is required for reservations on Fridays and Saturdays.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Special Requests</h4>
                  <p className="text-sm text-muted-foreground">
                    For special occasions or specific seating requests, please mention in the comments section of your booking or contact us directly.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    Cancellations must be made at least 24 hours in advance. Late cancellations or no-shows may result in a fee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Booking;