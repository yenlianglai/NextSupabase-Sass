"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface NavLinksProps {
  links: { href: string; label: string; icon?: React.ReactNode }[];
}

export const NavLinks = ({ links }: NavLinksProps) => {
  const pathname = usePathname();

  // Memoize the active states to prevent unnecessary recalculations
  const activeStates = useMemo(() => {
    return links.reduce((acc, link) => {
      acc[link.href] = pathname === link.href;
      return acc;
    }, {} as Record<string, boolean>);
  }, [pathname, links]);

  return (
    <div className="flex items-center gap-8">
      {links.map((link) => {
        const isActive = activeStates[link.href];

        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? "relative px-3 py-2 rounded-lg font-medium tracking-tight transition-all duration-75 ease-out text-primary bg-primary/10 shadow-sm border border-primary/20 dark:bg-primary/15 dark:border-primary/30 dark:shadow-lg dark:shadow-primary/5 backdrop-blur-sm"
                : "relative px-3 py-2 rounded-lg font-medium tracking-tight transition-all duration-75 ease-out text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/70 dark:text-muted-foreground/80 dark:hover:text-foreground/90 backdrop-blur-sm"
            }
          >
            <div className="flex items-center gap-2">
              {link.icon && (
                <span className="w-4 h-4 flex items-center justify-center">
                  {link.icon}
                </span>
              )}
              {link.label && (
                <span className="text-sm font-semibold">{link.label}</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
