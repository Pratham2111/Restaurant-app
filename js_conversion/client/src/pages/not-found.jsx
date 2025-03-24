import { Link } from "wouter";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";

/**
 * NotFound page component
 * Displayed when a user navigates to a non-existent route
 */
export default function NotFound() {
  return (
    <Layout>
      <div className="container py-20 text-center">
        <div className="max-w-md mx-auto">
          {/* Error code */}
          <h1 className="text-9xl font-bold text-primary">404</h1>
          
          {/* Error message */}
          <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          {/* Navigation buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild>
              <Link href="/">
                <a>Return Home</a>
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/menu">
                <a>View Our Menu</a>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}