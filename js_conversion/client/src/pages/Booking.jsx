import React from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { BOOKING_SECTION } from "@/lib/constants";

const Booking = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Booking Header */}
      <section className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4 sm:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{BOOKING_SECTION.heading}</h1>
          <p className="max-w-2xl mx-auto">
            {BOOKING_SECTION.description}
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <BookingForm />
        </div>
      </section>
    </div>
  );
};

export default Booking;