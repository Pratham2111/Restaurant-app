import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Square, Circle, RectangleHorizontal } from "lucide-react";
import type { Table } from "@shared/schema";

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTableId, setSelectedTableId] = useState<number>(0);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guestCount: 2,
      tableId: 0,
      date: ""
    }
  });

  const { data: availableTables } = useQuery<Table[]>({
    queryKey: ["/api/tables/available", selectedDate?.toISOString()],
    enabled: !!selectedDate,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed",
        description: "Your table has been successfully booked!"
      });
      form.reset();
      setSelectedDate(undefined);
      setSelectedTableId(0);
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your table. Please try again.",
        variant: "destructive"
      });
    }
  });

  function onSubmit(data: any) {
    if (!selectedDate) {
      toast({
        title: "Select a Date",
        description: "Please select a date for your booking",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTableId) {
      toast({
        title: "Select a Table",
        description: "Please select a table for your booking",
        variant: "destructive"
      });
      return;
    }

    bookingMutation.mutate({
      ...data,
      tableId: selectedTableId,
      date: selectedDate.toISOString()
    });
  }

  const getTableIcon = (shape: string) => {
    switch (shape) {
      case 'square':
        return <Square className="h-6 w-6" />;
      case 'round':
        return <Circle className="h-6 w-6" />;
      case 'rectangular':
        return <RectangleHorizontal className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'main':
        return 'bg-blue-100';
      case 'outdoor':
        return 'bg-green-100';
      case 'private':
        return 'bg-purple-100';
      case 'bar':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book a Table</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">1. Select a Date</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={{ before: new Date() }}
              className="rounded-md border shadow"
            />
          </div>

          {selectedDate && (
            <div>
              <h2 className="text-lg font-semibold mb-4">2. Choose a Table</h2>
              <div className="grid grid-cols-2 gap-4">
                {availableTables?.map(table => (
                  <Card
                    key={table.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTableId === table.id
                        ? 'ring-2 ring-restaurant-yellow'
                        : ''
                    }`}
                    onClick={() => {
                      setSelectedTableId(table.id);
                      form.setValue('tableId', table.id);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{table.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {table.seats} seats
                          </p>
                        </div>
                        {getTableIcon(table.shape)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${getSectionColor(table.section)}`}>
                        {table.section}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedDate && selectedTableId > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">3. Enter Your Details</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Guests</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="10"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? "Booking..." : "Book Table"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}