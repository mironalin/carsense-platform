import { CalendarIcon, DollarSignIcon, TrendingUpIcon, WrenchIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MaintenanceSummarySkeleton() {
  const skeletonCards = [
    {
      title: "Total Services",
      icon: WrenchIcon,
    },
    {
      title: "Total Cost",
      icon: DollarSignIcon,
    },
    {
      title: "Most Common Service",
      icon: TrendingUpIcon,
    },
    {
      title: "Last Service",
      icon: CalendarIcon,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {skeletonCards.map(card => (
        <Card key={card.title} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col justify-between flex-1">
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
