import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

/**
 * ContactForm component for the contact page
 * Allows users to send messages to the restaurant
 */
export const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Mutation for submitting the contact message
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      return await apiRequest("/api/contact-messages", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you shortly!",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "There was a problem sending your message. Please try again.",
      });
    },
  });
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name field */}
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
        
        {/* Email field */}
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
      </div>
      
      {/* Subject field */}
      <div>
        <Label htmlFor="subject" className="block mb-2">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject of your inquiry"
          required
        />
      </div>
      
      {/* Message field */}
      <div>
        <Label htmlFor="message" className="block mb-2">Message</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          rows={6}
          required
        />
      </div>
      
      {/* Submit button */}
      <Button type="submit" className="w-full md:w-auto" size="lg" disabled={isPending}>
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};