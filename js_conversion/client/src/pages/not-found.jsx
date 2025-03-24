import { Link } from "wouter";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { HomeIcon, UtensilsCrossed } from "lucide-react";

/**
 * NotFound page component
 * Displayed when user navigates to a non-existent route
 */
export default function NotFound() {
  return (
    <Layout>
      <div className="container py-20 text-center">
        <div className="max-w-md mx-auto">
          {/* Error code and icons */}
          <div className="mb-8">
            <div className="flex justify-center items-center mb-6">
              <UtensilsCrossed className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/menu">
                View Our Menu
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}