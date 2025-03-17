import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { PageSection } from "@/components/ui/page-section";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const verifySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

type LoginForm = z.infer<typeof loginSchema>;
type VerifyForm = z.infer<typeof verifySchema>;

export default function Login() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const verifyForm = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to login');
      }
      return res.json();
    },
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      navigate("/");
    },
    onError: (error: any) => {
      if (error.response?.needsVerification) {
        setIsVerifying(true);
        setVerifyEmail(form.getValues().email);
        verifyForm.setValue("email", form.getValues().email);
        toast({
          title: "Verification Required",
          description: "Please verify your email before logging in.",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to login. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyForm) => {
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
        description: "Your email has been verified. Please login.",
      });
      setIsVerifying(false);
      form.reset();
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

  function onSubmit(data: LoginForm) {
    loginMutation.mutate(data);
  }

  function onVerifySubmit(data: VerifyForm) {
    verifyMutation.mutate(data);
  }

  function handleResendCode() {
    if (verifyEmail) {
      resendMutation.mutate(verifyEmail);
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
                <Form {...verifyForm}>
                  <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
                    <FormField
                      control={verifyForm.control}
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
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Login to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register">
                      <a className="text-primary hover:underline">Register</a>
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