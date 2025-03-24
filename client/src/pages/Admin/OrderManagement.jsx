import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Loader2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  TruckIcon,
  BadgeCheck,
} from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { formatCurrency } from "../../lib/utils";

/**
 * Order Management component for admin dashboard
 */
function OrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders when filters change
  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Calculate stats when orders change
  useEffect(() => {
    calculateStats();
  }, [orders]);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search, status, and date
  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((order) => {
        const customerName = order.customer?.name || order.customerName || '';
        const customerEmail = order.customer?.email || order.customerEmail || '';
        const customerPhone = order.customer?.phone || order.customerPhone || '';
        
        return (
          customerName.toLowerCase().includes(term) ||
          customerEmail.toLowerCase().includes(term) ||
          customerPhone.toLowerCase().includes(term) ||
          (order._id || order.id)?.toLowerCase().includes(term)
        );
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter((order) => {
        const createdAt = new Date(order.createdAt).toDateString();
        return createdAt === filterDate;
      });
    }

    setFilteredOrders(filtered);
  };

  // Calculate order statistics
  const calculateStats = () => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    const completed = orders.filter((o) => o.status === "completed").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    
    // Calculate total revenue from completed orders
    const totalRevenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);

    setStats({ total, pending, processing, completed, cancelled, totalRevenue });
  };

  // Update order status
  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      toast({
        title: "Success",
        description: `Order status updated to ${status} successfully`,
      });

      // Update orders list
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle view details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Calculate order total
  const calculateOrderTotal = (order) => {
    // If total is already calculated and stored
    if (order.total) return parseFloat(order.total);
    
    // If we need to calculate from items
    if (order.items && order.items.length > 0) {
      return order.items.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        return sum + (price * quantity);
      }, 0);
    }
    
    return 0;
  };

  // Get customer name from order
  const getCustomerName = (order) => {
    return order.customer?.name || order.customerName || "Anonymous";
  };

  // Get customer email from order
  const getCustomerEmail = (order) => {
    return order.customer?.email || order.customerEmail || "No email provided";
  };

  // Get customer phone from order
  const getCustomerPhone = (order) => {
    return order.customer?.phone || order.customerPhone || "No phone provided";
  };

  // Render status badge with appropriate styling
  const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800 border-green-200";
        case "cancelled":
          return "bg-red-100 text-red-800 border-red-200";
        case "processing":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "pending":
        default:
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
      }
    };

    const getStatusIcon = () => {
      switch (status) {
        case "completed":
          return <BadgeCheck className="h-4 w-4 mr-1" />;
        case "cancelled":
          return <XCircle className="h-4 w-4 mr-1" />;
        case "processing":
          return <TruckIcon className="h-4 w-4 mr-1" />;
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-medium">Order Management</h3>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
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
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View and manage order information
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order #{selectedOrder.id || selectedOrder._id}</h3>
                <StatusBadge status={selectedOrder.status} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {getCustomerName(selectedOrder)}</p>
                    <p><span className="text-muted-foreground">Email:</span> {getCustomerEmail(selectedOrder)}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {getCustomerPhone(selectedOrder)}</p>
                  </div>
                  
                  <h4 className="font-medium mt-4 mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Order Date:</span> {formatDisplayDate(selectedOrder.createdAt || selectedOrder.timestamp)}</p>
                    <p><span className="text-muted-foreground">Payment Method:</span> {selectedOrder.paymentMethod || "Credit Card"}</p>
                    <p><span className="text-muted-foreground">Delivery Method:</span> {selectedOrder.deliveryMethod || "Delivery"}</p>
                    {selectedOrder.address && (
                      <p><span className="text-muted-foreground">Delivery Address:</span> {selectedOrder.address}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.quantity || 1}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal || calculateOrderTotal(selectedOrder))}</span>
                    </div>
                    {selectedOrder.tax && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax:</span>
                        <span>{formatCurrency(selectedOrder.tax)}</span>
                      </div>
                    )}
                    {selectedOrder.deliveryFee && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Fee:</span>
                        <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total || calculateOrderTotal(selectedOrder))}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Order Notes</h4>
                  <p className="text-sm border p-2 rounded-md bg-muted">{selectedOrder.notes}</p>
                </div>
              )}
              
              <div className="mt-6">
                <Label className="text-sm mb-2 block">Update Status</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedOrder.status === "pending" ? "default" : "outline"}
                    className={selectedOrder.status === "pending" ? "bg-yellow-600" : ""}
                    onClick={() => {
                      updateOrderStatus(
                        selectedOrder.id || selectedOrder._id,
                        "pending"
                      );
                      setIsDetailsDialogOpen(false);
                    }}
                    disabled={selectedOrder.status === "pending"}
                  >
                    <Clock className="h-4 w-4 mr-1" /> Pending
                  </Button>
                  <Button
                    variant={selectedOrder.status === "processing" ? "default" : "outline"}
                    className={selectedOrder.status === "processing" ? "bg-blue-600" : ""}
                    onClick={() => {
                      updateOrderStatus(
                        selectedOrder.id || selectedOrder._id,
                        "processing"
                      );
                      setIsDetailsDialogOpen(false);
                    }}
                    disabled={selectedOrder.status === "processing"}
                  >
                    <Package className="h-4 w-4 mr-1" /> Processing
                  </Button>
                  <Button
                    variant={selectedOrder.status === "completed" ? "default" : "outline"}
                    className={selectedOrder.status === "completed" ? "bg-green-600" : ""}
                    onClick={() => {
                      updateOrderStatus(
                        selectedOrder.id || selectedOrder._id,
                        "completed"
                      );
                      setIsDetailsDialogOpen(false);
                    }}
                    disabled={selectedOrder.status === "completed"}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Completed
                  </Button>
                  <Button
                    variant={selectedOrder.status === "cancelled" ? "default" : "outline"}
                    className={selectedOrder.status === "cancelled" ? "bg-red-600" : ""}
                    onClick={() => {
                      updateOrderStatus(
                        selectedOrder.id || selectedOrder._id,
                        "cancelled"
                      );
                      setIsDetailsDialogOpen(false);
                    }}
                    disabled={selectedOrder.status === "cancelled"}
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Cancelled
                  </Button>
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

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          {orders.length === 0
            ? "No orders found."
            : "No orders match your search criteria."}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id || order._id}>
                    <TableCell className="font-medium">
                      #{(order.id || order._id).substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>{getCustomerName(order)}</div>
                      <div className="text-xs text-muted-foreground">{getCustomerEmail(order)}</div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt || order.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.items ? (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="items">
                            <AccordionTrigger className="text-sm py-1">
                              {order.items.length} Items
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="text-xs space-y-1">
                                {order.items.map((item, index) => (
                                  <li key={index}>{item.quantity || 1}x {item.name}</li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        "No items"
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total || calculateOrderTotal(order))}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          View Details
                        </Button>
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

export default OrderManagement;