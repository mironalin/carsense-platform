import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { getServiceTypeCategory, getServiceTypeLabel } from "../../utils/maintenance-utils";

type ServiceTypeBadgeProps = {
  serviceType: string;
};

export function ServiceTypeBadge({ serviceType }: ServiceTypeBadgeProps) {
  const category = getServiceTypeCategory(serviceType as any);
  const label = getServiceTypeLabel(serviceType as any);

  const categoryStyles = {
    "Routine Maintenance": "border-chart-1 text-chart-1 bg-chart-1/10 hover:bg-chart-1/20",
    "Engine & Transmission": "border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20",
    "Brakes & Suspension": "border-chart-4 text-chart-4 bg-chart-4/10 hover:bg-chart-4/20",
    "Electrical & Cooling": "border-chart-2 text-chart-2 bg-chart-2/10 hover:bg-chart-2/20",
    "Drivetrain & Power Steering": "border-chart-3 text-chart-3 bg-chart-3/10 hover:bg-chart-3/20",
    "Exhaust & Emissions": "border-chart-5 text-chart-5 bg-chart-5/10 hover:bg-chart-5/20",
    "Technology & Software": "border-primary text-primary bg-primary/10 hover:bg-primary/20",
    "Body & Interior": "border-secondary text-secondary bg-secondary/10 hover:bg-secondary/20",
    "Other": "border-muted-foreground text-muted-foreground bg-muted hover:bg-muted/80",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border transition-colors",
        categoryStyles[category as keyof typeof categoryStyles] || categoryStyles.Other,
      )}
    >
      {label}
    </Badge>
  );
}
