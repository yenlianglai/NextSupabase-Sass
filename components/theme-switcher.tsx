"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={"sm"}
          className="glass-effect border-border hover:bg-accent hover:border-primary/50"
        >
          {theme === "light" ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              className={"text-foreground hover:text-primary transition-colors"}
            />
          ) : theme === "dark" ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className={"text-foreground hover:text-primary transition-colors"}
            />
          ) : (
            <Laptop
              key="system"
              size={ICON_SIZE}
              className={"text-foreground hover:text-primary transition-colors"}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-content glass-effect border-border"
        align="start"
      >
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem
            className="flex gap-2 hover:bg-accent transition-colors text-foreground"
            value="light"
          >
            <Sun size={ICON_SIZE} className="text-foreground/70" />{" "}
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="flex gap-2 hover:bg-accent transition-colors text-foreground"
            value="dark"
          >
            <Moon size={ICON_SIZE} className="text-foreground/70" />{" "}
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="flex gap-2 hover:bg-accent transition-colors text-foreground"
            value="system"
          >
            <Laptop size={ICON_SIZE} className="text-foreground/70" />{" "}
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
