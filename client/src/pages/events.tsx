import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { PageSection } from "@/components/ui/page-section";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@shared/schema";

export default function Events() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return (
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">Our Events</h1>
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">Our Events</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event, index) => (
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
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {event.title}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(event.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {events?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found.</p>
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
}
