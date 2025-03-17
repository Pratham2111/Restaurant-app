import { cn } from "@/lib/utils";

interface PageSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  containerClassName?: string;
}

export function PageSection({
  children,
  className,
  containerClassName,
  ...props
}: PageSectionProps) {
  return (
    <section className={cn("w-full", className)} {...props}>
      <div className={cn("max-w-[1440px] mx-auto px-4", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
