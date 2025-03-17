import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format } from "date-fns";
import {
  TableProperties,
  Users,
  UtensilsCrossed,
  DollarSign,
  ClipboardList,
  Coffee,
  TrendingUp
} from "lucide-react";
import type { Table, Order, MenuItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page-section";

// Predefined colors for charts
const COLORS = ['#ffc107', '#0ea5e9', '#10b981', '#f43f5e', '#8b5cf6'];

export default function Dashboard() {
  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: tables } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
  });

  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Calculate metrics
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const occupiedTables = tables?.filter(table => table.status === "occupied").length || 0;
  const totalTables = tables?.length || 0;
  const tableUtilization = totalTables ? (occupiedTables / totalTables) * 100 : 0;

  // Get popular menu items
  const popularItems = menuItems?.slice(0, 5).map(item => ({
    name: item.name,
    value: Math.floor(Math.random() * 50) + 10 // TODO: Replace with actual order count
  })) || [];

  // Generate hourly order data for the last 24 hours
  const hourlyOrders = Array.from({ length: 24 }, (_, i) => ({
    hour: format(new Date().setHours(i), 'ha'),
    orders: Math.floor(Math.random() * 20), // TODO: Replace with actual hourly data
    revenue: Math.floor(Math.random() * 1000)
  }));

  // Weekly revenue trend
  const weeklyRevenue = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      day: format(date, 'EEE'),
      revenue: Math.floor(Math.random() * 5000) + 1000 // TODO: Replace with actual daily revenue
    };
  }).reverse();

  return (
    <div className="w-full">
      <PageSection className="bg-background py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Restaurant Dashboard</h1>
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Link href="/admin/tables">
            <a>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TableProperties className="h-5 w-5" />
                    Table Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage tables, sections, and assignments
                  </p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/admin/menu">
            <a>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5" />
                    Menu Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Update menu items and categories
                  </p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/admin/orders">
            <a>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Order Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View and manage customer orders
                  </p>
                </CardContent>
              </Card>
            </a>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Orders today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Revenue today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Table Utilization</CardTitle>
              <TableProperties className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tableUtilization.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {occupiedTables} of {totalTables} tables occupied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {/* Hourly Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hourlyOrders}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#ffc107" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyRevenue}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Popular Items Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popularItems}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={(entry) => entry.name}
                    >
                      {popularItems.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Hour Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hourlyOrders}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </div>
  );
}