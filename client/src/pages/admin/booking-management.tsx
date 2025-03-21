import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Loader2, Search } from "lucide-react";
import type { Booking, Table as TableType } from "@shared/schema";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function BookingManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const { translate } = useSiteSettings();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading: loadingBookings, error: bookingsError } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  const { data: tables } = useQuery<TableType[]>({
    queryKey: ["/api/tables"],
    refetchInterval: 5000,
    staleTime: 0
  });

  const getTableName = (tableId: number) => {
    const table = tables?.find(t => t.id === tableId);
    return table ? table.name : `Table ${tableId}`;
  };

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery);

    let matchesDate = true;
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    switch (dateFilter) {
      case "today":
        matchesDate = bookingDate >= today && bookingDate < tomorrow;
        break;
      case "tomorrow":
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        matchesDate = bookingDate >= tomorrow && bookingDate < dayAfterTomorrow;
        break;
      case "thisWeek":
        matchesDate = bookingDate >= today && bookingDate <= nextWeek;
        break;
      default:
        matchesDate = true;
    }

    return matchesSearch && matchesDate;
  });

  const pagination = usePagination({
    totalItems: filteredBookings?.length || 0,
    itemsPerPage: 10
  });

  const paginatedBookings = filteredBookings?.slice(
    pagination.startIndex,
    pagination.endIndex
  );

  if (loadingBookings) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bookingsError) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-destructive">
        {translate("Error loading bookings. Please try again.")}
      </div>
    );
  }

  return (
    <PageSection>
      <div className="max-w-[1440px] mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{translate("Table Bookings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={translate("Search by name, email or phone...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[300px]"
                />
              </div>
              <Select
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                <SelectTrigger className="sm:max-w-[200px]">
                  <SelectValue placeholder={translate("Filter by date")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translate("All Dates")}</SelectItem>
                  <SelectItem value="today">{translate("Today")}</SelectItem>
                  <SelectItem value="tomorrow">{translate("Tomorrow")}</SelectItem>
                  <SelectItem value="thisWeek">{translate("This Week")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{translate("Date & Time")}</TableHead>
                    <TableHead>{translate("Table")}</TableHead>
                    <TableHead>{translate("Guest Name")}</TableHead>
                    <TableHead>{translate("Contact")}</TableHead>
                    <TableHead>{translate("Guests")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBookings && paginatedBookings.length > 0 ? (
                    paginatedBookings
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            {format(new Date(booking.date), "PPP p")}
                          </TableCell>
                          <TableCell>{getTableName(booking.tableId)}</TableCell>
                          <TableCell>{booking.name}</TableCell>
                          <TableCell>
                            <div>
                              <div>{booking.email}</div>
                              <div className="text-sm text-muted-foreground">
                                {booking.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.guestCount}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        {translate("No bookings found")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredBookings && filteredBookings.length > 0 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={pagination.prevPage}
                        className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => pagination.goToPage(page)}
                          isActive={pagination.currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={pagination.nextPage}
                        className={
                          pagination.currentPage === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageSection>
  );
}