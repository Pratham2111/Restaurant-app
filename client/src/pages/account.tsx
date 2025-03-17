import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { PageSection } from "@/components/ui/page-section";
import type { User } from "@shared/schema";
import { Moon, Sun, LogOut } from "lucide-react";

export default function Account() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 0,
    onError: () => {
      navigate("/login");
    }
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      await queryClient.resetQueries();
      toast({
        title: "Success",
        description: "You have been logged out successfully."
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <PageSection className="bg-background py-8">
        <div className="flex justify-center">Loading...</div>
      </PageSection>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageSection className="bg-background min-h-[calc(100vh-4rem)] py-8">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">My Account</CardTitle>
            <ThemeToggle />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-lg">{user.name}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-lg">{user.email}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
              <p className="text-lg">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button 
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageSection>
  );
}