import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
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
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EventsManagement() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<string>("all");
  const [filterDateRange, setFilterDateRange] = useState<"all" | "upcoming" | "past">("all");
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

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      imageUrl: "",
      date: "",
      featured: false
    });
    setSelectedDate(undefined);
    setEditingEvent(null);
  };

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"]
  });

  // Filter events based on search and filters
  const filteredEvents = events?.filter(event => {
    const matchesSearch = 
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFeatured = 
      filterFeatured === "all" ||
      (filterFeatured === "featured" && event.featured) ||
      (filterFeatured === "non-featured" && !event.featured);

    const eventDate = new Date(event.date);
    const today = new Date();
    const matchesDateRange =
      filterDateRange === "all" ||
      (filterDateRange === "upcoming" && eventDate >= today) ||
      (filterDateRange === "past" && eventDate < today);

    return matchesSearch && matchesFeatured && matchesDateRange;
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
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add event. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest("PATCH", `/api/events/${id}`, data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update event');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Success",
        description: "Event has been updated successfully"
      });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update event. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/events/${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete event');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Success",
        description: "Event has been deleted successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    form.reset({
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      featured: event.featured,
      date: event.date
    });
    setSelectedDate(new Date(event.date));
  };

  function onSubmit(data: any) {
    if (!selectedDate) {
      toast({
        title: "Select a Date",
        description: "Please select a date for the event",
        variant: "destructive"
      });
      return;
    }

    const eventData = {
      ...data,
      date: selectedDate.toISOString()
    };

    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, data: eventData });
    } else {
      addEventMutation.mutate(eventData);
    }
  }

  return (
    <div className="w-full">
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{editingEvent ? "Edit Event" : "Add New Event"}</CardTitle>
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
                      className="w-full"
                      disabled={addEventMutation.isPending || updateEventMutation.isPending}
                    >
                      {(addEventMutation.isPending || updateEventMutation.isPending) ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingEvent ? "Updating..." : "Adding Event..."}
                        </span>
                      ) : (
                        editingEvent ? "Update Event" : "Add Event"
                      )}
                    </Button>

                    {editingEvent && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={resetForm}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Event Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormLabel>Featured Status</FormLabel>
                      <Select
                        value={filterFeatured}
                        onValueChange={setFilterFeatured}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by featured" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Events</SelectItem>
                          <SelectItem value="featured">Featured Only</SelectItem>
                          <SelectItem value="non-featured">Non-Featured Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Date Range</FormLabel>
                      <Select
                        value={filterDateRange}
                        onValueChange={setFilterDateRange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Dates</SelectItem>
                          <SelectItem value="upcoming">Upcoming Events</SelectItem>
                          <SelectItem value="past">Past Events</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Events List</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center py-8"
                      >
                        <Loader2 className="h-8 w-8 animate-spin text-restaurant-yellow" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {filteredEvents?.map(event => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card>
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
                                      onClick={() => handleEditClick(event)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the event.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => deleteEventMutation.mutate(event.id)}
                                            disabled={deleteEventMutation.isPending}
                                          >
                                            {deleteEventMutation.isPending ? (
                                              <span className="flex items-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Deleting...
                                              </span>
                                            ) : (
                                              "Delete"
                                            )}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isLoading && filteredEvents?.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <p className="text-muted-foreground">No events found.</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}