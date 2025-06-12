import { AuthButton } from "@/components/Navbar/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="h-full flex justify-between items-center p-5 text-sm">
      <div className="flex items-center justify-start gap-20">
        <Link href="/" className="font-bold text-lg gradient-text">
          LOGO
        </Link>
        <Link
          href="/products"
          className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
        >
          Products
        </Link>
        <Link
          href="/about"
          className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
        >
          About
        </Link>
        <Link
          href="/pricing"
          className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
        >
          Pricing
        </Link>
      </div>

      <div className="flex justify-end gap-5 items-center">
        <AuthButton />
        <ThemeSwitcher />
      </div>
    </div>
  );
};
