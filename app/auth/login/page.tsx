import { LoginForm } from "@/app/auth/login/login-form";

export default async function Page() {
  return (
    <div className="h-full pricing-hero flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="animate-fade-in">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
