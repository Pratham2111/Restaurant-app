import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
import { timeSlots, guestOptions, formatDate, getMinDate } from "../../lib/utils";

/**
 * BookingForm component for the booking page
 * Allows users to make a table reservation
 */
export const BookingForm = () => {
  const { toast } = useToast();
  const today = new Date();
  const [date, setDate] = useState(today);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    time: "19:00",
    specialRequests: "",
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Mutation for submitting the reservation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      return await apiRequest("/api/reservations", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Reservation Confirmed",
        description: "Your table has been reserved. We look forward to serving you!",
      });
      
      // Reset form
      setDate(today);
      setFormData({
        name: "",
        email: "",
        phone: "",
        guests: "2",
        time: "19:00",
        specialRequests: "",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Reservation Failed",
        description: error.message || "There was a problem with your reservation. Please try again.",
      });
    },
  });
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const reservation = {
      ...formData,
      date: formatDate(date),
      guests: parseInt(formData.guests),
    };
    
    mutate(reservation);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar for date selection */}
        <div className="md:col-span-2">
          <Label htmlFor="date" className="block mb-2">Select Date</Label>
          <div className="border rounded-md p-4">
            <Calendar
              id="date"
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              fromDate={new Date(getMinDate())}
              className="mx-auto"
            />
          </div>
        </div>
        
        {/* Personal information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block mb-2">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="block mb-2">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="block mb-2">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              required
            />
          </div>
        </div>
        
        {/* Reservation details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="guests" className="block mb-2">Number of Guests</Label>
            <Select
              value={formData.guests}
              onValueChange={(value) => handleSelectChange("guests", value)}
            >
              <SelectTrigger id="guests">
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                {guestOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option} {option === 1 ? "Guest" : "Guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="time" className="block mb-2">Reservation Time</Label>
            <Select
              value={formData.time}
              onValueChange={(value) => handleSelectChange("time", value)}
            >
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="specialRequests" className="block mb-2">
              Special Requests <span className="text-muted-foreground text-sm">(Optional)</span>
            </Label>
            <Input
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any dietary restrictions or special occasions?"
            />
          </div>
        </div>
      </div>
      
      {/* Policies and terms */}
      <div className="text-sm text-muted-foreground">
        <p>
          By making a reservation, you agree to our booking terms and cancellation policy.
          Please arrive 15 minutes before your reservation time.
        </p>
      </div>
      
      {/* Submit button */}
      <div>
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? "Processing..." : "Confirm Reservation"}
        </Button>
      </div>
    </form>
  );
};