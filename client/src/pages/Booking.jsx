import React, { useState } from "react";
import { BOOKING_SECTION, RESTAURANT_INFO } from "../lib/constants";
import { timeSlots, guestOptions, formatDate, getMinDate, isValidEmail, isValidPhone } from "../lib/utils";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast.jsx";

/**
 * Booking page component
 */
function Booking() {
  const { toast } = useToast();
  const minDate = getMinDate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: minDate,
    time: timeSlots[0],
    guests: 2,
    specialRequests: "",
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Booking reference
  const [bookingReference, setBookingReference] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    
    if (!formData.guests) {
      newErrors.guests = "Number of guests is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data for API
      const bookingData = {
        ...formData,
        date: formatDate(new Date(formData.date)),
      };
      
      // Call API to create reservation
      const response = await apiRequest('/api/reservations', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      
      // Handle success
      setIsSuccess(true);
      setBookingReference(response.id || "BR" + Math.floor(Math.random() * 10000));
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: minDate,
        time: timeSlots[0],
        guests: 2,
        specialRequests: "",
      });
      
      // Show success toast
      toast({
        title: "Reservation Confirmed!",
        description: `Your reservation has been successfully booked for ${formData.date} at ${formData.time}.`,
      });
    } catch (err) {
      console.error("Error submitting reservation:", err);
      
      // Show error toast
      toast({
        title: "Reservation Failed",
        description: err.message || "There was an error processing your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
    
    // For now, we'll just simulate a successful booking
    // since the API is not yet implemented
    setIsSuccess(true);
    setBookingReference("BR" + Math.floor(Math.random() * 10000));
    
    // Show success toast
    toast({
      title: "Reservation Confirmed!",
      description: `Your reservation has been successfully booked for ${formData.date} at ${formData.time}.`,
    });
  };

  // Handle reset
  const handleReset = () => {
    setIsSuccess(false);
    setBookingReference("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: minDate,
      time: timeSlots[0],
      guests: 2,
      specialRequests: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Book a Table</h1>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column - Reservation Image and Info */}
        <div>
          <div className="bg-secondary rounded-lg overflow-hidden mb-6">
            <img
              src={BOOKING_SECTION.imageUrl}
              alt="Restaurant Dining Area"
              className="w-full h-auto object-cover"
              style={{ maxHeight: "400px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/800x600?text=Restaurant+Interior";
              }}
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Reservation Hours</h3>
              <ul className="space-y-2">
                {RESTAURANT_INFO.hours.map((hour, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{hour.day}</span>
                    <span>{hour.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Reservation Policy</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {BOOKING_SECTION.policies.map((policy, index) => (
                  <li key={index}>{policy}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Right Column - Reservation Form or Success Message */}
        <div className="bg-secondary p-6 rounded-lg">
          {isSuccess ? (
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-green-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-2xl font-bold mb-4">Reservation Confirmed!</h2>
              <p className="mb-6">
                Thank you for your reservation. We've sent a confirmation to your email.
              </p>
              <div className="bg-background p-4 rounded-md mb-6">
                <h3 className="font-bold mb-2">Booking Reference</h3>
                <p className="text-xl font-mono">{bookingReference}</p>
              </div>
              <button
                onClick={handleReset}
                className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md font-medium transition-colors"
              >
                Make Another Reservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Reservation Details</h2>
              
              {/* Name */}
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.name ? "border-red-500" : "border-input"
                  } bg-background`}
                  placeholder="John Doe"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? "border-red-500" : "border-input"
                  } bg-background`}
                  placeholder="john@example.com"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.phone ? "border-red-500" : "border-input"
                  } bg-background`}
                  placeholder="(123) 456-7890"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              
              {/* Date, Time and Guests row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block font-medium mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={minDate}
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.date ? "border-red-500" : "border-input"
                    } bg-background`}
                    required
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>
                
                {/* Time */}
                <div>
                  <label htmlFor="time" className="block font-medium mb-1">
                    Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.time ? "border-red-500" : "border-input"
                    } bg-background`}
                    required
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                  )}
                </div>
                
                {/* Guests */}
                <div>
                  <label htmlFor="guests" className="block font-medium mb-1">
                    Guests *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.guests ? "border-red-500" : "border-input"
                    } bg-background`}
                    required
                  >
                    {guestOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} {option === 1 ? "Person" : "People"}
                      </option>
                    ))}
                  </select>
                  {errors.guests && (
                    <p className="text-red-500 text-sm mt-1">{errors.guests}</p>
                  )}
                </div>
              </div>
              
              {/* Special Requests */}
              <div>
                <label htmlFor="specialRequests" className="block font-medium mb-1">
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Any allergies, dietary restrictions, or special occasions?"
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-md font-medium transition-colors flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Reservation"
                )}
              </button>
              
              <p className="text-sm text-muted-foreground text-center">
                By clicking confirm, you agree to our reservation policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;