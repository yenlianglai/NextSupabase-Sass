import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormRowProps {
  /** The label on the left side */
  label: React.ReactNode;
  /** The content on the right side (text, inputs, badges…) */
  children: React.ReactNode;
  /** Optional extra wrapper classes */
  className?: string;
}

export const Row = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ label, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex justify-between items-center py-6 border-b border-border/30 last:border-b-0 transition-colors hover:bg-accent/20",
        className
      )}
      {...props}
    >
      <div className="flex-1 text-base font-medium text-foreground/80">
        {label}
      </div>
      <div className="flex-1 flex items-end justify-end text-base font-semibold">
        {children}
      </div>
    </div>
  )
);
Row.displayName = "Row";
