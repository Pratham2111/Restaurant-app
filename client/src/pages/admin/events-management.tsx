import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient"; // Import the shared queryClient
import { format } from "date-fns";
import { PageSection } from "@/components/ui/page-section";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";

export default function EventsManagement() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      date: "",
      featured: false
    }
  });

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"]
  });

  const addEventMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/events", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add event');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Success",
        description: "Event has been added successfully"
      });
      form.reset();
      setSelectedDate(undefined);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add event. Please try again.",
        variant: "destructive"
      });
    }
  });

  function onSubmit(data: any) {
    if (!selectedDate) {
      toast({
        title: "Select a Date",
        description: "Please select a date for the event",
        variant: "destructive"
      });
      return;
    }

    addEventMutation.mutate({
      ...data,
      date: selectedDate.toISOString()
    });
  }

  if (isLoading) {
    return (
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <div>Loading...</div>
        </div>
      </PageSection>
    );
  }

  return (
    <div className="w-full">
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Events Management</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add New Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel>Featured Event</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel>Event Date</FormLabel>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md border"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90"
                        disabled={addEventMutation.isPending}
                      >
                        {addEventMutation.isPending ? "Adding..." : "Add Event"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Events List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events?.map(event => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(event.date), 'MMMM dd, yyyy')}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.description}
                              </p>
                              {event.featured && (
                                <span className="inline-block mt-2 text-xs bg-restaurant-yellow/20 text-restaurant-yellow px-2 py-1 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Coming Soon",
                                    description: "Edit functionality will be available soon."
                                  });
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Coming Soon",
                                    description: "Delete functionality will be available soon."
                                  });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}