import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plan } from "../types";
import { SubscriptionService } from "../services/subscriptionService";
import { usePricingContext } from "../context/PricingContext";

interface PricingCardProps {
  plan: Plan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const { isCurrentPlan, isLoading, onSubscribe, onCancel, paddleReady } =
    usePricingContext();

  const isCurrent = isCurrentPlan(plan.name);

  const handleAction = () => {
    if (isCurrent) {
      onCancel();
    } else {
      onSubscribe(plan.productId, plan.name);
    }
  };

  return (
    <Card
      className={`gradient-card interactive-hover relative ${
        isCurrent ? "border-primary ring-1 ring-primary/20" : ""
      }`}
    >
      {/* Current Plan Badge */}
      {isCurrent && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            Current Plan
          </div>
        </div>
      )}

      <CardHeader className="pb-2 h-1/4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold capitalize mb-1 flex items-center justify-between">
              {plan.name}
              <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0">
                {isCurrent && (
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                )}
              </div>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {plan.subtitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-4 h-2/4">
        <div className="mb-6">
          <div className="flex items-baseline mb-2">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className="text-muted-foreground ml-2 text-sm">
              {plan.priceUnit}
            </span>
          </div>
        </div>

        <ul className="space-y-2 mb-2">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm">
              <svg
                className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      {SubscriptionService.shouldShowActionButton(plan) && (
        <CardFooter className="pt-6 h-1/4">
          <Button
            variant={SubscriptionService.getButtonVariant(isCurrent)}
            className={`w-full btn-modern ${
              isCurrent
                ? "light:bg-red-500 text-white hover:bg-red-600"
                : "bg-primary text-primary-foreground hover:bg-green-600/90"
            }`}
            onClick={handleAction}
            disabled={!paddleReady || isLoading}
          >
            {SubscriptionService.getButtonText(isCurrent, isLoading)}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
