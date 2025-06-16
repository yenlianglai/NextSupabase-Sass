import { Button } from "@/components/ui/button";

interface PricingHeaderProps {
  isMonthly: boolean;
  onToggle: (isMonthly: boolean) => void;
}

export function PricingHeader({ isMonthly, onToggle }: PricingHeaderProps) {
  return (
    <header className="text-center mb-16 animate-fade-in">
      <h1 className="text-5xl font-bold mb-4 gradient-text">
        Choose a plan that&apos;s right for you
      </h1>
      <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
        Try our basic plan risk free for 30 days. Switch plans or cancel any
        time.
      </p>

      {/* Pricing Toggle */}
      <div className="flex items-center justify-center mb-12 animate-slide-up">
        <div className="glass-effect rounded-lg p-1 flex">
          <Button
            variant={isMonthly ? "default" : "ghost"}
            size="sm"
            className={`btn-modern ${
              isMonthly
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            onClick={() => onToggle(true)}
          >
            Monthly pricing
          </Button>
          <Button
            variant={!isMonthly ? "default" : "ghost"}
            size="sm"
            className={`btn-modern ${
              !isMonthly
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            onClick={() => onToggle(false)}
          >
            Annual pricing
          </Button>
        </div>
      </div>
    </header>
  );
}
