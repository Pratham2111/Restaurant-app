import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTableSchema } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Table, Server } from "@shared/schema";

export default function TableManagement() {
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertTableSchema),
    defaultValues: {
      name: "",
      section: "main",
      seats: 2,
      shape: "round",
      status: "available",
      isActive: true,
      minimumSpend: "0",
      notes: ""
    }
  });

  const { data: tables, isLoading: loadingTables } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
  });

  const { data: servers, isLoading: loadingServers } = useQuery<Server[]>({
    queryKey: ["/api/servers/active"],
  });

  const createTableMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/tables", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create table');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Table Created",
        description: "New table has been added successfully."
      });
      form.reset();
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create table. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateTableStatusMutation = useMutation({
    mutationFn: async ({ tableId, status }: { tableId: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/tables/${tableId}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Status Updated",
        description: "Table status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update table status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async ({ tableId, serverId }: { tableId: number; serverId: number }) => {
      const res = await apiRequest("POST", "/api/table-assignments", {
        tableId,
        serverId,
        startTime: new Date().toISOString(),
        status: "active",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Server Assigned",
        description: "Server has been assigned to the table successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign server to table. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: any) {
    createTableMutation.mutate(data);
  }

  if (loadingTables || loadingServers) {
    return <div className="container py-8">Loading...</div>;
  }

  const sections = ["all", ...new Set(tables?.map(table => table.section))];
  const filteredTables = tables?.filter(
    table => selectedSection === "all" || table.section === selectedSection
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "reserved":
        return "bg-yellow-500";
      case "maintenance":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Table Management</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Table</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Table Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="main">Main</SelectItem>
                            <SelectItem value="outdoor">Outdoor</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="bar">Bar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Seats</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="12"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shape"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Table Shape</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select shape" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="round">Round</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="rectangular">Rectangular</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-restaurant-yellow text-restaurant-black hover:bg-restaurant-yellow/90"
                    disabled={createTableMutation.isPending}
                  >
                    {createTableMutation.isPending ? "Creating..." : "Create Table"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <Select
            value={selectedSection}
            onValueChange={setSelectedSection}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map(section => (
                <SelectItem key={section} value={section}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables?.map(table => (
            <Card key={table.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{table.name}</span>
                  <Badge className={getStatusColor(table.status)}>
                    {table.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Section: {table.section}</p>
                    <p className="text-sm text-muted-foreground">Seats: {table.seats}</p>
                    <p className="text-sm text-muted-foreground">Shape: {table.shape}</p>
                  </div>

                  <Tabs defaultValue="status" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="status">Status</TabsTrigger>
                      <TabsTrigger value="assign">Assign</TabsTrigger>
                    </TabsList>
                    <TabsContent value="status">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant={table.status === "available" ? "default" : "outline"}
                          onClick={() => updateTableStatusMutation.mutate({
                            tableId: table.id,
                            status: "available"
                          })}
                        >
                          Available
                        </Button>
                        <Button
                          size="sm"
                          variant={table.status === "occupied" ? "default" : "outline"}
                          onClick={() => updateTableStatusMutation.mutate({
                            tableId: table.id,
                            status: "occupied"
                          })}
                        >
                          Occupied
                        </Button>
                        <Button
                          size="sm"
                          variant={table.status === "reserved" ? "default" : "outline"}
                          onClick={() => updateTableStatusMutation.mutate({
                            tableId: table.id,
                            status: "reserved"
                          })}
                        >
                          Reserved
                        </Button>
                        <Button
                          size="sm"
                          variant={table.status === "maintenance" ? "default" : "outline"}
                          onClick={() => updateTableStatusMutation.mutate({
                            tableId: table.id,
                            status: "maintenance"
                          })}
                        >
                          Maintenance
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="assign">
                      <Select
                        onValueChange={(value) => {
                          createAssignmentMutation.mutate({
                            tableId: table.id,
                            serverId: parseInt(value)
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign server" />
                        </SelectTrigger>
                        <SelectContent>
                          {servers?.map(server => (
                            <SelectItem key={server.id} value={server.id.toString()}>
                              {server.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}