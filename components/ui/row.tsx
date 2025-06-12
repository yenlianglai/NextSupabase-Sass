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
        "flex justify-between items-center py-4 border-b last:border-b-0",
        className
      )}
      {...props}
    >
      <span className="flex-1 text-base font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <div className="flex-1 flex items-end justify-end text-base font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </div>
    </div>
  )
);
Row.displayName = "Row";
