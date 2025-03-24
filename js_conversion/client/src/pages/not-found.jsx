import { Link } from "wouter";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";

/**
 * Not Found page component
 * Displayed when a user navigates to a non-existent route
 */
export default function NotFound() {
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          We're sorry, the page you requested could not be found.
          Please check the URL or return to the homepage.
        </p>
        <Button asChild size="lg">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </Layout>
  );
}