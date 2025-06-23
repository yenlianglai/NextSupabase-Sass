import { AuthButton } from "@/components/Navbar/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoButton } from "@/components/Navbar/logo-button";
import { NavLinks } from "@/components/Navbar/nav-links";
import { PenTool, Play, DollarSign } from "lucide-react";

export const Navbar = () => {
  const navLinks = [
    {
      href: "/essay-auditor",
      icon: <PenTool className="w-4 h-4" />,
      label: "About",
    },
    {
      href: "/essay-auditor/exam-hall",
      label: "Start",
      icon: <Play className="w-4 h-4" />,
    },
    {
      href: "/pricing",
      label: "Pricing",
      icon: <DollarSign className="w-4 h-4" />,
    },
  ];

  return (
    <div className="h-full flex justify-between items-center px-6 py-4 backdrop-blur-md">
      {/* Left section */}
      <div className="flex items-center gap-12">
        <LogoButton />
        <NavLinks links={navLinks} />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <AuthButton />
        <div className="w-px h-6 bg-border dark:bg-border/60" />
        <ThemeSwitcher />
      </div>
    </div>
  );
};
