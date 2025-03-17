import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

type Order = {
  id: number;
  items: {
    id: number;
    quantity: number;
    name: string;
    price: number;
  }[];
  total: number;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
};

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { translate, formatCurrency } = useSiteSettings();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || translate('Failed to update order status'));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: translate("Status Updated"),
        description: translate("Order status has been updated successfully."),
      });
    },
    onError: (error: Error) => {
      toast({
        title: translate("Update Failed"),
        description: error.message || translate("Failed to update order status. Please try again."),
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders?.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return order.customerName.toLowerCase().includes(searchLower) ||
           order.customerEmail.toLowerCase().includes(searchLower) ||
           order.id.toString().includes(searchLower);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{translate("Order Management")}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={translate("Search orders...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{translate("Orders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate("Order ID")}</TableHead>
                  <TableHead>{translate("Date")}</TableHead>
                  <TableHead>{translate("Customer")}</TableHead>
                  <TableHead>{translate("Items")}</TableHead>
                  <TableHead>{translate("Total")}</TableHead>
                  <TableHead>{translate("Status")}</TableHead>
                  <TableHead>{translate("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), "PPp")}</TableCell>
                    <TableCell>
                      <div>
                        <div>{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.quantity}x {translate(item.name)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {translate(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            updateOrderStatusMutation.mutate({
                              orderId: order.id,
                              status: "preparing"
                            });
                          }}
                          disabled={order.status !== "pending"}
                        >
                          {translate("Start Preparing")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            updateOrderStatusMutation.mutate({
                              orderId: order.id,
                              status: "ready"
                            });
                          }}
                          disabled={order.status !== "preparing"}
                        >
                          {translate("Mark Ready")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            updateOrderStatusMutation.mutate({
                              orderId: order.id,
                              status: "delivered"
                            });
                          }}
                          disabled={order.status !== "ready"}
                        >
                          {translate("Mark Delivered")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {translate("No orders found")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}