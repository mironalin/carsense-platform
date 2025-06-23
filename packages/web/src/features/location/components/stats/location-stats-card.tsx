import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type LocationStatsCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  isLoading?: boolean;
};

export function LocationStatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  isLoading = false 
}: LocationStatsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-full" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-2">
                {description}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 