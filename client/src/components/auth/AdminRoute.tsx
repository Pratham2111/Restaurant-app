import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import type { User } from "@shared/schema";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
