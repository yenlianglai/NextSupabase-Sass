import { SignUpForm } from "@/app/auth/sign-up/sign-up-form";

export default function Page() {
  return (
    <div className="h-full pricing-hero flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="animate-fade-in">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
