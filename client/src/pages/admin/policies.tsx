import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useLocation } from "wouter";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function PolicyPage() {
  const { type } = useParams();
  const [, navigate] = useLocation();
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getContent = () => {
    switch (type) {
      case "privacy":
        return {
          title: "Privacy Policy",
          content: settings?.privacyPolicy
        };
      case "cookies":
        return {
          title: "Cookie Policy",
          content: settings?.cookiePolicy
        };
      case "terms":
        return {
          title: "Terms & Conditions",
          content: settings?.termsConditions
        };
      default:
        return {
          title: "Policy Not Found",
          content: "The requested policy page does not exist."
        };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/settings")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
            ) : (
              <p>No content available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
