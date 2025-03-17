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
import { Square, Circle, RectangleHorizontal, AlertCircle } from "lucide-react";
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

  const { data: tables, isLoading: loadingTables } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
    enabled: !!selectedDate,
  });

  const availableTables = tables?.filter(table => table.status === "available");

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
        return 'bg-blue-100 text-blue-800';
      case 'outdoor':
        return 'bg-green-100 text-green-800';
      case 'private':
        return 'bg-purple-100 text-purple-800';
      case 'bar':
        return 'bg-orange-100 text-orange-800';
      case 'window':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loadingTables) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">Loading tables...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-background py-8">
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

          {selectedDate && tables && (
            <div>
              <h2 className="text-lg font-semibold mb-4">2. Choose a Table</h2>
              <div className="grid grid-cols-2 gap-4">
                {tables.map(table => {
                  const isAvailable = table.status === 'available';
                  return (
                    <Card
                      key={table.id}
                      className={`relative transition-all duration-200 ${
                        isAvailable
                          ? 'cursor-pointer hover:shadow-lg'
                          : 'opacity-60 cursor-not-allowed'
                      } ${
                        selectedTableId === table.id && isAvailable
                          ? 'ring-2 ring-restaurant-yellow'
                          : ''
                      }`}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedTableId(table.id);
                          form.setValue('tableId', table.id);
                        }
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
                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${getSectionColor(table.section)}`}>
                            {table.section}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(table.status)}`}>
                            {table.status}
                          </span>
                        </div>
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <AlertCircle className="h-4 w-4" />
                              <span>Not Available</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
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