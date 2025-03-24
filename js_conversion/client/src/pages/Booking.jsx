import { Layout } from "../components/layout/Layout";
import { BookingForm } from "../components/booking/BookingForm";
import { BOOKING_SECTION } from "../lib/constants";

/**
 * Booking page component
 * Allows users to make table reservations
 */
function Booking() {
  return (
    <Layout>
      {/* Page header */}
      <div className="bg-muted/50 py-10 lg:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book A Table</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Reserve your table at La Mason for a memorable dining experience.
            We look forward to serving you with our culinary delights and warm hospitality.
          </p>
        </div>
      </div>
      
      {/* Booking section */}
      <div className="container py-12">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Booking form */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="bg-card rounded-xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Make a Reservation</h2>
              <BookingForm />
            </div>
          </div>
          
          {/* Information sidebar */}
          <div className="md:col-span-5 lg:col-span-4">
            {/* Opening hours */}
            <div className="bg-card rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
              <ul className="space-y-2">
                {BOOKING_SECTION.openingHours.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="font-medium">{item.day}</span>
                    <span className="text-muted-foreground">{item.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact info */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="font-medium">Phone:</span>
                  <span className="text-muted-foreground">{BOOKING_SECTION.phone}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Email:</span>
                  <span className="text-muted-foreground">{BOOKING_SECTION.email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Address:</span>
                  <span className="text-muted-foreground">{BOOKING_SECTION.address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional info */}
      <div className="container py-8 mb-10">
        <div className="bg-muted/30 rounded-xl p-6 lg:p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-lg mb-2">Group Bookings</h3>
              <p className="text-muted-foreground text-sm">
                For parties larger than 10 people, please contact us directly
                by phone for special arrangements.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Cancellation Policy</h3>
              <p className="text-muted-foreground text-sm">
                Reservations can be cancelled up to 24 hours in advance without any charges.
                Late cancellations may incur a fee.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Special Events</h3>
              <p className="text-muted-foreground text-sm">
                We offer private dining and event hosting services.
                Contact us for details on hosting your next celebration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Booking;