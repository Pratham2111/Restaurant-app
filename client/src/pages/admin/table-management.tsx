import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import type { Table, Server } from "@shared/schema";

export default function TableManagement() {
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertTableSchema),
    defaultValues: {
      name: "",
      section: "main",
      seats: 2,
      shape: "round",
      status: "available",
      isActive: true,
      minimumSpend: 0,
      notes: ""
    }
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      form.reset({
        name: "",
        section: "main",
        seats: 2,
        shape: "round",
        status: "available",
        isActive: true,
        minimumSpend: 0,
        notes: ""
      });
      setEditingTable(null);
    }
  }, [dialogOpen, form]);

  const { data: tables, isLoading: loadingTables } = useQuery<Table[]>({
    queryKey: ["/api/tables"]
  });

  const { data: servers, isLoading: loadingServers } = useQuery<Server[]>({
    queryKey: ["/api/servers/active"]
  });

  const createTableMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/tables", {
        ...data,
        minimumSpend: Number(data.minimumSpend)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create table');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Success",
        description: "Table has been created successfully"
      });
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

  const updateTableMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/tables/${id}`, {
        ...data,
        minimumSpend: Number(data.minimumSpend)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update table');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Table Updated",
        description: "Table has been updated successfully."
      });
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update table. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteTableMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/tables/${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete table');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Table Deleted",
        description: "Table has been deleted successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete table. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateTableStatusMutation = useMutation({
    mutationFn: async ({ tableId, status }: { tableId: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/tables/${tableId}/status`, { status });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update status');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Status Updated",
        description: "Table status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update table status. Please try again.",
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
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to assign server');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Server Assigned",
        description: "Server has been assigned to the table successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign server to table. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: any) {
    if (editingTable) {
      updateTableMutation.mutate({ id: editingTable.id, data });
    } else {
      createTableMutation.mutate(data);
    }
  }

  // When editing a table, properly set the form values
  const handleEditTable = (table: Table) => {
    form.reset({
      name: table.name,
      section: table.section,
      seats: table.seats,
      shape: table.shape,
      status: table.status,
      isActive: table.isActive,
      minimumSpend: table.minimumSpend || 0,
      notes: table.notes || ""
    });
    setEditingTable(table);
    setDialogOpen(true);
  };

  if (loadingTables || loadingServers) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-restaurant-yellow" />
      </div>
    );
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
                <DialogTitle>
                  {editingTable ? "Edit Table" : "Add New Table"}
                </DialogTitle>
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
                            <SelectItem value="window">Window</SelectItem>
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
                    className="w-full"
                    disabled={createTableMutation.isPending || updateTableMutation.isPending}
                  >
                    {(createTableMutation.isPending || updateTableMutation.isPending) ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingTable ? "Updating..." : "Creating..."}
                      </span>
                    ) : (
                      editingTable ? "Update Table" : "Create Table"
                    )}
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

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTable(table)}
                    >
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the table
                            and remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteTableMutation.mutate(table.id)}
                          >
                            {deleteTableMutation.isPending ? (
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
                          disabled={updateTableStatusMutation.isPending}
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
                          disabled={updateTableStatusMutation.isPending}
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
                          disabled={updateTableStatusMutation.isPending}
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
                          disabled={updateTableStatusMutation.isPending}
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
                        disabled={createAssignmentMutation.isPending}
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