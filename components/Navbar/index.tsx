import { AuthButton } from "@/components/Navbar/auth-button";
import { LogoButton } from "@/components/Navbar/logo-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const Navbar = () => {
  return (
    <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
      <LogoButton />

      <div className="flex justify-end w-1/3 gap-5 items-center mr-5">
        <AuthButton />
        <ThemeSwitcher />
      </div>
    </div>
  );
};
