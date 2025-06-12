import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import UserProfileButton from "@/components/Navbar/userProfile-button";
import { redirect } from "next/navigation";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button
          asChild
          size="sm"
          variant={"outline"}
          className="glass-effect border-border hover:bg-accent hover:border-primary/50 text-foreground font-medium"
        >
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant={"default"}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium btn-modern"
        >
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }
  if (!user.email) {
    redirect("/auth/error");
  }

  return (
    <div className="flex  items-center justify-center gap-5">
      <UserProfileButton />
    </div>
  );
}
