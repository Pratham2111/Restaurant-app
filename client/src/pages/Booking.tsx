import { BookingForm } from "@/components/booking/BookingForm";
import { BOOKING_SECTION } from "@/lib/constants";

const Booking = () => {
  return (
    <div className="bg-light-cream min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral mb-4">
            Reserve a Table
          </h1>
          <p className="max-w-2xl mx-auto text-lg">{BOOKING_SECTION.description}</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral mb-3">
              {BOOKING_SECTION.heading.split(" ").map((word, idx) => (
                <span key={idx} className={idx === BOOKING_SECTION.heading.split(" ").length - 1 ? "text-primary" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            <p className="text-lg mb-8">{BOOKING_SECTION.description}</p>
            <img 
              src={BOOKING_SECTION.image} 
              alt="Restaurant ambiance" 
              className="rounded-lg shadow-lg w-full object-cover h-72"
            />
          </div>
          
          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default Booking;
