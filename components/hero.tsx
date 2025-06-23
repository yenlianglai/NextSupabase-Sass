import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="min-h-[80vh] flex flex-col gap-16 items-center justify-center pricing-hero px-4">
      <div className="flex gap-8 justify-center items-center animate-fade-in">
        <span className="border-l border-border rotate-45 h-6" />
      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <div className="text-center max-w-4xl animate-slide-up">
        <h2 className="text-5xl lg:text-6xl font-bold mb-6 gradient-text">
          Build Modern Apps Faster
        </h2>
        <p className="text-xl lg:text-2xl !leading-tight mx-auto max-w-3xl text-muted-foreground mb-8">
          The fastest way to build apps with{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline text-foreground transition-colors duration-200 btn-modern inline-block"
            rel="noreferrer"
          >
            Supabase
          </a>{" "}
          and{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            className="font-bold hover:underline text-foreground transition-colors duration-200 btn-modern inline-block"
            rel="noreferrer"
          >
            Next.js
          </a>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/essay-auditor">
            <Button size="lg" className="px-8 py-4 h-14 text-lg">
              Try Essay Auditor
            </Button>
          </Link>
          <Link href="/protected">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 h-14 text-lg"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
