import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Table, Server } from "@shared/schema";

export default function TableManagement() {
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tables, isLoading: loadingTables } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
  });

  const { data: servers, isLoading: loadingServers } = useQuery<Server[]>({
    queryKey: ["/api/servers/active"],
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
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Table Management</h1>
        <Button
          onClick={() => {
            // TODO: Implement add new table functionality
            toast({
              title: "Coming Soon",
              description: "Add new table functionality will be available soon.",
            });
          }}
        >
          Add New Table
        </Button>
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
