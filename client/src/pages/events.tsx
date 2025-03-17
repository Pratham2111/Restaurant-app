import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import { PageSection } from "@/components/ui/page-section";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Event } from "@shared/schema";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<string>("all");
  const [filterDateRange, setFilterDateRange] = useState<"all" | "upcoming" | "past">("all");
  const { translate } = useSiteSettings();

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
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

  if (isLoading) {
    return (
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">{translate("Our Events")}</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageSection>
    );
  }

  return (
    <div className="w-full">
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">{translate("Our Events")}</h1>

          {/* Filters Section */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center space-x-2 bg-card rounded-lg p-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={translate("Search events...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{translate("Featured Status")}</Label>
                <Select
                  value={filterFeatured}
                  onValueChange={setFilterFeatured}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={translate("Filter by featured")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{translate("All Events")}</SelectItem>
                    <SelectItem value="featured">{translate("Featured Only")}</SelectItem>
                    <SelectItem value="non-featured">{translate("Non-Featured Only")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{translate("Date Range")}</Label>
                <Select
                  value={filterDateRange}
                  onValueChange={setFilterDateRange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={translate("Filter by date")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{translate("All Events")}</SelectItem>
                    <SelectItem value="upcoming">{translate("Upcoming Events")}</SelectItem>
                    <SelectItem value="past">{translate("Past Events")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents?.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group h-full">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={translate(event.title)}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {translate(event.title)}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(event.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {translate(event.description)}
                    </p>
                    {event.featured && (
                      <span className="inline-block mt-2 text-xs bg-restaurant-yellow/20 text-restaurant-yellow px-2 py-1 rounded">
                        {translate("Featured")}
                      </span>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredEvents?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{translate("No events found.")}</p>
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
}