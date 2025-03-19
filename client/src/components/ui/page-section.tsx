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
    <section className={cn("w-full py-6", className)} {...props}>
      <div className={cn("container max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}