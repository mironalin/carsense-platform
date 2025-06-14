import { Expand, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartFiltersSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-4">
        {/* Top row with search, favorites, chart type and theme */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left side - Search and Favorites */}
          <div className="flex items-center gap-3 flex-grow max-w-md">
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>

          {/* Right side - Chart Type and Theme */}
          <div className="flex items-center gap-3 ml-auto">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-10 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>

        {/* Category filters */}
        <div>
          <div className="flex justify-between items-center mb-2 relative">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-7 w-20" />
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SensorSkeleton() {
  // Random category color for the skeleton
  const colors = ["#3b82f6", "#ef4444", "#f59e0b", "#06b6d4", "#10b981", "#6b7280"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Card className="@container/card relative border-l-[3px]" style={{ borderLeftColor: randomColor }}>
      <div className="absolute right-2 top-2 z-10">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
          <Star className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute right-11 top-2 z-10">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
          <Expand className="h-5 w-5" />
        </Button>
      </div>

      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-5 w-1/4 ml-auto" />
        </div>
        <Skeleton className="h-4 w-1/4 mt-1" />
      </CardHeader>
      <CardContent className="p-2">
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

export function SensorChartOverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters skeleton */}
      <ChartFiltersSkeleton />

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SensorSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
