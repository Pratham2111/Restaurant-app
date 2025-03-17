import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, verifyOtpSchema } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PageSection } from "@/components/ui/page-section";
import { Loader2 } from "lucide-react";

export default function Register() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpForm = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to register');
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: "Please check your email for verification code.",
      });
      setIsVerifying(true);
      setRegisteredEmail(data.email);
      otpForm.setValue("email", data.email);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/auth/verify", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to verify');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your email has been verified. You can now login.",
      });
      navigate("/login");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to verify. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/auth/resend-verification", { email });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to resend code');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "A new verification code has been sent to your email.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: any) {
    registerMutation.mutate(data);
  }

  function onVerifySubmit(data: any) {
    verifyMutation.mutate(data);
  }

  function handleResendCode() {
    if (registeredEmail) {
      resendMutation.mutate(registeredEmail);
    }
  }

  if (isVerifying) {
    return (
      <PageSection className="bg-background min-h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md px-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Verify Email</CardTitle>
                <CardDescription className="text-center">
                  Enter the verification code sent to your email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(onVerifySubmit)} className="space-y-6">
                    <FormField
                      control={otpForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter 6-digit code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={verifyMutation.isPending}
                    >
                      {verifyMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleResendCode}
                      disabled={resendMutation.isPending}
                    >
                      {resendMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        "Resend Code"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Enter your details to create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login">
                      <a className="text-primary hover:underline">Login</a>
                    </Link>
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageSection>
  );
}