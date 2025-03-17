import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { PageSection } from "@/components/ui/page-section";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

type Booking = {
  id: number;
  table_id: number;
  date: string;
  name: string;
  email: string;
  phone: string;
  guest_count: number;
};

type Table = {
  id: number;
  name: string;
  section: string;
  seats: number;
};

export default function BookingManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const { data: bookings, isLoading: loadingBookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: tables } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
  });

  console.log("Bookings data:", bookings); // Debug log
  console.log("Tables data:", tables); // Debug log

  const getTableName = (tableId: number) => {
    const table = tables?.find(t => t.id === tableId);
    return table ? table.name : `Table ${tableId}`;
  };

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery);

    const matchesDate = dateFilter === "all" || 
      (dateFilter === "today" && new Date(booking.date).toDateString() === new Date().toDateString()) ||
      (dateFilter === "tomorrow" && new Date(booking.date).toDateString() === new Date(Date.now() + 86400000).toDateString()) ||
      (dateFilter === "thisWeek" && new Date(booking.date) <= new Date(Date.now() + 7 * 86400000));

    return matchesSearch && matchesDate;
  });

  console.log("Filtered bookings:", filteredBookings); // Debug log

  if (loadingBookings) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Table Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                  placeholder="Search by name, email or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sm:max-w-[300px]"
                />
                <Select
                  value={dateFilter}
                  onValueChange={setDateFilter}
                >
                  <SelectTrigger className="sm:max-w-[200px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Guests</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings && filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            {format(new Date(booking.date), "PPP")}
                          </TableCell>
                          <TableCell>{getTableName(booking.table_id)}</TableCell>
                          <TableCell>{booking.name}</TableCell>
                          <TableCell>
                            <div>
                              <div>{booking.email}</div>
                              <div className="text-sm text-muted-foreground">
                                {booking.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.guest_count}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {loadingBookings ? "Loading bookings..." : "No bookings found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </div>
  );
}