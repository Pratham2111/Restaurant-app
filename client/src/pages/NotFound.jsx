import React from "react";
import { Link } from "wouter";

/**
 * NotFound page component
 */
function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-8">Page Not Found</h2>
      <p className="mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <span className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors inline-block cursor-pointer">
          Go back to homepage
        </span>
      </Link>
    </div>
  );
}

export default NotFound;