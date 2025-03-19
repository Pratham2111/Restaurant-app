import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { PageSection } from "@/components/ui/page-section";
import type { User, LoyaltyTier, LoyaltyPoint, LoyaltyReward } from "@shared/schema";
import { Moon, Sun, LogOut, Gift, Award, Star, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

export default function Account() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);

  const passwordForm = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 0,
    onError: () => {
      navigate("/login");
    }
  });

  const { data: tiers } = useQuery<LoyaltyTier[]>({
    queryKey: ["/api/loyalty/tiers"],
    enabled: !!user
  });

  const { data: points } = useQuery<LoyaltyPoint[]>({
    queryKey: ["/api/loyalty/points"],
    enabled: !!user
  });

  const { data: rewards } = useQuery<LoyaltyReward[]>({
    queryKey: ["/api/loyalty/rewards"],
    enabled: !!user
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordChangeInput) => {
      const res = await apiRequest("POST", "/api/auth/change-password", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to change password");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your password has been changed successfully."
      });
      setPasswordDialogOpen(false);
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive"
      });
    }
  });

  const redeemMutation = useMutation({
    mutationFn: async (rewardId: number) => {
      const res = await apiRequest("POST", `/api/loyalty/redeem/${rewardId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to redeem reward");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loyalty/points"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Success",
        description: "Reward redeemed successfully!"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to redeem reward",
        variant: "destructive"
      });
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

  const onPasswordSubmit = async (data: PasswordChangeInput) => {
    try {
      await changePasswordMutation.mutateAsync(data);
    } catch (error) {
      console.error("Password change error:", error);
    }
  };

  const currentTier = tiers?.find(tier => tier.id === user?.currentTierId);
  const nextTier = tiers?.find(tier => tier.minimumPoints > (user?.totalPoints || 0));

  const progressToNextTier = nextTier ? (
    ((user?.totalPoints || 0) - (currentTier?.minimumPoints || 0)) /
    (nextTier.minimumPoints - (currentTier?.minimumPoints || 0)) * 100
  ) : 100;

  if (userLoading) {
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
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Account Information */}
          <Card>
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
                  {format(new Date(user.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>

              <div className="flex gap-2">
                <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={changePasswordMutation.isPending}
                        >
                          {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

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

          {/* Loyalty Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Award className="h-6 w-6 text-restaurant-yellow" />
                Loyalty Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{currentTier?.name || 'Loading...'}</h3>
                  <span className="text-2xl font-bold text-restaurant-yellow">{user.totalPoints} pts</span>
                </div>
                {nextTier && (
                  <div className="space-y-1">
                    <Progress value={progressToNextTier} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {nextTier.minimumPoints - user.totalPoints} points until {nextTier.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Current Benefits:</h3>
                <ul className="space-y-2">
                  {currentTier?.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-restaurant-yellow" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Available Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Gift className="h-6 w-6 text-restaurant-yellow" />
                Available Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewards?.filter(reward => reward.isActive).map(reward => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{reward.name}</h4>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      <p className="text-sm font-medium text-restaurant-yellow mt-1">
                        {reward.pointsCost} points
                      </p>
                    </div>
                    <Button
                      onClick={() => redeemMutation.mutate(reward.id)}
                      disabled={user.totalPoints < reward.pointsCost || redeemMutation.isPending}
                    >
                      Redeem
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Points History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Points History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {points?.map(point => (
                  <div
                    key={point.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(point.createdAt), 'MMM d, yyyy')}
                      </p>
                      <p className="font-medium">{point.description}</p>
                    </div>
                    <span className={`font-bold ${point.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                      {point.type === 'earned' ? '+' : ''}{point.points}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageSection>
  );
}