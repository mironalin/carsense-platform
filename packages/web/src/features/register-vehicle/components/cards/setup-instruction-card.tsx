import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SetupStep = {
  number: number;
  description: string;
};

type SetupInstructionCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  steps: SetupStep[];
  alertIcon: ReactNode;
  alertTitle: string;
  alertDescription: string;
};

export function SetupInstructionCard({
  icon,
  title,
  description,
  steps,
  alertIcon,
  alertTitle,
  alertDescription,
}: SetupInstructionCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {steps.map(step => (
            <div key={step.number} className="flex items-start gap-3">
              <div className="flex h-6 w-6 min-w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0">
                {step.number}
              </div>
              <p className="text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <Alert>
          {alertIcon}
          <AlertTitle>{alertTitle}</AlertTitle>
          <AlertDescription>{alertDescription}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
