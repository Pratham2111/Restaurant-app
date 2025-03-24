import { Link } from "wouter";
import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/menu">View Menu</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;