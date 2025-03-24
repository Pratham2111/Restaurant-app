import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { formatDate } from "../../lib/utils";

/**
 * Booking Management component for admin dashboard
 */
function BookingManagement() {
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Fetch reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter reservations when filters change
  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, statusFilter, dateFilter]);

  // Calculate stats when reservations change
  useEffect(() => {
    calculateStats();
  }, [reservations]);

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reservations");
      if (!response.ok) throw new Error("Failed to fetch reservations");
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Error",
        description: "Failed to load reservations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter reservations based on search, status, and date
  const filterReservations = () => {
    let filtered = [...reservations];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((reservation) => {
        return (
          reservation.name?.toLowerCase().includes(term) ||
          reservation.email?.toLowerCase().includes(term) ||
          reservation.phone?.toLowerCase().includes(term) ||
          reservation._id?.toLowerCase().includes(term) ||
          reservation.id?.toLowerCase().includes(term)
        );
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter);
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter((reservation) => {
        const reservationDate = new Date(reservation.date).toDateString();
        return reservationDate === filterDate;
      });
    }

    setFilteredReservations(filtered);
  };

  // Calculate reservation statistics
  const calculateStats = () => {
    const total = reservations.length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const confirmed = reservations.filter((r) => r.status === "confirmed").length;
    const cancelled = reservations.filter((r) => r.status === "cancelled").length;

    setStats({ total, pending, confirmed, cancelled });
  };

  // Update reservation status
  const updateReservationStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/reservations/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update reservation status");

      toast({
        title: "Success",
        description: `Reservation ${status === "confirmed" ? "confirmed" : status === "cancelled" ? "cancelled" : "updated"} successfully`,
      });

      // Update reservations list
      fetchReservations();
    } catch (error) {
      console.error("Error updating reservation status:", error);
      toast({
        title: "Error",
        description: "Failed to update reservation status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle view details
  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsDialogOpen(true);
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    return timeString || "No time selected";
  };

  // Render status badge with appropriate styling
  const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "confirmed":
          return "bg-green-100 text-green-800 border-green-200";
        case "cancelled":
          return "bg-red-100 text-red-800 border-red-200";
        case "pending":
        default:
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
      }
    };

    const getStatusIcon = () => {
      switch (status) {
        case "confirmed":
          return <CheckCircle className="h-4 w-4 mr-1" />;
        case "cancelled":
          return <XCircle className="h-4 w-4 mr-1" />;
        case "pending":
        default:
          return <Clock className="h-4 w-4 mr-1" />;
      }
    };

    return (
      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
        {getStatusIcon()}
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-medium">Reservation Management</h3>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reservations..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-full md:w-auto">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setDateFilter("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Reservation Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>
              View and manage reservation information
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{selectedReservation.name}</h3>
                <StatusBadge status={selectedReservation.status} />
              </div>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Reservation ID</Label>
                    <p>{selectedReservation.id || selectedReservation._id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Date</Label>
                    <p>{formatDisplayDate(selectedReservation.date)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Time</Label>
                    <p>{formatTime(selectedReservation.time)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Party Size</Label>
                    <p>{selectedReservation.guests} guests</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p>{selectedReservation.email || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Phone</Label>
                    <p>{selectedReservation.phone || "Not provided"}</p>
                  </div>
                </div>
                {selectedReservation.specialRequests && (
                  <div className="mt-2">
                    <Label className="text-sm text-muted-foreground">Special Requests</Label>
                    <p className="text-sm border p-2 rounded-md bg-muted mt-1">
                      {selectedReservation.specialRequests}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Label className="text-sm mb-2 block">Update Status</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedReservation.status === "confirmed" ? "default" : "outline"}
                    className={selectedReservation.status === "confirmed" ? "bg-green-600" : ""}
                    onClick={() => {
                      updateReservationStatus(
                        selectedReservation.id || selectedReservation._id,
                        "confirmed"
                      );
                      setIsDetailsDialogOpen(false);
                    }}
                    disabled={selectedReservation.status === "confirmed"}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                  </Button>
                  <Button
                    variant={selectedReservation.status === "cancelled" ? "default" : "outline"}
                    className={selectedReservation.status === "cancelled" ? "bg-red-600" : ""}
                    onClick={() => {
                      updateReservationStatus(
                        selectedReservation.id || selectedReservation._id,
                        "cancelled"
                      );
                      setIsDetailsDialogOpen(false);
                    }}
                    disabled={selectedReservation.status === "cancelled"}
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  {selectedReservation.status !== "pending" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateReservationStatus(
                          selectedReservation.id || selectedReservation._id,
                          "pending"
                        );
                        setIsDetailsDialogOpen(false);
                      }}
                      disabled={selectedReservation.status === "pending"}
                    >
                      <Clock className="h-4 w-4 mr-1" /> Mark as Pending
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reservations Table */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          {reservations.length === 0
            ? "No reservations found."
            : "No reservations match your search criteria."}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id || reservation._id}>
                    <TableCell className="font-medium">{reservation.name}</TableCell>
                    <TableCell>
                      {formatDate(reservation.date)}
                      <br />
                      <span className="text-xs text-muted-foreground">{reservation.time}</span>
                    </TableCell>
                    <TableCell>{reservation.guests} guests</TableCell>
                    <TableCell>
                      {reservation.email && (
                        <div className="text-sm">{reservation.email}</div>
                      )}
                      {reservation.phone && (
                        <div className="text-xs text-muted-foreground">
                          {reservation.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={reservation.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(reservation)}
                        >
                          View Details
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-green-600"
                                onClick={() =>
                                  updateReservationStatus(
                                    reservation.id || reservation._id,
                                    "confirmed"
                                  )
                                }
                                disabled={reservation.status === "confirmed"}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Confirm Reservation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-600"
                                onClick={() =>
                                  updateReservationStatus(
                                    reservation.id || reservation._id,
                                    "cancelled"
                                  )
                                }
                                disabled={reservation.status === "cancelled"}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cancel Reservation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingManagement;