import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plan } from "../types";
import { SubscriptionService } from "../services/subscriptionService";
import { usePricingContext } from "../context/PricingContext";

interface FeatureTableProps {
  plans: Plan[];
}

const CheckIcon = ({ isActive }: { isActive: boolean }) => (
  <div className="flex justify-center">
    <div
      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
        isActive ? "border-primary" : "border-border"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-primary" : "bg-muted"
        }`}
      ></div>
    </div>
  </div>
);

const TableSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <>
    <TableRow className="border-border hover:bg-accent/50">
      <TableCell
        colSpan={5}
        className="text-lg font-semibold text-foreground/80 py-4 border-t border-border"
      >
        {title}
      </TableCell>
    </TableRow>
    {children}
  </>
);

const FeatureRow = ({
  label,
  values,
}: {
  label: string;
  values: (string | React.ReactNode)[];
}) => (
  <TableRow className="border-border/50 hover:bg-accent/30">
    <TableCell className="font-medium text-muted-foreground py-4">
      {label}
    </TableCell>
    {values.map((value, index) => (
      <TableCell key={index} className="text-center py-4">
        {value}
      </TableCell>
    ))}
  </TableRow>
);

export function FeatureTable({ plans }: FeatureTableProps) {
  const { isCurrentPlan, isLoading, onSubscribe, onCancel, paddleReady } =
    usePricingContext();

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-1/5 text-muted-foreground min-w-[120px]"></TableHead>
                {plans.map((plan) => {
                  const isCurrent = isCurrentPlan(plan.name);
                  return (
                    <TableHead key={plan.id} className="text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex gap-2">
                          <h4
                            className={`font-semibold text-lg capitalize ${
                              isCurrent ? "text-primary" : ""
                            }`}
                          >
                            {plan.name}
                          </h4>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{plan.price}</span>
                          <br />
                          <span className="text-xs">{plan.priceUnit}</span>
                        </div>
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSection title="Basic features">
                <FeatureRow
                  label="Users"
                  values={[
                    "5",
                    "10",
                    "20",
                    <span
                      key="unlimited"
                      className="text-primary font-semibold"
                    >
                      Unlimited
                    </span>,
                  ]}
                />
                <FeatureRow
                  label="Individual data"
                  values={[
                    "1GB",
                    "20GB",
                    "40GB",
                    <span
                      key="unlimited"
                      className="text-primary font-semibold"
                    >
                      Unlimited
                    </span>,
                  ]}
                />
                <FeatureRow
                  label="Support"
                  values={[
                    <CheckIcon key="0" isActive={false} />,
                    <CheckIcon key="1" isActive={false} />,
                    <CheckIcon key="2" isActive={true} />,
                    <CheckIcon key="3" isActive={true} />,
                  ]}
                />
              </TableSection>

              <TableSection title="Reporting and analytics">
                <FeatureRow
                  label="Analytics"
                  values={[
                    <span key="0" className="text-muted-foreground">
                      Limited
                    </span>,
                    <span key="1" className="text-muted-foreground">
                      Basic
                    </span>,
                    "Advanced",
                    "Advanced",
                  ]}
                />
                <FeatureRow
                  label="Export reports"
                  values={[
                    <CheckIcon key="0" isActive={false} />,
                    <CheckIcon key="1" isActive={false} />,
                    <CheckIcon key="2" isActive={true} />,
                    <CheckIcon key="3" isActive={true} />,
                  ]}
                />
              </TableSection>

              {/* Action Buttons Row */}
              <TableRow className="border-border hover:bg-transparent">
                <TableCell className="font-medium text-muted-foreground py-6 border-t border-border">
                  Get Started
                </TableCell>
                {plans.map((plan) => {
                  const isCurrent = isCurrentPlan(plan.name);
                  return SubscriptionService.shouldShowActionButton(plan) ? (
                    <TableCell
                      key={plan.id}
                      className="text-center py-6 border-t border-border"
                    >
                      <Button
                        variant={SubscriptionService.getButtonVariant(
                          isCurrent
                        )}
                        className={`min-w-32 btn-modern ${
                          isCurrent
                            ? "light:bg-red-500 text-white hover:bg-red-600"
                            : "bg-primary text-primary-foreground hover:bg-green-600/90"
                        }`}
                        onClick={() =>
                          isCurrent ? onCancel() : onSubscribe(plan.productId)
                        }
                        disabled={!paddleReady || isLoading}
                      >
                        {SubscriptionService.getButtonText(
                          isCurrent,
                          isLoading
                        )}
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell key={plan.id} />
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
