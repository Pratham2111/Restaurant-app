import { BookingForm } from "../components/booking/BookingForm";
import { BOOKING_SECTION } from "../lib/constants";

const Booking = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Booking info section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{BOOKING_SECTION.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {BOOKING_SECTION.description}
          </p>
          
          {/* Restaurant image */}
          <div className="relative rounded-lg overflow-hidden aspect-video">
            <img
              src={BOOKING_SECTION.image}
              alt="Restaurant interior"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* Booking form section */}
        <div className="bg-card rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6">Make a Reservation</h2>
          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default Booking;