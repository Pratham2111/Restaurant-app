import { cn } from "../../lib/utils";

/**
 * Skeleton component for loading states
 * Displays a loading placeholder animation
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };